"""Data models: what we extract from a scheme (SchemeRules) and what we know about a user (UserProfile).

Design rule: every field can be "unknown" (None or an empty list). Unknown never means
"no restriction" for the user side, it means "we must ask". For the scheme side, None/[]
means "the text did not state this restriction".
"""
from typing import Literal, Optional
from pydantic import BaseModel, Field

Gender = Literal["male", "female", "transgender"]
Category = Literal["SC", "ST", "OBC", "General", "EWS", "Minority"]


class SchemeRules(BaseModel):
    """Eligibility rules extracted from one scheme's text by the LLM."""
    min_age: Optional[int] = Field(None, description="Minimum age in years (inclusive), or null")
    max_age: Optional[int] = Field(None, description="Maximum age in years (inclusive), or null")
    max_annual_income_inr: Optional[int] = Field(
        None, description="Annual income ceiling in rupees, or null")
    genders: list[Gender] = Field(
        default_factory=list, description="Only if restricted to certain genders, else []")
    social_categories: list[Category] = Field(
        default_factory=list, description="Only if restricted to certain categories, else []")
    occupations: list[str] = Field(
        default_factory=list, description="Required occupation/status as short lowercase words, else []")
    requires_disability: Optional[bool] = Field(None, description="true only if disability is required")
    requires_bpl: Optional[bool] = Field(None, description="true only if BPL status is required")
    other_conditions: list[str] = Field(
        default_factory=list, description="Important conditions not covered by the fields above")
    exclusions: list[str] = Field(
        default_factory=list, description="Who is NOT eligible, short phrases")


class UserProfile(BaseModel):
    """What we know about the person asking. Anything not provided stays None / empty."""
    age: Optional[int] = None
    annual_income_inr: Optional[int] = None
    gender: Optional[Gender] = None
    state: Optional[str] = None
    categories: list[Category] = Field(default_factory=list)  # a person can be e.g. OBC and Minority
    occupation: Optional[str] = None
    is_disabled: Optional[bool] = None
    is_bpl: Optional[bool] = None
