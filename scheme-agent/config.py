"""Central settings for the Scheme Agent project. Edit here, not in the scripts."""
from pathlib import Path

ROOT = Path(__file__).parent
DATA_CSV = ROOT / "data" / "raw" / "gov_myscheme_data.csv"
CHROMA_DIR = ROOT / "data" / "chroma"
COLLECTION_NAME = "schemes_v1"

# Dataset source (GitHub raw file, 2,066 schemes)
DATASET_URL = (
    "https://raw.githubusercontent.com/Aryan-Pardeshi/"
    "gov-myscheme-dataset/main/gov_myscheme_data.csv"
)

# Local models served by Ollama (run `ollama pull <name>` once)
LLM_MODEL = "qwen2.5:3b"     # small enough for CPU. Try "llama3.2:3b" or "gemma3:4b" to compare
EMBED_MODEL = "bge-m3"       # multilingual (handles Hindi) retrieval model

# Exact column names in the CSV
COL_NAME = "Scheme Name"
COL_SLUG = "Scheme Slug"
COL_LEVEL = "Level"
COL_STATE = "State / UT / Ministry"
COL_URL = "MyScheme URL"
COL_ELIG = "Eligibility Criteria"
COL_EXCL = "Exclusions / Ineligibility"

# Text sections we index. Key = label shown to the LLM, value = CSV column.
# ("Eligibility (General)" is skipped because it duplicates "Eligibility Criteria".)
SECTIONS = {
    "Description": "Description",
    "Eligibility": "Eligibility Criteria",
    "Exclusions": "Exclusions / Ineligibility",
    "Benefits": "Benefits",
    "Application Process": "Application Process",
    "Documents Required": "Documents Required",
    "FAQ": "Frequently Asked Questions (FAQs)",
}

# Chunking
CHUNK_CHARS = 1000
CHUNK_OVERLAP = 150

# Retrieval
TOP_K = 5
EMBED_BATCH = 16

# ---- Milestone 2 additions -------------------------------------------------
# Answer generation (ask.py)
MAX_NEW_TOKENS = 500      # hard cap so the model can never run away (Hindi loop fix)
REPEAT_PENALTY = 1.15     # discourages repeating the same phrase
MAX_DISTANCE = 0.55       # PROVISIONAL: chunks farther than this are ignored.
                          # (good matches were ~0.38-0.41, off-topic ~0.63-0.67 in Milestone 1.
                          #  We will calibrate this properly on the labeled test set.)

# Rule extraction
RULES_DIR = ROOT / "data" / "rules"
EVAL_SLUGS_FILE = ROOT / "eval_schemes.txt"
EXTRACT_MAX_TOKENS = 600
EXTRACT_MAX_INPUT_CHARS = 3500
