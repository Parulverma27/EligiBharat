"""Unit tests for evaluation/score.py (Wilson CI, Cohen's kappa, confusion matrix, unsure filtering)."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from evaluation.score import cohens_kappa, compute_metrics, wilson_ci


def test_wilson_ci_bounds():
    low, high = wilson_ci(80, 100)
    assert 0.70 < low < 0.80
    assert 0.80 < high < 0.88
    assert wilson_ci(0, 0) == (0.0, 0.0)


def test_false_not_eligible_and_false_eligible_counts():
    records = [
        {"human_label": "eligible", "pred_status": "eligible", "caveat_count": 0},          # TP
        {"human_label": "eligible", "pred_status": "possibly_eligible", "caveat_count": 2}, # TP (safe)
        {"human_label": "eligible", "pred_status": "not_eligible", "caveat_count": 0},      # FN (false not_eligible)
        {"human_label": "not_eligible", "pred_status": "not_eligible", "caveat_count": 0},  # TN
        {"human_label": "not_eligible", "pred_status": "eligible", "caveat_count": 3},      # FP with caveats
        {"human_label": "unsure", "pred_status": "not_eligible", "caveat_count": 0},        # excluded
    ]
    m = compute_metrics(records)
    assert m["total"] == 5
    assert m["correct"] == 3
    assert m["tp_eligible"] == 2
    assert m["tn_not_eligible"] == 1
    assert m["false_not_eligible_count"] == 1
    assert m["false_eligible_count"] == 1
    assert m["false_eligible_with_caveats"] == 1


def test_cohens_kappa():
    a = ["eligible", "not_eligible", "eligible", "not_eligible"]
    b = ["eligible", "not_eligible", "eligible", "not_eligible"]
    assert cohens_kappa(a, b) == 1.0

    c = ["eligible", "not_eligible", "not_eligible", "eligible"]
    assert cohens_kappa(a, c) == 0.0


if __name__ == "__main__":
    tests = [v for k, v in dict(globals()).items() if k.startswith("test_")]
    for t in tests:
        t()
        print("PASS", t.__name__)
    print(f"\nAll {len(tests)} scorer tests passed.")
