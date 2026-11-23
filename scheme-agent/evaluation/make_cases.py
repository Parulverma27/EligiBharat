"""Generate the 90 evaluation cases (3 personas per scheme across 30 schemes) into evaluation/cases.csv.

Each scheme is paired with 3 personas (2 plausible candidates + 1 unlikely candidate).
Labels are determined strictly from the official source eligibility text and persona description,
independent of the LLM extraction or checker output.
"""
import csv
import json
from pathlib import Path
import sys

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config
import extract_rules
from evaluation.personas import DEV_SCHEMES, PERSONA_BY_ID, SCHEME_GROUPS, TEST_SCHEMES, get_split

# 30 schemes x 3 personas = 90 cases: (persona_id, human_label, label_notes)
# Labels are grounded directly in the official source_text of each scheme.
SCHEME_CASE_SPECS = {
    # --- DEV SCHEMES (20 schemes, 60 cases) ---
    "apy": [
        ("P02", "eligible", "Age 32 is within 18-40, not an income tax payer."),
        ("P08", "eligible", "Age 35 is within 18-40, not an income tax payer."),
        ("P01", "not_eligible", "Age 68 exceeds maximum joining age of 40."),
    ],
    "igndps": [
        ("P06", "eligible", "Age 45 is within 18-79, 85% disabled (>=80%), and BPL."),
        ("P17", "not_eligible", "Age 21 is within 18-79 and disabled, but 50% (<80%) and not BPL."),
        ("P02", "not_eligible", "Not disabled."),
    ],
    "ignwps": [
        ("P01", "eligible", "Widow aged 68 (within 40-79) and BPL household."),
        ("P16", "not_eligible", "Widow and BPL, but age 38 is below minimum age 40."),
        ("P06", "not_eligible", "Male applicant (not a widow)."),
    ],
    "cmenspy": [
        ("P01", "eligible", "Widow in Rajasthan, age 68 (>=18), income Rs 36,000 (<48,000)."),
        ("P16", "not_eligible", "Widow aged 38, but resident of Delhi (not Rajasthan) and income 72,000 (>48,000)."),
        ("P05", "not_eligible", "Male resident of Karnataka with high income."),
    ],
    "mvspy": [
        ("P01", "eligible", "Rajasthan resident, female aged 68 (>=55), income Rs 36,000 (<48,000) and BPL."),
        ("P07", "not_eligible", "Age 64 and low income, but resident of Uttarakhand (not Rajasthan)."),
        ("P02", "not_eligible", "Age 32 in Gujarat (below 58 and not Rajasthan)."),
    ],
    "dpswdwp": [
        ("P16", "eligible", "Widow in Delhi (10 yrs residency), age 38 (>18), income Rs 72,000 (<1,00,000)."),
        ("P01", "not_eligible", "Widow with low income, but resident of Rajasthan (not Delhi)."),
        ("P08", "not_eligible", "Male in Maharashtra."),
    ],
    "oap": [
        ("P07", "eligible", "Resident of Uttarakhand, age 64 (>=60), BPL and income Rs 35,000 (<48,000/yr)."),
        ("P01", "not_eligible", "Age 68 and BPL, but resident of Rajasthan (not Uttarakhand)."),
        ("P02", "not_eligible", "Age 32 in Gujarat (below 60 and not Uttarakhand)."),
    ],
    "pmsfss": [
        ("P03", "eligible", "SC student, parental income Rs 1,20,000 (<=2,50,000)."),
        ("P12", "not_eligible", "Student with income <=2.5L, but OBC/Minority (not SC)."),
        ("P01", "not_eligible", "68-year-old unemployed widow (not a student)."),
    ],
    "pre-sc": [
        ("P03", "eligible", "SC student in Class 10, parental income Rs 1,20,000 (<=2,50,000)."),
        ("P11", "not_eligible", "Class 9 student with income <=2.5L, but ST (not SC)."),
        ("P05", "not_eligible", "Not a student, General category, income 12L."),
    ],
    "pre-st": [
        ("P11", "eligible", "ST student in Class 9, parental income Rs 1,50,000 (<=2,50,000)."),
        ("P15", "not_eligible", "ST category and income <=2.5L, but 42-year-old farmer (not a Class 9/10 student)."),
        ("P03", "not_eligible", "Class 10 student, but SC category (not ST)."),
    ],
    "mcm-min": [
        ("P12", "eligible", "Minority student pursuing B.Tech degree, parental income Rs 90,000 (<=2,50,000)."),
        ("P04", "not_eligible", "Engineering student, but General category (not Minority) and income 4.5L (>2.5L)."),
        ("P08", "not_eligible", "Shop owner, not a student or Minority."),
    ],
    "msssgc": [
        ("P03", "eligible", "16-year-old female school student."),
        ("P11", "not_eligible", "Male school student (scheme is only for single girl child)."),
        ("P01", "not_eligible", "68-year-old unemployed widow (not a school student)."),
    ],
    "psgs-deg": [
        ("P04", "eligible", "Female 1st-year engineering degree student from Assam (NE state), income Rs 4,50,000 (<=8,00,000)."),
        ("P12", "not_eligible", "Male B.Tech student (scheme is only for girl students)."),
        ("P05", "not_eligible", "Male engineer (not a female degree student)."),
    ],
    "gpmsup": [
        ("P13", "not_eligible", "UP student aged 14 with income <=2.5L, but OBC category (scheme is for General category)."),
        ("P03", "not_eligible", "UP student aged 16 with income <=2.5L, but SC category (scheme is for General category)."),
        ("P04", "not_eligible", "General category student aged 19, but resident of Assam (not UP) and income 4.5L (>2.5L)."),
    ],
    "pm-kisan": [
        ("P02", "eligible", "Small landholding farmer, not an income tax payer or govt employee."),
        ("P18", "eligible", "Small farmer in Chhattisgarh, low income."),
        ("P05", "not_eligible", "Software engineer and income tax payer (not a farmer)."),
    ],
    "kcc": [
        ("P02", "eligible", "Farmer / cultivator."),
        ("P14", "eligible", "Small farmer / cultivator."),
        ("P03", "not_eligible", "16-year-old school student (not a farmer)."),
    ],
    "cmkry": [
        ("P15", "eligible", "Farmer in Arunachal Pradesh holding a Kisan Credit Card."),
        ("P02", "not_eligible", "Farmer, but resident of Gujarat (scheme is only for Arunachal Pradesh)."),
        ("P05", "not_eligible", "Software engineer in Karnataka."),
    ],
    "agr3fmsstf": [
        ("P02", "eligible", "ST farmer and permanent resident of Gujarat."),
        ("P15", "not_eligible", "ST farmer, but resident of Arunachal Pradesh (not Gujarat)."),
        ("P14", "not_eligible", "SC farmer in Punjab (neither ST nor Gujarat)."),
    ],
    "ssy": [
        ("P09", "eligible", "6-year-old girl child (under maximum age of 10 years)."),
        ("P03", "not_eligible", "16-year-old female (exceeds maximum opening age of 10 years)."),
        ("P11", "not_eligible", "15-year-old boy (neither female nor under 10)."),
    ],
    "pmuy": [
        ("P10", "eligible", "Adult woman (24) from poor SC/BPL household."),
        ("P01", "eligible", "Adult woman (68) from poor SC/BPL household."),
        ("P02", "not_eligible", "Male member from household cannot apply."),
    ],
    # --- TEST SCHEMES (10 schemes, 30 cases) ---
    "nps-tsep": [
        ("P08", "eligible", "Self-employed retail shop owner (vyapari), age 35 (within 18-40), turnover/income well below 1.5 crore, not a taxpayer."),
        ("P02", "not_eligible", "Age 32, but occupation is farmer (not a trader/shop owner/vyapari)."),
        ("P01", "not_eligible", "Age 68 exceeds 18-40 age band and not a trader."),
    ],
    "oapsp": [
        ("P14", "eligible", "Resident of Punjab, male aged 67 (>=65), annual income Rs 50,000 (<=60,000), small landholding (1.5 acres)."),
        ("P07", "not_eligible", "Male farmer aged 64 with low income, but resident of Uttarakhand (not Punjab) and under male age 65."),
        ("P05", "not_eligible", "28-year-old in Karnataka with 12L income."),
    ],
    "kpy": [
        ("P07", "eligible", "Permanent resident of Uttarakhand, farmer with <=2 hectares land, age 64 (>60)."),
        ("P14", "not_eligible", "67-year-old farmer, but resident of Punjab (not Uttarakhand)."),
        ("P02", "not_eligible", "32-year-old farmer in Gujarat (under 60 and not Uttarakhand)."),
    ],
    "presm": [
        ("P12", "eligible", "Minority student with parental income Rs 90,000 (<=1,00,000)."),
        ("P13", "not_eligible", "Class 9 student, but OBC (not Minority) and income Rs 1,40,000 (>1,00,000)."),
        ("P02", "not_eligible", "32-year-old ST farmer (neither student nor Minority)."),
    ],
    "obcpms": [
        ("P13", "eligible", "Resident of UP, OBC category student, age 14 (within 12-20), parental income Rs 1,40,000 (<=2,00,000)."),
        ("P03", "not_eligible", "Resident of UP, student aged 16 with income <=2L, but SC category (not OBC)."),
        ("P12", "not_eligible", "OBC student aged 20, but resident of Kerala (not UP)."),
    ],
    "post-dis": [
        ("P17", "eligible", "Post-matric student with 50% disability (>=40%) and parental income Rs 1,60,000 (<=2,50,000)."),
        ("P06", "not_eligible", "85% disabled and low income, but 45-year-old unemployed (not a student)."),
        ("P04", "not_eligible", "University student, but not disabled and income 4.5L (>2.5L)."),
    ],
    "pmfby": [
        ("P02", "eligible", "Cultivator / farmer."),
        ("P18", "eligible", "Cultivator / farmer."),
        ("P05", "not_eligible", "Software engineer (not a farmer)."),
    ],
    "rgkny": [
        ("P18", "eligible", "Resident of Chhattisgarh, small farmer, age 50 (>18)."),
        ("P02", "not_eligible", "Small farmer aged 32, but resident of Gujarat (not Chhattisgarh)."),
        ("P09", "not_eligible", "6-year-old child in Madhya Pradesh."),
    ],
    "agr4fmsscf": [
        ("P14", "not_eligible", "SC farmer, but permanent resident of Punjab (not Gujarat)."),
        ("P02", "not_eligible", "Farmer in Gujarat, but ST category (scheme is for SC farmers)."),
        ("P01", "not_eligible", "SC category, but 68-year-old unemployed widow in Rajasthan (neither farmer nor Gujarat)."),
    ],
    "pmmvy": [
        ("P10", "eligible", "24-year-old (>=19) pregnant wage-earning woman from SC/BPL household with income Rs 60,000 (<8,00,000)."),
        ("P09", "not_eligible", "6-year-old girl child (under minimum age 19 and not pregnant/employed)."),
        ("P02", "not_eligible", "32-year-old male farmer."),
    ],
}


def main():
    df = pd.read_csv(config.DATA_CSV, encoding="utf-8-sig").set_index(config.COL_SLUG, drop=False)
    out_path = Path(__file__).resolve().parent / "cases.csv"

    all_slugs = DEV_SCHEMES + TEST_SCHEMES
    rows = []
    case_num = 1
    for slug in all_slugs:
        row = df.loc[slug]
        scheme_name = str(row[config.COL_NAME]).strip()
        level = str(row[config.COL_LEVEL]).strip()
        scope_state = str(row[config.COL_STATE]).strip() if level.startswith("State") else ""
        elig_text = extract_rules.build_input(row)
        split = get_split(slug)
        group = SCHEME_GROUPS[slug]

        for persona_id, label, notes in SCHEME_CASE_SPECS[slug]:
            persona = PERSONA_BY_ID[persona_id]
            rows.append({
                "case_id": f"C{case_num:03d}",
                "split": split,
                "group": group,
                "slug": slug,
                "scheme": scheme_name,
                "scope_state": scope_state,
                "persona_id": persona_id,
                "persona_description": persona["description"],
                "profile_json": json.dumps(persona["profile"], ensure_ascii=False),
                "eligibility_text": elig_text,
                "human_label": label,
                "label_notes": notes,
            })
            case_num += 1

    with open(out_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    dev_count = sum(1 for r in rows if r["split"] == "dev")
    test_count = sum(1 for r in rows if r["split"] == "test")
    print(f"Generated {len(rows)} cases ({dev_count} dev, {test_count} test) in {out_path}")


if __name__ == "__main__":
    main()
