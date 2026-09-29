# Milestone 2: Eligibility rules + rule checker

Copy these files into your existing `scheme-agent` folder (overwrite `config.py` and `ask.py`).
Your `data/` folder (dataset + ChromaDB) stays untouched.

## What's new
| File | What it does |
|---|---|
| `config.py` (changed) | new settings: answer length cap, repeat penalty, distance cutoff, rules folder |
| `ask.py` (changed) | UTF-8 output fix, length cap, repeat penalty, relevance cutoff, per-scheme answers |
| `eval_schemes.txt` | the 30 schemes we work on (pension, scholarship, farmer, other) |
| `schema.py` | `SchemeRules` (what we extract) and `UserProfile` (what we know about the user) |
| `extract_rules.py` | local LLM turns eligibility TEXT into JSON rules, saved in `data/rules/` |
| `checker.py` | plain-Python checker: eligible / not_eligible / need_more_info. No LLM. |
| `check_profile.py` | try the checker on real schemes from the command line |
| `review_rules.py` | exports `data/rules_review.csv` so you can verify the LLM's extraction |
| `tests/test_checker.py` | 8 tests for the checker |

## Run order
```
pip install -U ollama                  # only if extract_rules.py complains about `format`
python tests/test_checker.py           # 8 tests should pass
python extract_rules.py --slug apy     # try ONE scheme first, read the JSON in data/rules/apy.json
python extract_rules.py                # then all 30 (resumable, roughly 20-45 minutes on CPU)
python review_rules.py                 # then verify the results in data/rules_review.csv
python check_profile.py --all --age 68 --income 90000 --state Rajasthan --gender female --category SC
```
