"""Deterministic eligibility checker (v2). NO LLM in here: plain Python rules only.

Given a UserProfile and a scheme's SchemeRules it returns one of:
  not_eligible      - at least one stated rule or checkable exclusion is definitely violated
  need_more_info    - no rule violated, but we do not know a required fact about the user
  possibly_eligible - every checkable rule passes, AND unchecked caveats remain to verify
  eligible          - every stated rule passes and there are no unchecked caveats
"""
from dataclasses import dataclass, field
from typing import Optional

from schema import SchemeRules, UserProfile

# Words that mean the same occupation group, so "cultivator" matches "farmer".
_OCC_GROUPS = [
    {"farmer", "cultivator", "kisan", "agriculturist", "agricultural", "landholder", "grower",
     "marginal_farmer", "small_farmer", "large_farmer", "tenant farmer", "share cropper"},
    {"student", "scholar", "pupil"},
    {"worker", "labourer", "laborer", "labour", "construction worker", "unorganised worker",
     "employed", "wage earner", "daily wage"},
    {"artisan", "craftsperson", "craftsman", "weaver"},
    {"entrepreneur", "self-employed", "trader", "businessperson", "shop owner", "retail owner", "vyapari"},
]


@dataclass
class Result:
    status: str
    passed: list = field(default_factory=list)
    failed: list = field(default_factory=list)
    missing: list = field(default_factory=list)
    caveats: list = field(default_factory=list)


def _norm(s: Optional[str]) -> str:
    return (s or "").lower().replace("&", "and").replace("_", " ").replace(".", "").strip()


def _group_of(word: str):
    w = _norm(word)
    for i, g in enumerate(_OCC_GROUPS):
        if any(k in w or w in k for k in g if w):
            return i
    return None


def occupation_matches(user_occ: str, scheme_occs: list) -> bool:
    u = _norm(user_occ)
    for s in scheme_occs:
        sn = _norm(s)
        if sn and (sn in u or u in sn):
            return True
        gu, gs = _group_of(u), _group_of(sn)
        if gu is not None and gu == gs:
            return True
    return False


def _infer_is_student(profile: UserProfile) -> Optional[bool]:
    if profile.is_student is not None:
        return profile.is_student
    if profile.occupation:
        return _group_of(profile.occupation) == 1
    return None


def check(
    profile: UserProfile,
    rules: SchemeRules,
    scope_state: Optional[str] = None,
    strict_possibly_eligible: bool = False,
) -> Result:
    """Evaluate a UserProfile against SchemeRules.

    When strict_possibly_eligible=True, passing schemes that have unchecked caveats
    return status='possibly_eligible' instead of 'eligible'.
    """
    r = Result(status="eligible")

    def need(field_name):
        if field_name not in r.missing:
            r.missing.append(field_name)

    # 1. State scope (from dataset metadata)
    if scope_state:
        if not profile.state:
            need("state")
        elif _norm(profile.state) != _norm(scope_state):
            r.failed.append(f"scheme is only for {scope_state}, you are in {profile.state}")
        else:
            r.passed.append(f"state is {scope_state}")

    # 2. Age
    if rules.min_age is not None or rules.max_age is not None:
        if profile.age is None:
            need("age")
        else:
            if rules.min_age is not None and profile.age < rules.min_age:
                r.failed.append(f"age {profile.age} is below the minimum {rules.min_age}")
            elif rules.max_age is not None and profile.age > rules.max_age:
                r.failed.append(f"age {profile.age} is above the maximum {rules.max_age}")
            else:
                r.passed.append(f"age {profile.age} is within the allowed range")

    # 3. Income
    if rules.max_annual_income_inr is not None:
        if profile.annual_income_inr is None:
            need("annual_income_inr")
        elif profile.annual_income_inr > rules.max_annual_income_inr:
            r.failed.append(
                f"income {profile.annual_income_inr} is above the limit {rules.max_annual_income_inr}")
        else:
            r.passed.append("income is within the limit")

    # 4. Gender + Excluded Genders
    if rules.genders:
        if not profile.gender:
            need("gender")
        elif profile.gender not in rules.genders:
            r.failed.append(f"scheme is for {', '.join(rules.genders)}")
        else:
            r.passed.append("gender matches")

    if rules.excluded_genders:
        if not profile.gender:
            need("gender")
        elif profile.gender in rules.excluded_genders:
            r.failed.append(f"scheme excludes {', '.join(rules.excluded_genders)} applicants")
        else:
            r.passed.append("gender not excluded")

    # 5. Social category (a person may belong to several)
    if rules.social_categories:
        if not profile.categories:
            need("categories")
        elif not set(profile.categories) & set(rules.social_categories):
            r.failed.append(f"scheme is for {', '.join(rules.social_categories)}")
        else:
            r.passed.append("social category matches")

    # 6. Student requirement & Occupation
    if rules.requires_student:
        inferred_student = _infer_is_student(profile)
        if inferred_student is None:
            need("occupation")
        elif not inferred_student:
            r.failed.append("scheme requires applicant to be a student")
        else:
            r.passed.append("student requirement met")

    if rules.occupations:
        if not profile.occupation:
            if not (rules.requires_student and profile.is_student):
                need("occupation")
        elif not occupation_matches(profile.occupation, rules.occupations):
            r.failed.append(f"scheme is for: {', '.join(rules.occupations)}")
        else:
            r.passed.append("occupation matches")

    # 7. Education stage (only checked when user provides education_stage)
    if rules.education_stages and profile.education_stage:
        if profile.education_stage not in rules.education_stages:
            r.failed.append(f"scheme requires education stage: {', '.join(rules.education_stages)}")
        else:
            r.passed.append("education stage matches")

    # 8. Marital status (only fails when user explicitly provides a non-matching marital_status)
    if rules.marital_statuses and profile.marital_status:
        if profile.marital_status not in rules.marital_statuses:
            r.failed.append(f"scheme is for marital status: {', '.join(rules.marital_statuses)}")
        else:
            r.passed.append("marital status matches")

    # 9. Disability & BPL
    if rules.requires_disability:
        if profile.is_disabled is None:
            need("is_disabled")
        elif not profile.is_disabled:
            r.failed.append("scheme requires a disability")
        elif (
            rules.min_disability_percent is not None
            and profile.disability_percent is not None
            and profile.disability_percent < rules.min_disability_percent
        ):
            r.failed.append(
                f"disability {profile.disability_percent}% is below required {rules.min_disability_percent}%")
        else:
            r.passed.append("disability requirement met")

    if rules.requires_bpl:
        if profile.is_bpl is None:
            need("is_bpl")
        elif not profile.is_bpl:
            r.failed.append("scheme requires BPL status")
        else:
            r.passed.append("BPL requirement met")

    # 10. Land holding ceiling (checked when user provides land_hectares)
    if rules.max_land_hectares is not None and profile.land_hectares is not None:
        if profile.land_hectares > rules.max_land_hectares:
            r.failed.append(f"land holding {profile.land_hectares} ha exceeds limit {rules.max_land_hectares} ha")
        else:
            r.passed.append("land holding is within limit")

    # 11. Checkable Exclusions (Government employee / Income tax payer)
    if rules.excludes_govt_employee and profile.is_govt_employee is True:
        r.failed.append("government / PSU employees are excluded")
    if rules.excludes_income_tax_payer and profile.is_income_tax_payer is True:
        r.failed.append("income tax payers are excluded")

    # 12. Caveats (conditions we cannot check automatically are always shown to the user)
    r.caveats = [f"Also required: {c}" for c in rules.other_conditions] + \
                [f"Not eligible if: {e}" for e in rules.exclusions]

    if r.failed:
        r.status = "not_eligible"
    elif r.missing:
        r.status = "need_more_info"
    elif strict_possibly_eligible and r.caveats:
        r.status = "possibly_eligible"
    return r
