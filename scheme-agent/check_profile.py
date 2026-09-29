"""Try the rule checker on real extracted schemes.

Examples:
    python check_profile.py --slug apy --age 45 --income 300000 --state Bihar --gender female
    python check_profile.py --all --age 68 --income 90000 --state Rajasthan --gender female --category SC
"""
import argparse
import json

import config
from checker import check
from schema import SchemeRules, UserProfile


def load(path):
    rec = json.loads(path.read_text(encoding="utf-8"))
    return rec, SchemeRules(**rec["rules"])


def show(rec, res, verbose=True):
    print(f"\n{rec['scheme']}  [{rec['level']}{' - ' + rec['scope_state'] if rec['scope_state'] else ''}]")
    print(f"  status: {res.status.upper()}")
    if verbose:
        for label, items in (("passed", res.passed), ("failed", res.failed),
                             ("need to know", res.missing), ("verify", res.caveats)):
            for it in items:
                print(f"    {label}: {it}")
    print(f"  {rec['url']}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug")
    ap.add_argument("--all", action="store_true", help="check every extracted scheme")
    ap.add_argument("--age", type=int)
    ap.add_argument("--income", type=int, help="annual income in rupees")
    ap.add_argument("--state")
    ap.add_argument("--gender", choices=["male", "female", "transgender"])
    ap.add_argument("--category", action="append", choices=["SC", "ST", "OBC", "General", "EWS", "Minority"])
    ap.add_argument("--occupation")
    ap.add_argument("--disabled", action="store_true", default=None)
    ap.add_argument("--bpl", action="store_true", default=None)
    a = ap.parse_args()

    profile = UserProfile(age=a.age, annual_income_inr=a.income, gender=a.gender, state=a.state,
                          categories=a.category or [], occupation=a.occupation,
                          is_disabled=a.disabled, is_bpl=a.bpl)
    files = sorted(config.RULES_DIR.glob("*.json")) if a.all else [config.RULES_DIR / f"{a.slug}.json"]
    if not a.all and not files[0].exists():
        raise SystemExit(f"No extracted rules for '{a.slug}'. Run: python extract_rules.py --slug {a.slug}")

    counts = {"eligible": 0, "need_more_info": 0, "not_eligible": 0}
    for f in files:
        rec, rules = load(f)
        res = check(profile, rules, rec["scope_state"])
        counts[res.status] += 1
        if not a.all or res.status != "not_eligible":   # in --all mode hide the noise
            show(rec, res)
    if a.all:
        print("\nSummary:", counts)


if __name__ == "__main__":
    main()
