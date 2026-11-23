"""FastAPI backend for EligiBharat (Milestone 6).

Exposes:
- GET  /api/health
- GET  /api/schemes
- GET  /api/schemes/{slug}
- POST /api/check-profile
- POST /api/chat

Run with:
    uvicorn app.api:app --reload --port 8000
"""
from pathlib import Path
import sys
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config
from agent.graph import AgentState, run_agent_turn
from agent.nodes import load_all_extracted_schemes, run_checker_node
from evaluation.personas import SCHEME_GROUPS
from schema import UserProfile

app = FastAPI(
    title="EligiBharat API",
    description="Open-source, local Indian government scheme eligibility engine & conversational agent.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CheckProfileRequest(BaseModel):
    profile: UserProfile
    strict_possibly_eligible: bool = True


class ChatRequest(BaseModel):
    message: str
    profile: UserProfile = Field(default_factory=UserProfile)
    language: Optional[str] = "en"
    asked_fields: list[str] = Field(default_factory=list)
    turn_count: int = 0
    use_llm: bool = False


@app.get("/api/health")
def health():
    schemes = load_all_extracted_schemes()
    return {
        "status": "ok",
        "llm_model": config.LLM_MODEL,
        "embed_model": config.EMBED_MODEL,
        "extracted_schemes_count": len(schemes),
    }


@app.get("/api/schemes")
def list_schemes():
    schemes = load_all_extracted_schemes()
    for s in schemes:
        s["group"] = SCHEME_GROUPS.get(s["slug"], "other")
    return {"schemes": schemes, "total": len(schemes)}


@app.get("/api/schemes/{slug}")
def get_scheme(slug: str):
    schemes = {s["slug"]: s for s in load_all_extracted_schemes()}
    if slug not in schemes:
        raise HTTPException(status_code=404, detail=f"Scheme '{slug}' not found")
    rec = schemes[slug]
    rec["group"] = SCHEME_GROUPS.get(slug, "other")
    return rec


@app.post("/api/check-profile")
def check_profile_endpoint(req: CheckProfileRequest):
    schemes = load_all_extracted_schemes()
    results = run_checker_node(
        req.profile,
        schemes,
        strict_possibly_eligible=req.strict_possibly_eligible,
    )
    for r in results:
        r["group"] = SCHEME_GROUPS.get(r["slug"], "other")

    counts = {
        "eligible": sum(1 for r in results if r["status"] == "eligible"),
        "possibly_eligible": sum(1 for r in results if r["status"] == "possibly_eligible"),
        "need_more_info": sum(1 for r in results if r["status"] == "need_more_info"),
        "not_eligible": sum(1 for r in results if r["status"] == "not_eligible"),
    }
    return {"profile": req.profile.model_dump(), "counts": counts, "results": results}


@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    st = AgentState(
        profile=req.profile,
        language=req.language or "en",
        asked_fields=list(req.asked_fields),
        turn_count=req.turn_count,
    )
    st = run_agent_turn(
        req.message,
        state=st,
        use_llm=req.use_llm,
        preferred_language=req.language,
    )
    for r in st.candidate_results:
        r["group"] = SCHEME_GROUPS.get(r["slug"], "other")

    counts = {
        "eligible": sum(1 for r in st.candidate_results if r["status"] == "eligible"),
        "possibly_eligible": sum(1 for r in st.candidate_results if r["status"] == "possibly_eligible"),
        "need_more_info": sum(1 for r in st.candidate_results if r["status"] == "need_more_info"),
        "not_eligible": sum(1 for r in st.candidate_results if r["status"] == "not_eligible"),
    }
    return {
        "reply": st.final_answer,
        "language": st.language,
        "profile": st.profile.model_dump(),
        "asked_fields": st.asked_fields,
        "turn_count": st.turn_count,
        "next_question_field": st.next_question_field,
        "next_question_text": st.next_question_text,
        "counts": counts,
        "results": st.candidate_results,
        "safety_passed": st.safety_passed,
    }
