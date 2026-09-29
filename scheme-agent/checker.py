"""Deterministic eligibility checker. NO LLM in here: plain Python rules only.

Given a UserProfile and a scheme's SchemeRules it returns one of:
  not_eligible   - at least one stated rule is definitely violated
  need_more_info - no rule violated, but we do not know some fact about the user
  eligible       - every stated rule passes (see `caveats` for conditions we cannot check)
"""
from dataclasses import dataclass, field
from typing import Optional

from schema import SchemeRules, UserProfile

# Words that mean the same occupation group, so "cultivator" matches "farmer".
_OCC_GROUPS = [
    {"farmer", "cultivator", "kisan", "agriculturist", "agricultural", "landholder", "grower"},
    {"student", "scholar", "pupil"},
    {"worker", "labourer", "laborer", "labour", "construction worker", "unorganised worker"},
    {"artisan", "craftsperson", "craftsman", "weaver"},
    {"entrepreneur", "self-employed", "trader", "businessperson"},
]


@dataclass
class Result:
    status: str
    passed: list = field(default_factory=list)
    failed: list = field(default_factory=list)
    missing: list = field(default_factory=list)
    caveats: list = field(default_factory=list)


def _norm(s: Optional[str]) -> str:
    return (s or "").lower().replace("&", "and").replace(".", "").strip()


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


def check(profile: UserProfile, rules: SchemeRules, scope_state: Optional[str] = None) -> Result:
    r = Result(status="eligible")

    def need(field_name):
        r.missing.append(field_name)

    # State scope (from dataset metadata)
    if scope_state:
        if not profile.state:
            need("state")
        elif _norm(profile.state) != _norm(scope_state):
            r.failed.append(f"scheme is only for {scope_state}, you are in {profile.state}")
        else:
            r.passed.append(f"state is {scope_state}")

    # Age
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

    # Income
    if rules.max_annual_income_inr is not None:
        if profile.annual_income_inr is None:
            need("annual_income_inr")
        elif profile.annual_income_inr > rules.max_annual_income_inr:
            r.failed.append(
                f"income {profile.annual_income_inr} is above the limit {rules.max_annual_income_inr}")
        else:
            r.passed.append("income is within the limit")

    # Gender
    if rules.genders:
        if not profile.gender:
            need("gender")
        elif profile.gender not in rules.genders:
            r.failed.append(f"scheme is for {', '.join(rules.genders)}")
        else:
            r.passed.append("gender matches")

    # Social category (a person may belong to several)
    if rules.social_categories:
        if not profile.categories:
            need("categories")
        elif not set(profile.categories) & set(rules.social_categories):
            r.failed.append(f"scheme is for {', '.join(rules.social_categories)}")
        else:
            r.passed.append("social category matches")

    # Occupation / status
    if rules.occupations:
        if not profile.occupation:
            need("occupation")
        elif not occupation_matches(profile.occupation, rules.occupations):
            r.failed.append(f"scheme is for: {', '.join(rules.occupations)}")
        else:
            r.passed.append("occupation matches")

    # Disability / BPL
    if rules.requires_disability:
        if profile.is_disabled is None:
            need("is_disabled")
        elif not profile.is_disabled:
            r.failed.append("scheme requires a disability")
        else:
            r.passed.append("disability requirement met")
    if rules.requires_bpl:
        if profile.is_bpl is None:
            need("is_bpl")
        elif not profile.is_bpl:
            r.failed.append("scheme requires BPL status")
        else:
            r.passed.append("BPL requirement met")

    # Things we cannot check automatically are always shown to the user.
    r.caveats = [f"Also required: {c}" for c in rules.other_conditions] + \
                [f"Not eligible if: {e}" for e in rules.exclusions]

    if r.failed:
        r.status = "not_eligible"
    elif r.missing:
        r.status = "need_more_info"
    return r
