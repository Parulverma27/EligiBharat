"""Unit tests for the Milestone 5 conversational agent (language detection, profile extraction,
question selection, deterministic explanation, and safety guard).
"""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agent.graph import AgentState, run_agent_turn
from agent.nodes import detect_language, extract_profile_heuristic, safety_guard_node
from schema import UserProfile


def test_detect_language_english_and_hindi():
    assert detect_language("I am a 65 year old farmer in Rajasthan") == "en"
    assert detect_language("मैं राजस्थान से 65 साल की विधवा महिला हूँ") == "hi"


def test_extract_profile_heuristic_bilingual():
    p_en = extract_profile_heuristic(
        "I am a 68 years old SC widow in Rajasthan with annual income Rs 36,000 and BPL card.",
        UserProfile(),
    )
    assert p_en.age == 68
    assert p_en.gender == "female"
    assert p_en.marital_status == "widow"
    assert p_en.state == "Rajasthan"
    assert p_en.annual_income_inr == 36000
    assert "SC" in p_en.categories
    assert p_en.is_bpl is True

    p_hi = extract_profile_heuristic(
        "मैं गुजरात से 32 साल का किसान हूँ, मेरी आय 85000 है और ST वर्ग से हूँ।",
        UserProfile(),
    )
    assert p_hi.age == 32
    assert p_hi.state == "Gujarat"
    assert p_hi.occupation == "farmer"
    assert p_hi.annual_income_inr == 85000
    assert "ST" in p_hi.categories


def test_multi_turn_agent_asks_question_then_resolves():
    # Turn 1: partial information
    st = run_agent_turn("I live in Rajasthan and want a pension scheme", use_llm=False)
    assert st.profile.state == "Rajasthan"
    assert st.next_question_field is not None
    assert "myscheme.gov.in" in st.final_answer

    # Turn 2: supply remaining details
    st = run_agent_turn("I am a 68 years old widow, SC category, BPL, income Rs 36,000", state=st, use_llm=False)
    eligible_slugs = [
        r["slug"] for r in st.candidate_results if r["status"] in {"eligible", "possibly_eligible"}
    ]
    assert "cmenspy" in eligible_slugs
    assert "ignwps" in eligible_slugs
    assert "mvspy" in eligible_slugs


def test_safety_guard_rejects_contradicted_status():
    fake_results = [
        {
            "slug": "apy",
            "scheme": "Atal Pension Yojana",
            "level": "Central",
            "scope_state": None,
            "url": "https://www.myscheme.gov.in/schemes/apy",
            "status": "not_eligible",
            "passed": [],
            "failed": ["age 68 is above the maximum 40"],
            "missing": [],
            "caveats": [],
        }
    ]
    bad_draft = "Atal Pension Yojana - Status: ELIGIBLE! Apply at https://www.myscheme.gov.in/schemes/apy"
    safe_text, passed, violations = safety_guard_node(bad_draft, fake_results, None, "en")
    assert passed is False
    assert "contradicted_status:apy" in violations
    assert "Disclaimer:" in safe_text


if __name__ == "__main__":
    tests = [v for k, v in dict(globals()).items() if k.startswith("test_")]
    for t in tests:
        t()
        print("PASS", t.__name__)
    print(f"\nAll {len(tests)} agent tests passed.")
