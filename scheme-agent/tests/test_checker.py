"""Plain-Python tests for the rule checker (v1 and v2 features). Run: python tests/test_checker.py"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from checker import check, occupation_matches
from extract_rules import validate_and_repair_rules
from schema import SchemeRules, UserProfile

OLD_AGE = SchemeRules(min_age=60, max_annual_income_inr=100000)
WIDOW_SC = SchemeRules(min_age=18, genders=["female"], social_categories=["SC", "ST"],
                       other_conditions=["must be a widow"])
FARMER = SchemeRules(occupations=["farmer"], exclusions=["income tax payers"])


def test_eligible():
    r = check(UserProfile(age=65, annual_income_inr=50000), OLD_AGE)
    assert r.status == "eligible", r


def test_age_boundary_is_inclusive():
    assert check(UserProfile(age=60, annual_income_inr=100000), OLD_AGE).status == "eligible"
    assert check(UserProfile(age=59, annual_income_inr=1), OLD_AGE).status == "not_eligible"


def test_income_over_limit():
    r = check(UserProfile(age=70, annual_income_inr=100001), OLD_AGE)
    assert r.status == "not_eligible" and any("income" in f for f in r.failed)


def test_unknown_fields_ask_not_guess():
    r = check(UserProfile(age=70), OLD_AGE)
    assert r.status == "need_more_info" and r.missing == ["annual_income_inr"]


def test_failure_beats_missing():
    # age is definitely too low, so we don't need to ask about income
    assert check(UserProfile(age=30), OLD_AGE).status == "not_eligible"


def test_state_scope():
    rules = SchemeRules()
    assert check(UserProfile(state="Bihar"), rules, "Rajasthan").status == "not_eligible"
    assert check(UserProfile(state="rajasthan"), rules, "Rajasthan").status == "eligible"
    assert check(UserProfile(), rules, "Rajasthan").status == "need_more_info"
    assert check(UserProfile(), rules, None).status == "eligible"       # central scheme


def test_gender_and_category():
    ok = check(UserProfile(age=40, gender="female", categories=["OBC", "SC"]), WIDOW_SC)
    assert ok.status == "eligible" and ok.caveats == ["Also required: must be a widow"]
    assert check(UserProfile(age=40, gender="male", categories=["SC"]), WIDOW_SC).status == "not_eligible"
    assert check(UserProfile(age=40, gender="female", categories=["General"]), WIDOW_SC).status == "not_eligible"


def test_occupation_synonyms():
    assert occupation_matches("cultivator", ["farmer"])
    assert occupation_matches("small farmer", ["farmer"])
    assert not occupation_matches("teacher", ["farmer"])
    r = check(UserProfile(occupation="teacher"), FARMER)
    assert r.status == "not_eligible"
    assert check(UserProfile(occupation="farmer"), FARMER).caveats == ["Not eligible if: income tax payers"]


def test_v2_possibly_eligible_status():
    r = check(
        UserProfile(age=40, gender="female", categories=["SC"]),
        WIDOW_SC,
        strict_possibly_eligible=True,
    )
    assert r.status == "possibly_eligible"
    r_no_caveats = check(
        UserProfile(age=65, annual_income_inr=50000),
        OLD_AGE,
        strict_possibly_eligible=True,
    )
    assert r_no_caveats.status == "eligible"


def test_v2_checkable_exclusions_and_student():
    ujjwala = SchemeRules(genders=["female"], excluded_genders=["male"], min_age=18)
    assert check(UserProfile(age=30, gender="male"), ujjwala).status == "not_eligible"
    assert check(UserProfile(age=30, gender="female"), ujjwala).status == "eligible"

    scholarship = SchemeRules(requires_student=True, genders=["female"])
    assert check(UserProfile(age=68, gender="female", occupation="unemployed"), scholarship).status == "not_eligible"
    assert check(UserProfile(age=16, gender="female", occupation="student"), scholarship).status == "eligible"


def test_v2_validate_and_repair_rules():
    raw = SchemeRules(max_annual_income_inr=2500000)
    fixed = validate_and_repair_rules(
        raw,
        "CBSE Merit Scholarship Scheme For Single Girl Child",
        "The applicant should be the single girl child studying Class 11th & 12th. Income not exceed ₹ 2.50 Lakh.",
    )
    assert fixed.genders == ["female"]
    assert fixed.requires_student is True
    assert "student" in fixed.occupations
    assert fixed.max_annual_income_inr == 250000


if __name__ == "__main__":
    tests = [v for k, v in dict(globals()).items() if k.startswith("test_")]
    for t in tests:
        t()
        print("PASS", t.__name__)
    print(f"\nAll {len(tests)} tests passed.")
