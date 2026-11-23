"""Evaluation personas and scheme splits (20 dev schemes, 10 test schemes)."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# 30 selected schemes split into 20 dev and 10 held-out test schemes
# Stratified across pension (10 -> 7 dev, 3 test), scholarship (10 -> 7 dev, 3 test),
# farmer (7 -> 4 dev, 3 test), and women/others (3 -> 2 dev, 1 test).
DEV_SCHEMES = [
    # pension (7)
    "apy",
    "igndps",
    "ignwps",
    "cmenspy",
    "mvspy",
    "dpswdwp",
    "oap",
    # scholarship (7)
    "pmsfss",
    "pre-sc",
    "pre-st",
    "mcm-min",
    "msssgc",
    "psgs-deg",
    "gpmsup",
    # farmer (4)
    "pm-kisan",
    "kcc",
    "cmkry",
    "agr3fmsstf",
    # women / others (2)
    "ssy",
    "pmuy",
]

TEST_SCHEMES = [
    # pension (3)
    "nps-tsep",
    "oapsp",
    "kpy",
    # scholarship (3)
    "presm",
    "obcpms",
    "post-dis",
    # farmer (3)
    "pmfby",
    "rgkny",
    "agr4fmsscf",
    # women / others (1)
    "pmmvy",
]

SCHEME_GROUPS = {
    "apy": "pension",
    "igndps": "pension",
    "ignwps": "pension",
    "nps-tsep": "pension",
    "cmenspy": "pension",
    "mvspy": "pension",
    "dpswdwp": "pension",
    "oap": "pension",
    "oapsp": "pension",
    "kpy": "pension",
    "pmsfss": "scholarship",
    "pre-sc": "scholarship",
    "pre-st": "scholarship",
    "presm": "scholarship",
    "mcm-min": "scholarship",
    "msssgc": "scholarship",
    "psgs-deg": "scholarship",
    "gpmsup": "scholarship",
    "obcpms": "scholarship",
    "post-dis": "scholarship",
    "pm-kisan": "farmer",
    "pmfby": "farmer",
    "kcc": "farmer",
    "rgkny": "farmer",
    "cmkry": "farmer",
    "agr3fmsstf": "farmer",
    "agr4fmsscf": "farmer",
    "ssy": "women_family",
    "pmmvy": "women_family",
    "pmuy": "women_family",
}

# 18 hand-written personas created independently of the extracted rules.
# Each dict includes UserProfile fields plus human description for blind labeling.
PERSONAS = [
    {
        "id": "P01",
        "description": "68-year-old SC widow in Rajasthan, annual income Rs 36,000, BPL household, unemployed.",
        "profile": {
            "age": 68,
            "annual_income_inr": 36000,
            "gender": "female",
            "state": "Rajasthan",
            "categories": ["SC"],
            "occupation": "unemployed",
            "is_disabled": False,
            "is_bpl": True,
        },
    },
    {
        "id": "P02",
        "description": "32-year-old male small farmer in Gujarat, ST category, annual income Rs 85,000, BPL.",
        "profile": {
            "age": 32,
            "annual_income_inr": 85000,
            "gender": "male",
            "state": "Gujarat",
            "categories": ["ST"],
            "occupation": "farmer",
            "is_disabled": False,
            "is_bpl": True,
        },
    },
    {
        "id": "P03",
        "description": "16-year-old SC female school student (Class 10) in Uttar Pradesh, family income Rs 1,20,000/yr.",
        "profile": {
            "age": 16,
            "annual_income_inr": 120000,
            "gender": "female",
            "state": "Uttar Pradesh",
            "categories": ["SC"],
            "occupation": "student",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P04",
        "description": "19-year-old female engineering student (1st year degree) in Assam, General category, family income Rs 4,50,000/yr.",
        "profile": {
            "age": 19,
            "annual_income_inr": 450000,
            "gender": "female",
            "state": "Assam",
            "categories": ["General"],
            "occupation": "student",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P05",
        "description": "28-year-old male software engineer in Karnataka, General category, income Rs 12,00,000/yr (income tax payer).",
        "profile": {
            "age": 28,
            "annual_income_inr": 1200000,
            "gender": "male",
            "state": "Karnataka",
            "categories": ["General"],
            "occupation": "engineer",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P06",
        "description": "45-year-old disabled male (85% disability) in Bihar, OBC & BPL household, annual income Rs 40,000.",
        "profile": {
            "age": 45,
            "annual_income_inr": 40000,
            "gender": "male",
            "state": "Bihar",
            "categories": ["OBC"],
            "occupation": "unemployed",
            "is_disabled": True,
            "is_bpl": True,
        },
    },
    {
        "id": "P07",
        "description": "64-year-old male marginal farmer (1.2 hectares) in Uttarakhand, General category, BPL, income Rs 35,000/yr.",
        "profile": {
            "age": 64,
            "annual_income_inr": 35000,
            "gender": "male",
            "state": "Uttarakhand",
            "categories": ["General"],
            "occupation": "farmer",
            "is_disabled": False,
            "is_bpl": True,
        },
    },
    {
        "id": "P08",
        "description": "35-year-old self-employed retail shop owner (vyapari) in Maharashtra, OBC, annual income Rs 2,40,000, not a tax payer.",
        "profile": {
            "age": 35,
            "annual_income_inr": 240000,
            "gender": "male",
            "state": "Maharashtra",
            "categories": ["OBC"],
            "occupation": "self-employed shop owner",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P09",
        "description": "6-year-old girl child in Madhya Pradesh, OBC family with annual income Rs 1,80,000.",
        "profile": {
            "age": 6,
            "annual_income_inr": 180000,
            "gender": "female",
            "state": "Madhya Pradesh",
            "categories": ["OBC"],
            "occupation": "child",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P10",
        "description": "24-year-old pregnant daily-wage woman in Odisha, SC & BPL household, annual income Rs 60,000.",
        "profile": {
            "age": 24,
            "annual_income_inr": 60000,
            "gender": "female",
            "state": "Odisha",
            "categories": ["SC"],
            "occupation": "worker",
            "is_disabled": False,
            "is_bpl": True,
        },
    },
    {
        "id": "P11",
        "description": "15-year-old ST boy studying in Class 9 in Jharkhand, parental income Rs 1,50,000/yr.",
        "profile": {
            "age": 15,
            "annual_income_inr": 150000,
            "gender": "male",
            "state": "Jharkhand",
            "categories": ["ST"],
            "occupation": "student",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P12",
        "description": "20-year-old Minority & OBC college student (B.Tech) in Kerala, parental income Rs 90,000/yr.",
        "profile": {
            "age": 20,
            "annual_income_inr": 90000,
            "gender": "male",
            "state": "Kerala",
            "categories": ["OBC", "Minority"],
            "occupation": "student",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P13",
        "description": "14-year-old OBC boy studying in Class 9 in Uttar Pradesh, parental income Rs 1,40,000/yr.",
        "profile": {
            "age": 14,
            "annual_income_inr": 140000,
            "gender": "male",
            "state": "Uttar Pradesh",
            "categories": ["OBC"],
            "occupation": "student",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P14",
        "description": "67-year-old male small farmer in Punjab (1.5 acres land), SC category, annual income Rs 50,000.",
        "profile": {
            "age": 67,
            "annual_income_inr": 50000,
            "gender": "male",
            "state": "Punjab",
            "categories": ["SC"],
            "occupation": "farmer",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P15",
        "description": "42-year-old male farmer in Arunachal Pradesh holding a Kisan Credit Card, ST category, income Rs 1,10,000/yr.",
        "profile": {
            "age": 42,
            "annual_income_inr": 110000,
            "gender": "male",
            "state": "Arunachal Pradesh",
            "categories": ["ST"],
            "occupation": "farmer",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
    {
        "id": "P16",
        "description": "38-year-old widow in Delhi (living in Delhi 10 years), EWS category, annual income Rs 72,000.",
        "profile": {
            "age": 38,
            "annual_income_inr": 72000,
            "gender": "female",
            "state": "Delhi",
            "categories": ["EWS"],
            "occupation": "worker",
            "is_disabled": False,
            "is_bpl": True,
        },
    },
    {
        "id": "P17",
        "description": "21-year-old disabled female university student (50% disability) in Tamil Nadu, OBC, parental income Rs 1,60,000/yr.",
        "profile": {
            "age": 21,
            "annual_income_inr": 160000,
            "gender": "female",
            "state": "Tamil Nadu",
            "categories": ["OBC"],
            "occupation": "student",
            "is_disabled": True,
            "is_bpl": False,
        },
    },
    {
        "id": "P18",
        "description": "50-year-old female small farmer in Chhattisgarh, OBC category, annual income Rs 95,000.",
        "profile": {
            "age": 50,
            "annual_income_inr": 95000,
            "gender": "female",
            "state": "Chhattisgarh",
            "categories": ["OBC"],
            "occupation": "farmer",
            "is_disabled": False,
            "is_bpl": False,
        },
    },
]

PERSONA_BY_ID = {p["id"]: p for p in PERSONAS}


def get_split(slug: str) -> str:
    if slug in DEV_SCHEMES:
        return "dev"
    if slug in TEST_SCHEMES:
        return "test"
    raise ValueError(f"Unknown scheme slug: {slug}")
