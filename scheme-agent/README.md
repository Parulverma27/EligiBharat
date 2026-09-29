# Scheme Agent: Milestone 1 (Baseline RAG)

Ask questions about Indian government schemes. Runs 100% locally and free using Ollama + ChromaDB.

## One-time setup (Windows)

1. **Python 3.11 or 3.12**: install from python.org (tick "Add Python to PATH"). Check: `python --version`
2. **Ollama**: install from https://ollama.com/download, then check: `ollama --version`
3. **Pull the models** (about 3 GB total, one time):
   ```
   ollama pull qwen2.5:3b
   ollama pull bge-m3
   ```
4. **Create a virtual environment** inside this folder (open a terminal here):
   ```
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```
   If PowerShell blocks activation, run once: `Set-ExecutionPolicy -Scope Process Bypass`

## Run

```
python download_data.py          # gets the 2,066-scheme CSV
python ingest.py --limit 100     # index a random sample of 100 schemes
python ask.py "Which schemes help farmers with money?"
python ask.py                    # interactive mode
```

## What to try
- Ask something that IS in the data, then check the cited source URL.
- Ask something that is NOT in the data. It should say it doesn't have enough information.
- Ask in Hindi.
- Change `LLM_MODEL` in `config.py` (llama3.2:3b, gemma3:4b) and compare.

## Files
| File | Purpose |
|---|---|
| `config.py` | all settings (models, columns, chunk sizes) |
| `utils.py` | cleaning, chunking, embedding |
| `ingest.py` | CSV -> chunks -> embeddings -> ChromaDB |
| `ask.py` | retrieve top-k chunks -> local LLM -> cited answer |
