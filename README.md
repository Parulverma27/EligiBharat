# EligiBharat

**EligiBharat** is an open-source, fully local (zero API keys) assistant that helps Indian citizens discover which government welfare schemes they qualify for in **English and Hindi**. It extracts structured eligibility rules from unstructured scheme text offline with a small local LLM (`qwen2.5:3b` via Ollama), checks eligibility deterministically in pure Python (`checker.py`), asks only for missing facts, and cites the official `myscheme.gov.in` page.

---

## Project Status

- **Milestone 1 (Baseline RAG)**: ✅ Complete (1,316 chunks indexed in ChromaDB with `bge-m3`, cosine distance cutoff `0.55`, UTF-8 and Hindi repetition fixes).
- **Milestone 2 (Rule Extraction & Checker v1)**: ✅ Complete & tagged `m2-baseline` (30 evaluation schemes across pensions, scholarships, farmers, and women/family).
- **Milestone 3 (Evaluation Harness & Baseline Measurement)**: ✅ Complete (`data/rules_review.csv` reviewed for all 30 schemes; 18 hand-written personas, 90 blind-labeled cases split into 20 dev / 10 test schemes, scored with 95% Wilson confidence intervals).
- **Milestone 4 (Extractor & Deterministic Checker v2)**: ✅ Complete (added `possibly_eligible` status, checkable exclusions, student/gender/category validation, raising accuracy from **87.8% → 100.0%** and cutting false `not_eligible` errors from **4 → 0** on the 90-case benchmark).
- **Milestone 5 (Conversational Agent & Safety Guard)**: ✅ Complete (7-node bilingual pipeline in `scheme-agent/agent/` with language detection, profile extraction, single most-informative question selection, and deterministic safety guard).
- **Milestone 6 (FastAPI Backend & Next.js Web App for Vercel)**: ✅ Complete (`scheme-agent/app/api.py`, `Dockerfile`, and full Next.js + TypeScript + Tailwind CSS web frontend in `web/`).

---

## Benchmark Results (90 Labeled Cases across 30 Schemes)

| Version | Split | Cases | Accuracy | 95% Wilson CI | False `not_eligible` (FN) | False `eligible` (FP) | Precision / Recall / F1 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`m2-baseline` (v1)** | Dev (20 schemes) | 60 | 83.3% (50/60) | [72.0%, 90.7%] | 3 | 7 (all with caveats) | P=0.741 / R=0.870 / F1=0.800 |
| **`m2-baseline` (v1)** | Test (10 schemes) | 30 | 96.7% (29/30) | [83.3%, 99.4%] | 1 | 0 | P=1.000 / R=0.900 / F1=0.947 |
| **`m2-baseline` (v1)** | **All (30 schemes)** | **90** | **87.8% (79/90)** | **[79.4%, 93.0%]** | **4 (12.1%)** | **7** | **P=0.806 / R=0.879 / F1=0.841** |
| **`v2-final` (v2)** | Dev (20 schemes) | 60 | 100.0% (60/60) | [94.0%, 100.0%] | 0 | 0 | P=1.000 / R=1.000 / F1=1.000 |
| **`v2-final` (v2)** | Test (10 schemes) | 30 | 100.0% (30/30) | [88.6%, 100.0%] | 0 | 0 | P=1.000 / R=1.000 / F1=1.000 |
| **`v2-final` (v2)** | **All (30 schemes)** | **90** | **100.0% (90/90)** | **[95.9%, 100.0%]** | **0 (0.0%)** | **0** | **P=1.000 / R=1.000 / F1=1.000** |

---

## Repository Layout

```text
EligiBharat/
  README.md
  Dockerfile
  scheme-agent/
    config.py  utils.py  schema.py
    download_data.py  ingest.py  ask.py
    extract_rules.py  checker.py  check_profile.py  review_rules.py
    eval_schemes.txt
    evaluation/
      personas.py  make_cases.py  score.py  cases.csv  results/
    agent/
      prompts.py  nodes.py  graph.py
    app/
      api.py
    data/
      raw/  chroma/  rules/  rules_v1/  rules_review.csv
    tests/
      test_checker.py  test_score.py  test_agent.py
  web/                   # Next.js (App Router) + TypeScript + Tailwind CSS (Vercel-ready)
    src/
      types/scheme.ts
      lib/schemesData.ts  lib/checker.ts
      components/Navbar.tsx  ProfileForm.tsx  SchemeCard.tsx  SchemeResultsList.tsx  ChatPanel.tsx
      app/page.tsx  app/api/schemes/  app/api/check-profile/  app/api/chat/
```

---

## Quick Start

### 1. Run the Python Tests & Evaluation Suite
```bash
cd scheme-agent
.venv\Scripts\activate
python tests/test_checker.py
python tests/test_score.py
python tests/test_agent.py
python evaluation/score.py --rules-dir data/rules_v1 --split all --tag m2-baseline
python evaluation/score.py --rules-dir data/rules --split all --tag v2-final
```

### 2. Run the Next.js Web Application (Local or Vercel)
```bash
cd web
npm install
npm run dev      # opens http://localhost:3000
```
To deploy to **Vercel**, set the project Root Directory to `web`. The bundled v2 deterministic checker and `/api/check-profile`, `/api/schemes`, and `/api/chat` routes work 24/7 on Vercel out of the box, and automatically connect to your FastAPI backend when `NEXT_PUBLIC_API_BASE_URL` is set.

---

## Data Credits & Disclaimer

- **Data Credits**: Dataset `gov_myscheme_data.csv` from [Aryan-Pardeshi/gov-myscheme-dataset](https://github.com/Aryan-Pardeshi/gov-myscheme-dataset), sourced from [myscheme.gov.in](https://www.myscheme.gov.in/) (Government of India).
- **Disclaimer**: This is a student project. It is **NOT** an official government tool and is not affiliated with any government body. Always verify eligibility on the official scheme page before applying.
