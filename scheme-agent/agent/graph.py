"""Conversational agent state machine for EligiBharat (Milestone 5).

Orchestrates the 7-node pipeline:
detect_language -> extract_profile -> retrieve_candidates -> run_checker -> choose_question -> explain -> safety_guard
"""
from dataclasses import dataclass, field
from pathlib import Path
import sys
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from schema import UserProfile
from agent.nodes import (
    build_deterministic_explanation,
    choose_question_node,
    detect_language,
    extract_profile_node,
    retrieve_candidates_node,
    run_checker_node,
    safety_guard_node,
)

MAX_TURNS = 8


@dataclass
class AgentState:
    messages: list[dict] = field(default_factory=list)
    profile: UserProfile = field(default_factory=UserProfile)
    language: str = "en"
    asked_fields: list[str] = field(default_factory=list)
    turn_count: int = 0
    candidate_results: list[dict] = field(default_factory=list)
    next_question_field: Optional[str] = None
    next_question_text: Optional[str] = None
    final_answer: str = ""
    safety_passed: bool = True
    safety_violations: list[str] = field(default_factory=list)


def run_agent_turn(
    user_message: str,
    state: Optional[AgentState] = None,
    use_llm: bool = False,
    preferred_language: Optional[str] = None,
    rules_dir: Optional[Path] = None,
) -> AgentState:
    """Execute one turn of the EligiBharat conversational agent."""
    st = state or AgentState()
    st.turn_count += 1
    if user_message.strip():
        st.messages.append({"role": "user", "content": user_message})

    # Node 1: detect_language
    st.language = detect_language(user_message, preferred_language or st.language)

    # Node 2: extract_profile
    st.profile = extract_profile_node(user_message, st.profile, use_llm=use_llm)

    # Node 3: retrieve_candidates
    candidates = retrieve_candidates_node(user_message, st.profile, rules_dir=rules_dir)

    # Node 4: run_checker (deterministic Python checker)
    st.candidate_results = run_checker_node(st.profile, candidates, strict_possibly_eligible=True)

    # Node 5: choose_question (only if within turn limit)
    if st.turn_count <= MAX_TURNS:
        q_field, q_text = choose_question_node(st.candidate_results, st.asked_fields, st.language)
        st.next_question_field = q_field
        st.next_question_text = q_text
        if q_field and q_field not in st.asked_fields:
            st.asked_fields.append(q_field)
    else:
        st.next_question_field = None
        st.next_question_text = None

    # Node 6: explain
    draft = build_deterministic_explanation(
        st.candidate_results,
        st.next_question_text,
        language=st.language,
    )

    # Node 7: safety_guard
    safe_answer, passed, violations = safety_guard_node(
        draft,
        st.candidate_results,
        st.next_question_text,
        language=st.language,
    )
    st.final_answer = safe_answer
    st.safety_passed = passed
    st.safety_violations = violations
    st.messages.append({"role": "assistant", "content": st.final_answer})
    return st
