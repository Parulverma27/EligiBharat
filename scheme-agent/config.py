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
