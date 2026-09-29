"""Use the local LLM to turn each scheme's eligibility TEXT into structured JSON rules.

Examples:
    python extract_rules.py                 # the 30 schemes in eval_schemes.txt (resumable)
    python extract_rules.py --slug apy      # just one scheme
    python extract_rules.py --force         # redo even if a result file already exists
"""
import argparse
import json
import time

import ollama
import pandas as pd

import config
import utils
from schema import SchemeRules

SYSTEM_PROMPT = """You extract eligibility rules from Indian government scheme text into JSON.
Rules:
- Use ONLY facts explicitly stated in the text. If something is not stated, use null (numbers/booleans) or [] (lists). Never guess.
- min_age / max_age: age limits in years, inclusive. "60 years and above" -> min_age 60. "between 18 and 40" -> min_age 18, max_age 40.
- max_annual_income_inr: annual income ceiling in rupees. Convert: 1 lakh = 100000, 2.5 lakh = 250000, monthly income x 12.
- genders: only if the scheme is restricted to certain genders (widow, women, girls -> ["female"]). Otherwise [].
- social_categories: only if restricted to some of SC, ST, OBC, General, EWS, Minority. Otherwise [].
- occupations: short lowercase words for a required occupation or status, e.g. "farmer", "student", "worker". Otherwise [].
- requires_disability / requires_bpl: true only if explicitly required, else null.
- other_conditions: important conditions that do not fit the fields above (education level, land holding, marital status, residency period...). Short phrases.
- exclusions: who is NOT eligible, as short phrases.

Example text: "Women aged 60 years or above whose family income is below Rs. 1,50,000 per year and who belong to SC or ST are eligible. Government employees are not eligible."
Example JSON: {"min_age": 60, "max_age": null, "max_annual_income_inr": 150000, "genders": ["female"], "social_categories": ["SC", "ST"], "occupations": [], "requires_disability": null, "requires_bpl": null, "other_conditions": [], "exclusions": ["government employees"]}"""


def build_input(row) -> str:
    """Eligibility text, plus the exclusions column if it adds something new."""
    elig = utils.clean(row[config.COL_ELIG])
    excl = utils.clean(row[config.COL_EXCL])
    text = elig
    if excl and excl not in elig:
        text += "\n\nExclusions:\n" + excl
    return text[: config.EXTRACT_MAX_INPUT_CHARS]


def extract_one(text: str) -> SchemeRules:
    resp = ollama.chat(
        model=config.LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Text:\n{text}\n\nReturn the JSON."},
        ],
        format=SchemeRules.model_json_schema(),   # forces valid JSON in exactly this shape
        options={"temperature": 0, "num_ctx": 4096, "num_predict": config.EXTRACT_MAX_TOKENS},
    )
    return SchemeRules.model_validate_json(resp["message"]["content"])


def load_slugs(path):
    lines = [ln.strip() for ln in path.read_text(encoding="utf-8").splitlines()]
    return [ln for ln in lines if ln and not ln.startswith("#")]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", help="extract a single scheme")
    ap.add_argument("--force", action="store_true", help="redo existing results")
    args = ap.parse_args()

    df = pd.read_csv(config.DATA_CSV, encoding="utf-8-sig").set_index(config.COL_SLUG, drop=False)
    slugs = [args.slug] if args.slug else load_slugs(config.EVAL_SLUGS_FILE)
    config.RULES_DIR.mkdir(parents=True, exist_ok=True)

    ok = failed = skipped = 0
    for n, slug in enumerate(slugs, 1):
        out = config.RULES_DIR / f"{slug}.json"
        if out.exists() and not args.force:
            skipped += 1
            continue
        if slug not in df.index:
            print(f"[{n}/{len(slugs)}] {slug}: NOT FOUND in dataset, skipping")
            failed += 1
            continue

        row = df.loc[slug]
        text = build_input(row)
        if not text:
            print(f"[{n}/{len(slugs)}] {slug}: empty eligibility text, skipping")
            failed += 1
            continue

        level = utils.clean(row[config.COL_LEVEL])
        is_state = level.startswith("State")
        start = time.time()
        try:
            rules = extract_one(text)
        except Exception as e:  # truncated / invalid JSON, model error...
            print(f"[{n}/{len(slugs)}] {slug}: FAILED ({type(e).__name__}: {e})")
            failed += 1
            continue

        record = {
            "slug": slug,
            "scheme": utils.clean(row[config.COL_NAME]),
            "level": level,
            # State scope comes from the dataset metadata, NOT from the LLM (deterministic).
            "scope_state": utils.clean(row[config.COL_STATE]) if is_state else None,
            "url": utils.clean(row[config.COL_URL]),
            "model": config.LLM_MODEL,
            "rules": rules.model_dump(),
        }
        out.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
        ok += 1
        print(f"[{n}/{len(slugs)}] {slug}: OK in {time.time() - start:.0f}s")

    print(f"\nDone. extracted={ok} failed={failed} already_done={skipped}")
    print(f"Results are in {config.RULES_DIR}")


if __name__ == "__main__":
    main()
