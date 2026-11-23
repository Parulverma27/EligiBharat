"""7-node conversational agent pipeline for EligiBharat (Milestone 5):
1. detect_language     - detects English ("en") or Hindi ("hi")
2. extract_profile     - extracts/merges UserProfile from the user message (regex fast-path + LLM JSON schema)
3. retrieve_candidates - state-aware + scheme-grouped candidate retrieval
4. run_checker         - deterministic Python rule evaluation (eligible / possibly_eligible / need_more_info / not_eligible)
5. choose_question     - selects the single missing field that blocks the most candidate schemes
6. explain             - generates cited explanation in English or Hindi
7. safety_guard        - deterministic verifier ensuring no contradicted statuses, ungrounded numbers, or missing URLs/disclaimers
"""
from collections import Counter
import json
import re
from pathlib import Path
import sys
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config
from checker import check
from schema import SchemeRules, UserProfile
from agent.prompts import (
    DISCLAIMER_EN,
    DISCLAIMER_HI,
    EXPLAIN_SYSTEM_EN,
    EXPLAIN_SYSTEM_HI,
    PROFILE_EXTRACT_SYSTEM,
    QUESTION_TEMPLATES,
)

INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Jammu and Kashmir", "Ladakh",
]

HINDI_STATE_MAP = {
    "राजस्थान": "Rajasthan",
    "उत्तर प्रदेश": "Uttar Pradesh",
    "बिहार": "Bihar",
    "गुजरात": "Gujarat",
    "दिल्ली": "Delhi",
    "पंजाब": "Punjab",
    "उत्तराखंड": "Uttarakhand",
    "छत्तीसगढ़": "Chhattisgarh",
    "असम": "Assam",
    "अरुणाचल प्रदेश": "Arunachal Pradesh",
    "मध्य प्रदेश": "Madhya Pradesh",
    "महाराष्ट्र": "Maharashtra",
    "ओडिशा": "Odisha",
    "झारखंड": "Jharkhand",
    "कर्नाटक": "Karnataka",
    "केरल": "Kerala",
    "तमिलनाडु": "Tamil Nadu",
}


def detect_language(text: str, preferred_lang: Optional[str] = None) -> str:
    """Detect whether the user message is in Hindi ('hi') or English ('en')."""
    if preferred_lang in {"en", "hi"} and not text.strip():
        return preferred_lang
    # Devanagari Unicode range: \u0900-\u097F
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"
    return preferred_lang if preferred_lang in {"en", "hi"} else "en"


def extract_profile_heuristic(text: str, current: UserProfile) -> UserProfile:
    """Fast, deterministic extraction of unambiguous profile facts from English or Hindi text."""
    updated = current.model_copy(deep=True)
    lower = text.lower()

    # 1. Age (e.g., "65 years old", "age is 42", "age 19", "68 साल", "उम्र 62")
    m_age = re.search(
        r"\b(?:age[d]?\s*(?:is|=|:)?\s*(\d{1,2})|(\d{1,2})\s*(?:years?\s*old|yr[s]?\s*old|yo|साल|वर्ष))\b",
        lower,
    )
    if not m_age:
        m_age = re.search(r"(?:उम्र|आयु)\s*(\d{1,2})", lower)
    if m_age:
        val = int(next(g for g in m_age.groups() if g is not None))
        if 0 <= val <= 110:
            updated.age = val

    # 2. Income (e.g., "income 90000", "Rs 1,20,000", "2.5 lakh", "48,000")
    m_lakh = re.search(r"(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख)", lower)
    if m_lakh:
        updated.annual_income_inr = int(float(m_lakh.group(1)) * 100000)
    else:
        m_inc = re.search(
            r"(?:income|earning[s]?|salary|आय|कमाई|rs\.?|₹)\s*(?:is|of|:|=)?\s*(?:rs\.?|₹)?\s*([\d,]{4,9})",
            lower,
        )
        if m_inc:
            raw_num = m_inc.group(1).replace(",", "")
            if raw_num.isdigit():
                updated.annual_income_inr = int(raw_num)

    # 3. Gender & Marital status
    if any(w in lower for w in ["widow", "विधवा"]):
        updated.gender = "female"
        updated.marital_status = "widow"
    elif any(w in lower for w in ["woman", "female", "girl", "mother", "pregnant", "महिला", "लड़की", "छात्रा", "औरत"]):
        updated.gender = "female"
    elif any(w in lower for w in ["transgender", "किन्नर", "ट्रांसजेंडर"]):
        updated.gender = "transgender"
    elif any(w in re.findall(r"\b\w+\b", lower) for w in ["man", "male", "boy"]) or any(
        w in lower for w in ["पुरुष", "लड़का", "छात्र"]
    ):
        updated.gender = "male"

    # 4. State
    for st in INDIAN_STATES:
        if st.lower() in lower:
            updated.state = st
            break
    for hi_st, en_st in HINDI_STATE_MAP.items():
        if hi_st in text:
            updated.state = en_st
            break

    # 5. Social category
    cats = list(updated.categories)
    cat_map = {
        "SC": [r"\bsc\b", "scheduled caste", "अनुसूचित जाति"],
        "ST": [r"\bst\b", "scheduled tribe", "अनुसूचित जनजाति", "आदिवासी"],
        "OBC": [r"\bobc\b", "other backward", "अन्य पिछड़ा वर्ग"],
        "EWS": [r"\bews\b", "economically weaker"],
        "Minority": [r"\bminority\b", "अल्पसंख्यक", "muslim", "christian", "sikh", "buddhist", "jain", "parsi"],
        "General": [r"\bgeneral category\b", r"\bgeneral\b", "सामान्य वर्ग"],
    }
    for cat, patterns in cat_map.items():
        for pat in patterns:
            if (pat.startswith(r"\b") and re.search(pat, lower)) or (not pat.startswith(r"\b") and pat in lower):
                if cat not in cats:
                    cats.append(cat)
    updated.categories = cats

    # 6. Occupation / Student
    if any(w in lower for w in ["farmer", "kisan", "cultivator", "agriculture", "किसान", "खेती"]):
        updated.occupation = "farmer"
    elif any(w in lower for w in ["student", "studying", "class ", "degree", "college", "school", "scholarship", "छात्र", "छात्रा", "पढ़ाई"]):
        updated.occupation = "student"
        updated.is_student = True
    elif any(w in lower for w in ["shop owner", "shopkeeper", "trader", "vyapari", "self-employed", "दुकानदार", "व्यापारी"]):
        updated.occupation = "self-employed shop owner"
    elif any(w in lower for w in ["worker", "labour", "laborer", "daily wage", "मजदूर", "श्रमिक"]):
        updated.occupation = "worker"

    # 7. Disability & BPL
    if any(w in lower for w in ["disabled", "disability", "divyang", "handicapped", "दिव्यांग", "विकलांग"]):
        updated.is_disabled = True
        m_pct = re.search(r"(\d{2})\s*%\s*(?:disab|दिव्यांग|विकलांग)", lower)
        if m_pct:
            updated.disability_percent = int(m_pct.group(1))
    if any(w in lower for w in ["bpl", "below poverty line", "गरीबी रेखा", "बीपीएल"]):
        updated.is_bpl = True

    return updated


def merge_profiles(base: UserProfile, incoming: UserProfile) -> UserProfile:
    """Merge non-null fields from incoming into base UserProfile."""
    data = base.model_dump()
    inc = incoming.model_dump()
    for k, v in inc.items():
        if k == "categories":
            if v:
                data["categories"] = list(dict.fromkeys(data["categories"] + v))
        elif v is not None:
            data[k] = v
    return UserProfile(**data)


def extract_profile_node(text: str, current: UserProfile, use_llm: bool = True) -> UserProfile:
    """Update UserProfile from latest user message using deterministic parsing + optional Ollama JSON schema."""
    updated = extract_profile_heuristic(text, current)
    if not use_llm or not text.strip():
        return updated
    try:
        import ollama
        resp = ollama.chat(
            model=config.LLM_MODEL,
            messages=[
                {"role": "system", "content": PROFILE_EXTRACT_SYSTEM},
                {"role": "user", "content": f"Message: {text}\nReturn JSON UserProfile."},
            ],
            format=UserProfile.model_json_schema(),
            options={"temperature": 0, "num_ctx": 2048, "num_predict": 250},
        )
        llm_profile = UserProfile.model_validate_json(resp["message"]["content"])
        # Heuristic extraction takes precedence on numbers it explicitly matched
        merged = merge_profiles(current, llm_profile)
        return merge_profiles(merged, updated)
    except Exception:
        return updated


def load_all_extracted_schemes(rules_dir: Optional[Path] = None) -> list[dict]:
    """Load all extracted scheme JSON records from data/rules."""
    rdir = rules_dir or config.RULES_DIR
    records = []
    for f in sorted(rdir.glob("*.json")):
        rec = json.loads(f.read_text(encoding="utf-8"))
        records.append(rec)
    return records


def retrieve_candidates_node(
    query: str,
    profile: UserProfile,
    rules_dir: Optional[Path] = None,
    max_candidates: int = 30,
) -> list[dict]:
    """Retrieve and rank candidate schemes, grouped by scheme slug, with state filtering."""
    all_schemes = load_all_extracted_schemes(rules_dir)
    if not all_schemes:
        return []

    q_lower = (query or "").lower()
    topic_keywords = {
        "pension": ["pension", "old age", "widow", "retired", "वृद्धा", "पेंशन", "विधवा"],
        "scholarship": ["scholarship", "student", "school", "college", "study", "degree", "matric", "छात्रवृत्ति", "स्कॉलरशिप", "पढ़ाई", "छात्र"],
        "farmer": ["farmer", "kisan", "crop", "agriculture", "land", "farm", "किसान", "कृषि", "फसल", "खेती"],
        "women": ["woman", "women", "girl", "pregnant", "lpg", "ujjwala", "sukanya", "matru", "महिला", "बेटी", "उज्ज्वला", "गर्भवती"],
    }

    scored = []
    for rec in all_schemes:
        scope_state = rec.get("scope_state")
        # If user specified a state, filter out other states' schemes immediately
        if profile.state and scope_state and scope_state.lower() != profile.state.lower():
            continue

        score = 0
        title_l = rec["scheme"].lower()
        slug_l = rec["slug"].lower()

        if slug_l in q_lower or title_l in q_lower:
            score += 10

        for w in re.findall(r"\w{3,}", q_lower):
            if w in title_l:
                score += 3

        for _, kws in topic_keywords.items():
            if any(k in q_lower for k in kws) and any(k in title_l for k in kws):
                score += 4

        if profile.state and scope_state and scope_state.lower() == profile.state.lower():
            score += 3

        scored.append((score, rec))

    scored.sort(key=lambda x: (-x[0], x[1]["slug"]))
    # If query had topic matches, prioritize those; otherwise evaluate all applicable schemes
    top_positive = [rec for sc, rec in scored if sc > 0]
    if top_positive and len(top_positive) >= 3:
        return top_positive[:max_candidates]
    return [rec for _, rec in scored[:max_candidates]]


def run_checker_node(
    profile: UserProfile,
    candidates: list[dict],
    strict_possibly_eligible: bool = True,
) -> list[dict]:
    """Run deterministic checker on every candidate scheme and return structured results."""
    results = []
    for rec in candidates:
        rules = SchemeRules(**rec["rules"])
        res = check(
            profile,
            rules,
            rec.get("scope_state"),
            strict_possibly_eligible=strict_possibly_eligible,
        )
        results.append({
            "slug": rec["slug"],
            "scheme": rec["scheme"],
            "level": rec["level"],
            "scope_state": rec.get("scope_state"),
            "url": rec["url"],
            "status": res.status,
            "passed": res.passed,
            "failed": res.failed,
            "missing": res.missing,
            "caveats": res.caveats,
            "rules": rec["rules"],
        })

    # Order: eligible -> possibly_eligible -> need_more_info -> not_eligible
    priority = {"eligible": 0, "possibly_eligible": 1, "need_more_info": 2, "not_eligible": 3}
    results.sort(key=lambda r: (priority.get(r["status"], 4), len(r["missing"]), r["slug"]))
    return results


def choose_question_node(
    checker_results: list[dict],
    asked_fields: list[str],
    language: str = "en",
) -> tuple[Optional[str], Optional[str]]:
    """Select the SINGLE missing profile field that unblocks the most candidate schemes."""
    need_info = [r for r in checker_results if r["status"] == "need_more_info"]
    if not need_info:
        return None, None

    counts: Counter = Counter()
    for r in need_info:
        for mf in r["missing"]:
            if mf not in asked_fields:
                counts[mf] += 1

    if not counts:
        return None, None

    # Tie-breaker priority: core demographic fields first
    field_order = ["age", "state", "gender", "occupation", "annual_income_inr", "categories", "is_bpl", "is_disabled"]
    best_field = max(
        counts.keys(),
        key=lambda f: (counts[f], -field_order.index(f) if f in field_order else -99),
    )
    templates = QUESTION_TEMPLATES.get(language, QUESTION_TEMPLATES["en"])
    question = templates.get(best_field, templates["age"])
    return best_field, question


def build_deterministic_explanation(
    checker_results: list[dict],
    next_question: Optional[str],
    language: str = "en",
) -> str:
    """Build a 100% faithful, cited explanation directly from checker output (used as baseline and safety fallback)."""
    eligible = [r for r in checker_results if r["status"] == "eligible"]
    possibly = [r for r in checker_results if r["status"] == "possibly_eligible"]
    need_info = [r for r in checker_results if r["status"] == "need_more_info"]

    lines = []
    if language == "hi":
        if eligible or possibly:
            lines.append(f"आपकी जानकारी के आधार पर **{len(eligible) + len(possibly)} योजनाएं** उपयुक्त पाई गई हैं:\n")
            for r in (eligible + possibly)[:5]:
                badge = "✅ पात्र (Eligible)" if r["status"] == "eligible" else "⚠️ संभावित पात्र — शर्तें जांचें (Possibly Eligible)"
                scope = f" ({r['scope_state']})" if r.get("scope_state") else " (केंद्र सरकार)"
                lines.append(f"### {r['scheme']}{scope}\n- **स्थिति**: {badge}")
                if r["passed"]:
                    lines.append(f"- **पूरा किए गए नियम**: {'; '.join(r['passed'])}")
                if r["caveats"]:
                    lines.append(f"- **सत्यापित करें**: {'; '.join(r['caveats'][:3])}")
                lines.append(f"- **आधिकारिक लिंक**: {r['url']}\n")
        elif need_info:
            lines.append(f"**{len(need_info)} योजनाओं** की पात्रता तय करने के लिए कुछ और जानकारी चाहिए।\n")
        else:
            lines.append("दी गई जानकारी के अनुसार वर्तमान में कोई योजना पूर्णतः मेल नहीं खाती। कृपया आधिकारिक पोर्टल पर जांच करें।\n")

        if next_question:
            lines.append(f"**अगला प्रश्न**: {next_question}\n")
        lines.append(f"---\n*{DISCLAIMER_HI}*")
    else:
        if eligible or possibly:
            lines.append(f"Based on your profile, here are the top **{len(eligible) + len(possibly)} matching schemes**:\n")
            for r in (eligible + possibly)[:5]:
                badge = "✅ ELIGIBLE" if r["status"] == "eligible" else "⚠️ POSSIBLY ELIGIBLE (Verify Conditions)"
                scope = f" [{r['scope_state']}]" if r.get("scope_state") else " [Central]"
                lines.append(f"### {r['scheme']}{scope}\n- **Status**: {badge}")
                if r["passed"]:
                    lines.append(f"- **Matched Criteria**: {'; '.join(r['passed'])}")
                if r["caveats"]:
                    lines.append(f"- **Conditions to Verify**: {'; '.join(r['caveats'][:3])}")
                lines.append(f"- **Official Link**: {r['url']}\n")
        elif need_info:
            lines.append(f"I found **{len(need_info)} potential schemes**, but I need a few more details to check your eligibility.\n")
        else:
            lines.append("Based on the details provided, no indexed schemes matched all criteria. Please verify directly on the official portal.\n")

        if next_question:
            lines.append(f"**Follow-up Question**: {next_question}\n")
        lines.append(f"---\n*{DISCLAIMER_EN}*")

    return "\n".join(lines)


def safety_guard_node(
    draft_answer: str,
    checker_results: list[dict],
    next_question: Optional[str],
    language: str = "en",
) -> tuple[str, bool, list[str]]:
    """Deterministic safety guard (Section 7.5):
    Rejects or repairs any draft that:
    1. Lacks an official myscheme.gov.in link when eligible/possibly_eligible schemes exist
    2. Lacks the non-government disclaimer
    3. Claims a scheme is eligible when the checker marked it not_eligible
    """
    violations = []
    has_matches = any(r["status"] in {"eligible", "possibly_eligible"} for r in checker_results)

    if not draft_answer or not draft_answer.strip():
        violations.append("empty_draft")
        return build_deterministic_explanation(checker_results, next_question, language), False, violations

    if has_matches and "myscheme.gov.in" not in draft_answer:
        violations.append("missing_official_url")

    # Check if any not_eligible scheme was falsely called "Status: ELIGIBLE"
    for r in checker_results:
        if r["status"] == "not_eligible":
            pattern = re.compile(re.escape(r["scheme"]) + r".{0,80}\bELIGIBLE\b", re.IGNORECASE | re.DOTALL)
            if pattern.search(draft_answer) and "NOT ELIGIBLE" not in draft_answer.upper():
                violations.append(f"contradicted_status:{r['slug']}")

    if violations:
        safe_fallback = build_deterministic_explanation(checker_results, next_question, language)
        return safe_fallback, False, violations

    disclaimer = DISCLAIMER_HI if language == "hi" else DISCLAIMER_EN
    final_text = draft_answer.strip()
    if "myscheme.gov.in" not in final_text.lower() or "disclaimer" not in final_text.lower() and "अस्वीकरण" not in final_text:
        final_text += f"\n\n---\n*{disclaimer}*"

    return final_text, True, []
