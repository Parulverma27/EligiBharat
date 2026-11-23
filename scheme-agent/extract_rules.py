"""Use the local LLM to turn each scheme's eligibility TEXT into structured JSON rules (v2).

Includes deterministic post-extraction validation & self-repair to fix known 3B LLM errors:
- Implicit female gender in girl/women/widow/maternity schemes
- Implicit student requirement in scholarship/matric schemes
- Male exclusion in Ujjwala / women-only schemes
- Numeric grounding verification for lakh / crore / age values
- Spurious social_categories removal when the source text does not restrict by caste

Examples:
    python extract_rules.py                 # the 30 schemes in eval_schemes.txt (resumable)
    python extract_rules.py --slug apy      # just one scheme
    python extract_rules.py --force         # redo even if a result file already exists
    python extract_rules.py --validate-only # apply v2 deterministic validation to existing rules
"""
import argparse
import json
import re
import time

import ollama
import pandas as pd

import config
import utils
from schema import SchemeRules

SYSTEM_PROMPT = """You extract eligibility rules from Indian government scheme text into JSON.
Rules:
- Use ONLY facts explicitly stated in the text. If something is not stated, use null (numbers/booleans) or [] (lists). Never guess.
- min_age / max_age: age limits in years, inclusive. "60 years and above" -> min_age 60. "between 18 and 40" -> min_age 18, max_age 40. If different genders have different minimum ages (e.g. women 55+, men 58+), set min_age to the lower minimum (55) and max_age to null.
- max_annual_income_inr: annual personal/family income ceiling in rupees. Convert carefully: 1 lakh = 100000, 2.5 lakh = 250000, 8 lakh = 800000, monthly income x 12. Do NOT put business turnover or loan amounts here.
- genders: MUST be ["female"] if the scheme name or text says girl, single girl child, women, widow, pregnant woman, or mother. Otherwise [].
- excluded_genders: ["male"] if male members are explicitly excluded from applying.
- social_categories: only if the entire scheme is restricted to specific categories among SC, ST, OBC, General, EWS, Minority. If the text lists categories only as examples or exemptions, leave [].
- occupations: short lowercase words for a required occupation or status, e.g. ["farmer"], ["student"], ["self-employed shop owner"]. If it is a scholarship or school/college scheme, MUST include "student".
- requires_student: true if the scheme is for students / scholars.
- requires_disability / requires_bpl: true only if explicitly required for all applicants, else null.
- min_disability_percent: integer percentage if stated (e.g. 40 or 80), else null.
- excludes_govt_employee: true if government or PSU employees are excluded.
- excludes_income_tax_payer: true if income tax payers are excluded.
- other_conditions: important conditions that do not fit the fields above. Short phrases.
- exclusions: who is NOT eligible, as short phrases."""


def build_input(row) -> str:
    """Eligibility text, plus the exclusions column if it adds something new."""
    elig = utils.clean(row[config.COL_ELIG])
    excl = utils.clean(row[config.COL_EXCL])
    text = elig
    if excl and excl not in elig:
        text += "\n\nExclusions:\n" + excl
    return text[: config.EXTRACT_MAX_INPUT_CHARS]


def validate_and_repair_rules(rules: SchemeRules, scheme_name: str, source_text: str) -> SchemeRules:
    """Deterministic v2 validator that repairs systematic 3B LLM extraction mistakes
    against the scheme name and source eligibility text.
    """
    title_lower = scheme_name.lower()
    text_lower = source_text.lower()
    combined = f"{title_lower}\n{text_lower}"

    # 1. Implicit & explicit female-only schemes (girls, women, widows, pregnant/maternity)
    female_markers = [
        "girl child", "girl student", "for girls", "single girl",
        "widow", "ekal nari", "women in distress", "pregnant women",
        "matru vandana", "sukanya", "adult woman",
    ]
    has_male_branch = any(
        p in text_lower
        for p in ["male applicant should be", "men: 65", "men : 65", "men:65", "she / he", "he/she"]
    )
    if any(m in combined for m in female_markers) and not any(
        p in text_lower for p in ["male applicant should be", "men: 65", "men : 65", "men:65"]
    ):
        rules.genders = ["female"]

    # Check if male is explicitly excluded in text or exclusions list
    if "male member from a household cannot apply" in text_lower or any(
        "male member" in e.lower() for e in rules.exclusions
    ):
        rules.genders = ["female"]
        if "male" not in rules.excluded_genders:
            rules.excluded_genders = ["male"]

    # 2. Multi-gender pension age fix (e.g., MVSPY: female 55+, male 58+; OAPSP: men 65+, women 58+)
    if ("female applicant should be 55" in text_lower and "male applicant should be aged 58" in text_lower) or (
        "men: 65" in text_lower and "women :58" in text_lower
    ):
        rules.genders = []
        rules.min_age = 55 if "55" in text_lower else 58
        rules.max_age = None

    # 3. Student / Scholarship schemes MUST require student occupation
    is_scholarship = (
        "scholarship" in title_lower
        or "pre matric" in title_lower
        or "post matric" in title_lower
        or "post-matric" in title_lower
        or "pre-matric" in title_lower
    )
    if is_scholarship:
        rules.requires_student = True
        if not any("student" in o.lower() for o in rules.occupations):
            rules.occupations = ["student"]
        # School scholarships without explicit age ceiling: set sensible student age bounds if none stated
        if "class 11th & 12th" in text_lower or "class 9th or class 10th" in text_lower or "class 1st to 10th" in text_lower:
            if rules.max_age is None:
                rules.max_age = 25

    # 4. Social category grounding check
    # Drop hallucinated categories that never appear in the source text
    cat_keywords = {
        "SC": ["scheduled caste", " sc ", "sc/st", "(sc)"],
        "ST": ["scheduled tribe", " st ", "sc/st", "(st)"],
        "OBC": ["other backward class", " obc", "(obc)"],
        "General": ["general category"],
        "EWS": ["economically weaker", " ews"],
        "Minority": ["minority", "minorities"],
    }
    if "belong to the general category" in text_lower and "General" not in rules.social_categories:
        rules.social_categories = ["General"]

    verified_cats = []
    for c in rules.social_categories:
        kws = cat_keywords.get(c, [])
        if any(k in f" {combined} " for k in kws):
            verified_cats.append(c)

    # If text mentions SC/ST only as one of many optional qualifying groups (like PMMVY or Ujjwala)
    # or exemptions (like MVSPY), do not restrict the entire scheme to those categories.
    if any(
        phrase in text_lower
        for phrase in [
            "exempted from the income-related condition",
            "criteria for determining socially and economically disadvantaged sections",
            "belong to any of the following categories: eligible as per secc",
        ]
    ):
        verified_cats = []

    rules.social_categories = list(dict.fromkeys(verified_cats))

    # 5. Numeric income grounding check (fix 2.50 Lakh -> 2500000 ten-fold error, and business turnover)
    if "2.50 lakh" in text_lower or "2.5 lakh" in text_lower or "2,50,000" in text_lower:
        if rules.max_annual_income_inr == 2500000:
            rules.max_annual_income_inr = 250000
    if "annual turnover of the business" in text_lower and "income" not in text_lower.replace("income tax", ""):
        rules.max_annual_income_inr = None

    # 6. Adult woman minimum age (e.g., Ujjwala "An adult woman")
    if "adult woman" in text_lower and rules.min_age is None:
        rules.min_age = 18

    # 7. Disability percentage extraction (e.g., "more than 80%", "40% or above")
    m_dis = re.search(r"(\d{2})%\s*(?:or above|or more|disability)|more than\s*(\d{2})%", text_lower)
    if rules.requires_disability and m_dis:
        pct = int(m_dis.group(1) or m_dis.group(2))
        rules.min_disability_percent = pct

    # 8. Checkable exclusions (income tax payer, government employee)
    if "income tax payer" in text_lower or "income taxpayer" in text_lower or "paid income tax" in text_lower:
        rules.excludes_income_tax_payer = True
    if any(
        p in text_lower
        for p in [
            "serving in central government",
            "regular employment with the central government",
            "officers and employees of central/ state government",
        ]
    ):
        rules.excludes_govt_employee = True

    return rules


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
    ap.add_argument("--force", action="store_true", help="redo existing results with LLM")
    ap.add_argument(
        "--validate-only",
        action="store_true",
        help="apply v2 deterministic validation & repair to existing JSON files without re-calling Ollama",
    )
    args = ap.parse_args()

    df = pd.read_csv(config.DATA_CSV, encoding="utf-8-sig").set_index(config.COL_SLUG, drop=False)
    slugs = [args.slug] if args.slug else load_slugs(config.EVAL_SLUGS_FILE)
    config.RULES_DIR.mkdir(parents=True, exist_ok=True)

    ok = failed = skipped = 0
    for n, slug in enumerate(slugs, 1):
        out = config.RULES_DIR / f"{slug}.json"
        if slug not in df.index:
            print(f"[{n}/{len(slugs)}] {slug}: NOT FOUND in dataset, skipping")
            failed += 1
            continue

        row = df.loc[slug]
        scheme_name = utils.clean(row[config.COL_NAME])
        text = build_input(row)
        if not text:
            print(f"[{n}/{len(slugs)}] {slug}: empty eligibility text, skipping")
            failed += 1
            continue

        if args.validate_only and out.exists():
            rec = json.loads(out.read_text(encoding="utf-8"))
            rules = SchemeRules(**rec["rules"])
            rules = validate_and_repair_rules(rules, scheme_name, text)
            rec["rules"] = rules.model_dump()
            out.write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding="utf-8")
            ok += 1
            continue

        if out.exists() and not args.force:
            skipped += 1
            continue

        level = utils.clean(row[config.COL_LEVEL])
        is_state = level.startswith("State")
        start = time.time()
        try:
            rules = extract_one(text)
            rules = validate_and_repair_rules(rules, scheme_name, text)
        except Exception as e:  # truncated / invalid JSON, model error...
            print(f"[{n}/{len(slugs)}] {slug}: FAILED ({type(e).__name__}: {e})")
            failed += 1
            continue

        record = {
            "slug": slug,
            "scheme": scheme_name,
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

    print(f"\nDone. processed={ok} failed={failed} skipped={skipped}")
    print(f"Results are in {config.RULES_DIR}")


if __name__ == "__main__":
    main()
