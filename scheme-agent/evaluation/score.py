"""Score the deterministic eligibility checker against hand-labeled cases in evaluation/cases.csv.

Reports:
- Overall eligibility accuracy with 95% Wilson confidence interval
- False 'not_eligible' count and rate (eligible citizen turned away — worst error)
- False 'eligible' count and rate (and how many carried unchecked caveats)
- Precision and recall for 'eligible'
- Breakdown by split (dev / test) and by scheme group
- Extraction review summary from data/rules_review.csv

Usage:
    python evaluation/score.py --rules-dir data/rules_v1 --split dev --tag m2-baseline
    python evaluation/score.py --rules-dir data/rules_v1 --split all --tag m2-baseline
"""
import argparse
import csv
import json
import math
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config
from checker import check
from schema import SchemeRules, UserProfile


def wilson_ci(correct: int, total: int, z: float = 1.96) -> tuple[float, float]:
    """Compute 95% Wilson score confidence interval for a binomial proportion."""
    if total == 0:
        return (0.0, 0.0)
    p = correct / total
    denom = 1.0 + (z * z) / total
    center = (p + (z * z) / (2.0 * total)) / denom
    half = (z * math.sqrt((p * (1.0 - p) + (z * z) / (4.0 * total)) / total)) / denom
    low = max(0.0, center - half)
    high = min(1.0, center + half)
    return (round(low, 4), round(high, 4))


def cohens_kappa(labels_a: list[str], labels_b: list[str]) -> float:
    """Compute Cohen's kappa for inter-annotator agreement across two label lists."""
    if len(labels_a) != len(labels_b) or not labels_a:
        raise ValueError("Label lists must be non-empty and of equal length.")
    n = len(labels_a)
    classes = sorted(set(labels_a) | set(labels_b))
    agree = sum(1 for a, b in zip(labels_a, labels_b) if a == b)
    p_o = agree / n
    p_e = 0.0
    for c in classes:
        p_a = sum(1 for a in labels_a if a == c) / n
        p_b = sum(1 for b in labels_b if b == c) / n
        p_e += p_a * p_b
    if abs(1.0 - p_e) < 1e-12:
        return 1.0
    return round((p_o - p_e) / (1.0 - p_e), 4)


def map_prediction_to_binary(status: str) -> str:
    """Map checker status ('eligible', 'possibly_eligible', 'not_eligible', 'need_more_info')
    to binary decision for comparison against ground-truth ('eligible' vs 'not_eligible').
    Note: 'possibly_eligible' counts as not turning the user away ('eligible' side),
    while we also track exact status counts separately.
    """
    if status in {"eligible", "possibly_eligible"}:
        return "eligible"
    if status == "not_eligible":
        return "not_eligible"
    return "need_more_info"


def compute_metrics(records: list[dict]) -> dict:
    """Compute accuracy, 95% Wilson CI, false_not_eligible, false_eligible, precision, recall."""
    valid = [r for r in records if r["human_label"] in {"eligible", "not_eligible"}]
    total = len(valid)
    if total == 0:
        return {"total": 0}

    correct = 0
    tp = fp = tn = fn = 0
    false_eligible_with_caveats = 0
    possibly_eligible_on_true_eligible = 0
    possibly_eligible_on_true_not_eligible = 0
    need_more_info_count = 0

    for r in valid:
        truth = r["human_label"]
        raw_status = r["pred_status"]
        pred = map_prediction_to_binary(raw_status)
        has_caveats = r.get("caveat_count", 0) > 0

        if raw_status == "possibly_eligible":
            if truth == "eligible":
                possibly_eligible_on_true_eligible += 1
            else:
                possibly_eligible_on_true_not_eligible += 1

        if pred == truth:
            correct += 1

        if truth == "eligible":
            if pred == "eligible":
                tp += 1
            elif pred == "not_eligible":
                fn += 1  # False 'not_eligible' (worst error: eligible citizen turned away)
            else:
                need_more_info_count += 1
                fn += 1
        else:  # truth == "not_eligible"
            if pred == "not_eligible":
                tn += 1
            elif pred == "eligible":
                fp += 1  # False 'eligible'
                if has_caveats or raw_status == "possibly_eligible":
                    false_eligible_with_caveats += 1
            else:
                need_more_info_count += 1

    acc = round(correct / total, 4)
    ci_low, ci_high = wilson_ci(correct, total)
    precision = round(tp / (tp + fp), 4) if (tp + fp) > 0 else 0.0
    recall = round(tp / (tp + fn), 4) if (tp + fn) > 0 else 0.0
    f1 = round(2 * precision * recall / (precision + recall), 4) if (precision + recall) > 0 else 0.0

    return {
        "total": total,
        "correct": correct,
        "accuracy": acc,
        "wilson_95_ci": [ci_low, ci_high],
        "tp_eligible": tp,
        "tn_not_eligible": tn,
        "false_not_eligible_count": fn,
        "false_not_eligible_rate": round(fn / (tp + fn), 4) if (tp + fn) > 0 else 0.0,
        "false_eligible_count": fp,
        "false_eligible_with_caveats": false_eligible_with_caveats,
        "possibly_eligible_on_true_eligible": possibly_eligible_on_true_eligible,
        "possibly_eligible_on_true_not_eligible": possibly_eligible_on_true_not_eligible,
        "need_more_info_count": need_more_info_count,
        "precision_eligible": precision,
        "recall_eligible": recall,
        "f1_eligible": f1,
    }


def summarize_extraction_review(review_csv: Path) -> dict:
    if not review_csv.exists():
        return {}
    with open(review_csv, "r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    counts = {"yes": 0, "partly": 0, "no": 0, "unlabeled": 0}
    for r in rows:
        v = (r.get("extraction_correct") or "").strip().lower()
        if v in counts:
            counts[v] += 1
        else:
            counts["unlabeled"] += 1
    return counts


def evaluate_cases(cases_csv: Path, rules_dir: Path, split_filter: str = "all") -> tuple[dict, list[dict]]:
    with open(cases_csv, "r", encoding="utf-8-sig") as f:
        cases = list(csv.DictReader(f))

    if split_filter in {"dev", "test"}:
        cases = [c for c in cases if c["split"] == split_filter]

    evaluated = []
    errors = []

    for c in cases:
        label = (c.get("human_label") or "").strip().lower()
        if label not in {"eligible", "not_eligible"}:
            continue

        slug = c["slug"]
        rule_file = rules_dir / f"{slug}.json"
        if not rule_file.exists():
            raise FileNotFoundError(f"Missing extracted rules file: {rule_file}")

        rec = json.loads(rule_file.read_text(encoding="utf-8"))
        rules = SchemeRules(**rec["rules"])
        profile = UserProfile(**json.loads(c["profile_json"]))
        res = check(profile, rules, rec.get("scope_state"))

        item = {
            "case_id": c["case_id"],
            "split": c["split"],
            "group": c.get("group", ""),
            "slug": slug,
            "scheme": c["scheme"],
            "persona_id": c["persona_id"],
            "persona_description": c.get("persona_description", ""),
            "human_label": label,
            "pred_status": res.status,
            "pred_binary": map_prediction_to_binary(res.status),
            "caveat_count": len(res.caveats),
            "passed": res.passed,
            "failed": res.failed,
            "missing": res.missing,
            "caveats": res.caveats,
            "label_notes": c.get("label_notes", ""),
        }
        evaluated.append(item)
        if item["pred_binary"] != label:
            errors.append(item)

    overall = compute_metrics(evaluated)
    by_split = {}
    for sp in ("dev", "test"):
        sub = [e for e in evaluated if e["split"] == sp]
        if sub:
            by_split[sp] = compute_metrics(sub)

    by_group = {}
    for grp in sorted({e["group"] for e in evaluated if e["group"]}):
        by_group[grp] = compute_metrics([e for e in evaluated if e["group"] == grp])

    summary = {
        "rules_dir": str(rules_dir),
        "split_filter": split_filter,
        "overall": overall,
        "by_split": by_split,
        "by_group": by_group,
        "extraction_review": summarize_extraction_review(config.ROOT / "data" / "rules_review.csv"),
        "error_count": len(errors),
    }
    return summary, errors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cases", default=str(Path(__file__).resolve().parent / "cases.csv"))
    ap.add_argument("--rules-dir", default=str(config.ROOT / "data" / "rules_v1"))
    ap.add_argument("--split", choices=["dev", "test", "all"], default="all")
    ap.add_argument("--tag", default="m2-baseline", help="label for saved result JSON")
    args = ap.parse_args()

    summary, errors = evaluate_cases(Path(args.cases), Path(args.rules_dir), args.split)

    results_dir = Path(__file__).resolve().parent / "results"
    results_dir.mkdir(parents=True, exist_ok=True)
    out_file = results_dir / f"{args.tag}_{args.split}.json"
    out_file.write_text(
        json.dumps({"summary": summary, "errors": errors}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    ov = summary["overall"]
    print(f"\n=== Evaluation Report ({args.tag} | split={args.split}) ===")
    print(f"Total cases scored        : {ov['total']}")
    print(f"Accuracy                  : {ov['accuracy']*100:.1f}% ({ov['correct']}/{ov['total']}) "
          f"[95% Wilson CI: {ov['wilson_95_ci'][0]*100:.1f}% - {ov['wilson_95_ci'][1]*100:.1f}%]")
    print(f"False 'not_eligible' (FN) : {ov['false_not_eligible_count']} "
          f"(rate: {ov['false_not_eligible_rate']*100:.1f}% of true eligible)")
    print(f"False 'eligible' (FP)     : {ov['false_eligible_count']} "
          f"({ov['false_eligible_with_caveats']} carried caveats)")
    print(f"Precision / Recall / F1   : P={ov['precision_eligible']:.3f} | "
          f"R={ov['recall_eligible']:.3f} | F1={ov['f1_eligible']:.3f}")

    if summary["by_split"]:
        print("\n--- Breakdown by Split ---")
        for sp, m in summary["by_split"].items():
            print(f"  {sp.upper():4s}: Acc={m['accuracy']*100:.1f}% ({m['correct']}/{m['total']}) "
                  f"CI=[{m['wilson_95_ci'][0]*100:.1f}%, {m['wilson_95_ci'][1]*100:.1f}%] | "
                  f"False not_eligible={m['false_not_eligible_count']} | False eligible={m['false_eligible_count']}")

    if summary["by_group"]:
        print("\n--- Breakdown by Scheme Group ---")
        for grp, m in summary["by_group"].items():
            print(f"  {grp:14s}: Acc={m['accuracy']*100:.1f}% ({m['correct']}/{m['total']}) | "
                  f"FN={m['false_not_eligible_count']} | FP={m['false_eligible_count']}")

    if summary["extraction_review"]:
        print(f"\n--- Extraction Review (30 schemes) ---\n  {summary['extraction_review']}")

    print(f"\nSaved full metrics and {len(errors)} error records to {out_file}")


if __name__ == "__main__":
    main()
