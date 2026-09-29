"""Export a review sheet so YOU can verify the LLM's extraction against the source text.

    python review_rules.py     ->  data/rules_review.csv   (open in Excel)

Fill the last two columns: extraction_correct (yes / partly / no) and notes.
Those human judgements become your first real evaluation numbers.
"""
import csv
import json

import pandas as pd

import config
import extract_rules

df = pd.read_csv(config.DATA_CSV, encoding="utf-8-sig").set_index(config.COL_SLUG, drop=False)
out = config.ROOT / "data" / "rules_review.csv"

rows = []
for f in sorted(config.RULES_DIR.glob("*.json")):
    rec = json.loads(f.read_text(encoding="utf-8"))
    rows.append({
        "slug": rec["slug"],
        "scheme": rec["scheme"],
        "source_text": extract_rules.build_input(df.loc[rec["slug"]]),
        "extracted_rules": json.dumps(rec["rules"], ensure_ascii=False),
        "extraction_correct": "",
        "notes": "",
    })

with open(out, "w", newline="", encoding="utf-8-sig") as fh:   # utf-8-sig so Excel shows the rupee sign
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()) if rows else ["slug"])
    w.writeheader()
    w.writerows(rows)
print(f"Wrote {len(rows)} rows to {out}")
