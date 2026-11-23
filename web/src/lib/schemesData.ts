import type { SchemeRecord } from "@/types/scheme";

export const SCHEMES_DATA: SchemeRecord[] = [
  {
    "slug": "agr3fmsstf",
    "scheme": "AGR 3 (Farm Mechanization) Scheme For ST Farmers",
    "level": "State / UT Government",
    "scope_state": "Gujarat",
    "url": "https://www.myscheme.gov.in/schemes/agr3fmsstf",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [
        "ST"
      ],
      "occupations": [
        "farmer"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "in 208 talukas where the SMAM scheme is not implemented",
        "benefited/adder under the Agriculture Support Program in Tribal Area Sub Plan & Dispersed Tribes (TASP)",
        "purchases the agricultural equipment from the authorized manufacturer"
      ],
      "exclusions": []
    },
    "group": "farmer"
  },
  {
    "slug": "agr4fmsscf",
    "scheme": "AGR 4 (Farm Mechanization) Scheme For SC Farmers",
    "level": "State / UT Government",
    "scope_state": "Gujarat",
    "url": "https://www.myscheme.gov.in/schemes/agr4fmsscf",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [
        "SC"
      ],
      "occupations": [
        "farmer"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "in 208 talukas where the SMAM scheme is not implemented",
        "purchases from the authorized dealer of the manufacturer included in the panel"
      ],
      "exclusions": [
        "permanent residents of other states"
      ]
    },
    "group": "farmer"
  },
  {
    "slug": "apy",
    "scheme": "Atal Pension Yojana",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/apy",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 18,
      "max_age": 40,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": true,
      "other_conditions": [],
      "exclusions": [
        "income tax payer"
      ]
    },
    "group": "pension"
  },
  {
    "slug": "cmenspy",
    "scheme": "Chief Minister Ekal Nari Samman Pension Yojana",
    "level": "State / UT Government",
    "scope_state": "Rajasthan",
    "url": "https://www.myscheme.gov.in/schemes/cmenspy",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 18,
      "max_age": null,
      "max_annual_income_inr": 48000,
      "genders": [
        "female"
      ],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": true,
      "excludes_income_tax_payer": null,
      "other_conditions": [],
      "exclusions": [
        "Central Government",
        "Other State Government",
        "State Government",
        "State Undertaking",
        "pensioner of Central Government",
        "pensioner of Other State Government",
        "pensioner of State Government",
        "pensioner of State Undertaking"
      ]
    },
    "group": "pension"
  },
  {
    "slug": "cmkry",
    "scheme": "Chief Minister's Krishi Rinn Yojana",
    "level": "State / UT Government",
    "scope_state": "Arunachal Pradesh",
    "url": "https://www.myscheme.gov.in/schemes/cmkry",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [
        "farmer"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "good repayment track record",
        "promptly repay their short-term production credit (crop loan) within one year",
        "crop loans or Kisan Credit Card limits up to Rs. 3.00 lakhs",
        "fulfill the eligibility criteria and documentation requirements set by the banks"
      ],
      "exclusions": [
        "production of perennial food crops",
        "production of plantation crops",
        "engaged in the production of excluded crops",
        "non-farmers or individuals not actively engaged in agricultural activities"
      ]
    },
    "group": "farmer"
  },
  {
    "slug": "dpswdwp",
    "scheme": "Delhi Pension Scheme To Women In Distress (Widow Pension)",
    "level": "State / UT Government",
    "scope_state": "Delhi",
    "url": "https://www.myscheme.gov.in/schemes/dpswdwp",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 18,
      "max_age": null,
      "max_annual_income_inr": 100000,
      "genders": [
        "female"
      ],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "residence of a minimum of 5 years in Delhi",
        "annual income less than ₹ 1,00,000/-per annum",
        "single-operated Aadhar-linked account with any bank in the NCT of Delhi",
        "not receiving any pension/ financial assistance from Central Govt./ State Govt./MCD or NDMC and other Governmental/local bodies or any other source for this purpose"
      ],
      "exclusions": []
    },
    "group": "pension"
  },
  {
    "slug": "gpmsup",
    "scheme": "General Pre Matric Scholarship-Uttar Pradesh",
    "level": "State / UT Government",
    "scope_state": "Uttar Pradesh",
    "url": "https://www.myscheme.gov.in/schemes/gpmsup",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 12,
      "max_age": 20,
      "max_annual_income_inr": 250000,
      "genders": [],
      "social_categories": [
        "General"
      ],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "students cannot receive other scholarships alongside this one (with some exceptions)"
      ],
      "exclusions": [
        "beneficiary's parents' annual income is more than ₹250000/-",
        "beneficiary is a dependent of people in traditionally untouchable occupations",
        "beneficiary's age limit is 12 to 20 years old (as of July 1st)",
        "beneficiary is not a resident of Uttar Pradesh"
      ]
    },
    "group": "scholarship"
  },
  {
    "slug": "igndps",
    "scheme": "Indira Gandhi National Disability Pension Scheme",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/igndps",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 18,
      "max_age": 79,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [],
      "requires_disability": true,
      "min_disability_percent": 80,
      "requires_bpl": true,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "physically or mentally disabled person",
        "more than 80% disability",
        "dwarf"
      ],
      "exclusions": []
    },
    "group": "pension"
  },
  {
    "slug": "ignwps",
    "scheme": "Indira Gandhi National Widow Pension Scheme",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/ignwps",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 40,
      "max_age": 79,
      "max_annual_income_inr": null,
      "genders": [
        "female"
      ],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": true,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [],
      "exclusions": [
        "remarriage",
        "above poverty line"
      ]
    },
    "group": "pension"
  },
  {
    "slug": "kcc",
    "scheme": "Kisan Credit Card",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/kcc",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [
        "farmer",
        "tenant farmer",
        "share cropper",
        "self help group",
        "joint liability group"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [],
      "exclusions": []
    },
    "group": "farmer"
  },
  {
    "slug": "kpy",
    "scheme": "Kisan Pension Yojana",
    "level": "State / UT Government",
    "scope_state": "Uttarakhand",
    "url": "https://www.myscheme.gov.in/schemes/kpy",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 60,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [
        "farmer"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "do farming on the same",
        "should not get pension benefits from any other sources"
      ],
      "exclusions": [
        "permanent resident of Uttarakhand"
      ]
    },
    "group": "pension"
  },
  {
    "slug": "mcm-min",
    "scheme": "Merit Cum Means Based Scholarship For Students Belonging To The Minority Communities",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/mcm-min",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": 250000,
      "genders": [],
      "social_categories": [
        "Minority"
      ],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "secured not less than 50% marks (or equivalent grade) in the previous final examination"
      ],
      "exclusions": [
        "violates school discipline",
        "any other terms and conditions of the scholarship",
        "any other scholarship out of all the available Scholarships of Central Government meant for SC/ST/OBC/minority",
        "obtained scholarship by false statement",
        "more than two students from a family",
        "any other scheme for this purpose"
      ]
    },
    "group": "scholarship"
  },
  {
    "slug": "msssgc",
    "scheme": "CBSE Merit Scholarship Scheme For Single Girl Child",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/msssgc",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": 25,
      "max_annual_income_inr": null,
      "genders": [
        "female"
      ],
      "social_categories": [],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "secured 60% or more marks in the CBSE Class 10th Examination",
        "studying Class 11th & 12th in School (affiliated with CBSE)",
        "tuition fee should not be more than ₹1,500/- per month during the academic year",
        "total enhancement in tuition fees in such a school shall not be more than 10% of the tuition fee charged",
        "Indian National",
        "continue her school studies in Classes 11th and 12th",
        "passed the CBSE Class 10th Examination in 2019"
      ],
      "exclusions": []
    },
    "group": "scholarship"
  },
  {
    "slug": "mvspy",
    "scheme": "Mukhyamantri Vriddhjan Samman Pension Yojana",
    "level": "State / UT Government",
    "scope_state": "Rajasthan",
    "url": "https://www.myscheme.gov.in/schemes/mvspy",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 55,
      "max_age": null,
      "max_annual_income_inr": 48000,
      "genders": [],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "people belonging to BPL/Antyodaya/Aastha Card holding families/Sahariya/Kathauri, Khairwa castes have been exempted from the income-related condition"
      ],
      "exclusions": []
    },
    "group": "pension"
  },
  {
    "slug": "nps-tsep",
    "scheme": "National Pension Scheme For Traders And Self Employed Persons",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/nps-tsep",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 18,
      "max_age": 40,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [
        "self-employed shop owner",
        "retail owner",
        "vyapari"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": true,
      "other_conditions": [],
      "exclusions": [
        "Covered under any National Pension Scheme contributed by the Central Government",
        "member of EPFO/NPS/ESIC",
        "income taxpayer",
        "Enrolled under Pradhan Mantri Shram Yogi Maandhan Yojana",
        "Enrolled under Pradhan Mantri Kisan Maandhan Yojana"
      ]
    },
    "group": "pension"
  },
  {
    "slug": "oap",
    "scheme": "Old Age Pension Scheme",
    "level": "State / UT Government",
    "scope_state": "Uttarakhand",
    "url": "https://www.myscheme.gov.in/schemes/oap",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 60,
      "max_age": null,
      "max_annual_income_inr": 48000,
      "genders": [],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": true,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "son or son is more than 20 years of age",
        "beneficiary over 60 years of age but not belong to a BPL family"
      ],
      "exclusions": [
        "government employees"
      ]
    },
    "group": "pension"
  },
  {
    "slug": "oapsp",
    "scheme": "Old Age Pension Scheme - Punjab",
    "level": "State / UT Government",
    "scope_state": "Punjab",
    "url": "https://www.myscheme.gov.in/schemes/oapsp",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 58,
      "max_age": null,
      "max_annual_income_inr": 60000,
      "genders": [],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "Annual Income of Beneficiary should not be more than Rs. 60,000/- per year",
        "Beneficiary should own any of the below mentioned amount of land :-Maximum 2.5 Acre Nehri or Chahi Land, ORMaximum 5 Acre Barani Land, ORWaterlogged 5 Acre Land"
      ],
      "exclusions": []
    },
    "group": "pension"
  },
  {
    "slug": "obcpms",
    "scheme": "OBC Pre Matric Scholarship-Uttar Pradesh",
    "level": "State / UT Government",
    "scope_state": "Uttar Pradesh",
    "url": "https://www.myscheme.gov.in/schemes/obcpms",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 12,
      "max_age": 20,
      "max_annual_income_inr": 200000,
      "genders": [],
      "social_categories": [
        "OBC"
      ],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "Beneficiary's parents' annual income should not be more than ₹2,00,000/-",
        "All the children of the applicant's parents will be eligible",
        "Students cannot receive other scholarships alongside this one (with some exceptions)"
      ],
      "exclusions": [
        "untouchable occupations"
      ]
    },
    "group": "scholarship"
  },
  {
    "slug": "pm-kisan",
    "scheme": "Pradhan Mantri Kisan Samman Nidhi",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/pm-kisan",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [
        "farmer"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": true,
      "excludes_income_tax_payer": true,
      "other_conditions": [],
      "exclusions": [
        "All Institutional Land holders",
        "Former and present holders of constitutional posts",
        "Former and present Ministers/ State Ministers and former/present Members of LokSabha/ RajyaSabha/ State Legislative Assemblies/ State Legislative Councils, former and present Mayors of Municipal Corporations, former and present Chairpersons of District Panchayats",
        "All serving or retired officers and employees of Central/ State Government Ministries /Offices/Departments and its field units Central or State PSEs and Attached offices /Autonomous Institutions under Government as well as regular employees of the Local Bodies (Excluding Multi Tasking Staff /Class IV/Group D employees)",
        "All superannuated/retired pensioners whose monthly pension is Rs.10,000/- or more (Excluding Multi Tasking Staff / Class IV/Group D employees)",
        "All Persons who paid Income Tax in last assessment year",
        "Professionals like Doctors, Engineers, Lawyers, Chartered Accountants, and Architects registered with Professional bodies and carrying out profession by undertaking practices."
      ]
    },
    "group": "farmer"
  },
  {
    "slug": "pmfby",
    "scheme": "Pradhan Mantri Fasal Bima Yojna",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/pmfby",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [
        "farmer"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "have a valid and authenticated land ownership certificate or a valid land tenancy agreement",
        "have applied for insurance coverage within the prescribed time frame",
        "have not received any compensation for the same crop loss from any other source",
        "have a valid bank account and provide details of their bank account, along with a valid identity proof, at the time of enrollment",
        "are growing notified crops in a notified area during the season",
        "have an insurable interest in the crop"
      ],
      "exclusions": [
        "War & kindred perils",
        "nuclear risks",
        "riots",
        "malicious damage",
        "theft",
        "act of enmity",
        "grazed and/or destroyed by domestic and/or wild animals",
        "Post-Harvest losses",
        "harvested crop bundled and heaped at a place before threshing",
        "other preventable risks"
      ]
    },
    "group": "farmer"
  },
  {
    "slug": "pmmvy",
    "scheme": "Pradhan Mantri Matru Vandana Yojana",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/pmmvy",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 19,
      "max_age": null,
      "max_annual_income_inr": 800000,
      "genders": [
        "female"
      ],
      "social_categories": [],
      "occupations": [
        "employed"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": true,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "first live birth",
        "second girl child",
        "second pregnancy",
        "partial disability",
        "full disability",
        "beneficiary under PMJAY",
        "beneficiary under Kisan Samman Nidhi",
        "beneficiary under MGNREGA",
        "beneficiary under NFSA",
        "beneficiary under Ayushman Bharat",
        "beneficiary under Pradhan Mantri Jan Aarogya Yojana",
        "beneficiary under PMMVY 2.0"
      ],
      "exclusions": [
        "beneficiary's husband's Aadhaar is not mandatory",
        "beneficiary in regular employment with the Central Government or State Government or Public Sector Undertaking or those who are in receipt of similar benefits under any law for the time being in force"
      ]
    },
    "group": "women_family"
  },
  {
    "slug": "pmsfss",
    "scheme": "Post-Matric Scholarship for SC students",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/pmsfss",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": 250000,
      "genders": [],
      "social_categories": [
        "SC"
      ],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "passed Matriculation, Higher Secondary, or a higher examination of a recognized university or Board of Secondary Education",
        "parents' or guardians' income does not exceed ₹ 2,50,000/- per annum",
        "studying in the same stage of education in a different subject after passing one stage of education is not eligible",
        "studying through correspondence or online courses is eligible",
        "all children of any parent or guardian are entitled to receive benefits of the scheme",
        "a scholarship holder under this scheme will not hold any other scholarship or stipend"
      ],
      "exclusions": [
        "government employees"
      ]
    },
    "group": "scholarship"
  },
  {
    "slug": "pmuy",
    "scheme": "Pradhan Mantri Ujjwala Yojana",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/pmuy",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 18,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [
        "female"
      ],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [
        "male"
      ],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "not falling in the above 2 categories",
        "submit 14-point declaration"
      ],
      "exclusions": [
        "male member"
      ]
    },
    "group": "women_family"
  },
  {
    "slug": "post-dis",
    "scheme": "Post Matric Scholarship Students With Disabilities",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/post-dis",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": 250000,
      "genders": [],
      "social_categories": [],
      "occupations": [
        "student"
      ],
      "requires_disability": true,
      "min_disability_percent": 40,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "disabled percentage of 40% or above",
        "total annual income of parents/guardians not exceeding ₹ 2.50 Lakh per Annum",
        "not availing any other scholarship by the govt",
        "not the third sibling of the family who has been given this scholarship"
      ],
      "exclusions": [
        "more than two students from a family",
        "second child is a twin",
        "cannot hold any other scholarship or stipend",
        "furnishes false information / document",
        "has to repeat a class"
      ]
    },
    "group": "scholarship"
  },
  {
    "slug": "pre-sc",
    "scheme": "Centrally-Sponsored Scheme Of Pre-Matric Scholarship For Scheduled Caste Students Studying In Classes 9th & 10th",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/pre-sc",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": 25,
      "max_annual_income_inr": 250000,
      "genders": [],
      "social_categories": [
        "SC"
      ],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [],
      "exclusions": [
        "repeating a class",
        "false statements"
      ]
    },
    "group": "scholarship"
  },
  {
    "slug": "pre-st",
    "scheme": "Pre Matric Scholarship For Scheduled Tribe Students",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/pre-st",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": 25,
      "max_annual_income_inr": 250000,
      "genders": [],
      "social_categories": [
        "ST"
      ],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "not availing of any other scholarship by the govt."
      ],
      "exclusions": []
    },
    "group": "scholarship"
  },
  {
    "slug": "presm",
    "scheme": "Pre Matric Scholarship For Minorities",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/presm",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": 25,
      "max_annual_income_inr": 100000,
      "genders": [],
      "social_categories": [
        "Minority"
      ],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "secured not less than 50% marks in the previous final examination",
        "not availing any other scholarship by the govt",
        "not the third sibling in his/her family who has been given this scholarship"
      ],
      "exclusions": [
        "violating school discipline",
        "availing any other scholarship out of all the available Scholarships of Central Government meant for SC/ST/OBC/minority",
        "obtaining benefits under this scheme",
        "obtaining benefits under any other scheme for this purpose",
        "obtaining a scholarship by false statement"
      ]
    },
    "group": "scholarship"
  },
  {
    "slug": "psgs-deg",
    "scheme": "Pragati Scholarship Scheme For Girl Students (Technical Degree)",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/psgs-deg",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": null,
      "max_age": null,
      "max_annual_income_inr": 800000,
      "genders": [
        "female"
      ],
      "social_categories": [],
      "occupations": [
        "student"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": true,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "pursuing either the First year of the degree course OR the Second year of the Degree course through lateral entry",
        "family income not more than ₹ 8,00,000/- per annum",
        "eligible girls from 13 Union Territories and North Eastern States",
        "maximum of two girl children in a family"
      ],
      "exclusions": [
        "failed/drops out in a subsequent year",
        "in receipt of financial assistance from any other source",
        "gap period between qualifying examination and admission session more than two years"
      ]
    },
    "group": "scholarship"
  },
  {
    "slug": "rgkny",
    "scheme": "Rajiv Gandhi Kisan Nyay Yojana",
    "level": "State / UT Government",
    "scope_state": "Chhattisgarh",
    "url": "https://www.myscheme.gov.in/schemes/rgkny",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 18,
      "max_age": null,
      "max_annual_income_inr": null,
      "genders": [],
      "social_categories": [],
      "occupations": [
        "marginal_farmer",
        "small_farmer",
        "large_farmer"
      ],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [],
      "exclusions": []
    },
    "group": "farmer"
  },
  {
    "slug": "ssy",
    "scheme": "Sukanya Samriddhi Yojana",
    "level": "Central Government",
    "scope_state": null,
    "url": "https://www.myscheme.gov.in/schemes/ssy",
    "model": "qwen2.5:3b",
    "rules": {
      "min_age": 0,
      "max_age": 10,
      "max_annual_income_inr": null,
      "genders": [
        "female"
      ],
      "social_categories": [],
      "occupations": [],
      "requires_disability": null,
      "min_disability_percent": null,
      "requires_bpl": null,
      "requires_student": null,
      "education_stages": [],
      "marital_statuses": [],
      "max_land_hectares": null,
      "excluded_genders": [],
      "excludes_govt_employee": null,
      "excludes_income_tax_payer": null,
      "other_conditions": [
        "account holder shall have a single account under this Scheme",
        "An account under this Scheme may be opened for a maximum of two girl children in one family",
        "more than two accounts may be opened in a family if such children are born in the first or in the second order of birth or in both",
        "the above proviso shall not apply to the girl child of the second order of birth if the first order of birth in the family results in two or more surviving girl children"
      ],
      "exclusions": []
    },
    "group": "women_family"
  }
];
