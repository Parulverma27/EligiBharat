import type {
  Category,
  CheckerEvaluation,
  ChatTurnResponse,
  EligibilityStatus,
  Language,
  SchemeRecord,
  SchemeRules,
  StatusCounts,
  UserProfile,
} from "@/types/scheme";
import { SCHEMES_DATA } from "@/lib/schemesData";

export const EMPTY_PROFILE: UserProfile = {
  age: null,
  annual_income_inr: null,
  gender: null,
  state: null,
  categories: [],
  occupation: null,
  is_disabled: null,
  disability_percent: null,
  is_bpl: null,
  is_student: null,
  education_stage: null,
  marital_status: null,
  land_hectares: null,
  is_govt_employee: null,
  is_income_tax_payer: null,
};

export const INDIAN_STATES: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const OCC_GROUPS: string[][] = [
  [
    "farmer",
    "cultivator",
    "kisan",
    "agriculturist",
    "agricultural",
    "landholder",
    "grower",
    "marginal farmer",
    "small farmer",
    "large farmer",
    "tenant farmer",
    "share cropper",
  ],
  ["student", "scholar", "pupil"],
  [
    "worker",
    "labourer",
    "laborer",
    "labour",
    "construction worker",
    "unorganised worker",
    "employed",
    "wage earner",
    "daily wage",
  ],
  ["artisan", "craftsperson", "craftsman", "weaver"],
  [
    "entrepreneur",
    "self-employed",
    "trader",
    "businessperson",
    "shop owner",
    "retail owner",
    "vyapari",
  ],
];

function norm(s: string | null | undefined): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/_/g, " ")
    .replace(/\./g, "")
    .trim();
}

function groupOf(word: string): number | null {
  const w = norm(word);
  if (!w) return null;
  for (let i = 0; i < OCC_GROUPS.length; i++) {
    if (OCC_GROUPS[i].some((k) => k.includes(w) || w.includes(k))) {
      return i;
    }
  }
  return null;
}

export function occupationMatches(userOcc: string, schemeOccs: string[]): boolean {
  const u = norm(userOcc);
  for (const s of schemeOccs) {
    const sn = norm(s);
    if (sn && (sn.includes(u) || u.includes(sn))) return true;
    const gu = groupOf(u);
    const gs = groupOf(sn);
    if (gu !== null && gu === gs) return true;
  }
  return false;
}

export function checkScheme(
  profile: UserProfile,
  rules: SchemeRules,
  scopeState: string | null,
  strictPossiblyEligible = true
): {
  status: EligibilityStatus;
  passed: string[];
  failed: string[];
  missing: string[];
  caveats: string[];
} {
  const passed: string[] = [];
  const failed: string[] = [];
  const missing: string[] = [];

  const need = (field: string) => {
    if (!missing.includes(field)) missing.push(field);
  };

  // 1. State scope
  if (scopeState) {
    if (!profile.state) {
      need("state");
    } else if (norm(profile.state) !== norm(scopeState)) {
      failed.push(`scheme is only for ${scopeState}, you are in ${profile.state}`);
    } else {
      passed.push(`state is ${scopeState}`);
    }
  }

  // 2. Age
  if (rules.min_age !== null || rules.max_age !== null) {
    if (profile.age === null) {
      need("age");
    } else {
      if (rules.min_age !== null && profile.age < rules.min_age) {
        failed.push(`age ${profile.age} is below the minimum ${rules.min_age}`);
      } else if (rules.max_age !== null && profile.age > rules.max_age) {
        failed.push(`age ${profile.age} is above the maximum ${rules.max_age}`);
      } else {
        passed.push(`age ${profile.age} is within the allowed range`);
      }
    }
  }

  // 3. Income
  if (rules.max_annual_income_inr !== null) {
    if (profile.annual_income_inr === null) {
      need("annual_income_inr");
    } else if (profile.annual_income_inr > rules.max_annual_income_inr) {
      failed.push(
        `income ₹${profile.annual_income_inr.toLocaleString("en-IN")} is above the limit ₹${rules.max_annual_income_inr.toLocaleString("en-IN")}`
      );
    } else {
      passed.push("income is within the limit");
    }
  }

  // 4. Gender & Excluded Genders
  if (rules.genders.length > 0) {
    if (!profile.gender) {
      need("gender");
    } else if (!rules.genders.includes(profile.gender)) {
      failed.push(`scheme is for ${rules.genders.join(", ")}`);
    } else {
      passed.push("gender matches");
    }
  }

  if (rules.excluded_genders && rules.excluded_genders.length > 0) {
    if (!profile.gender) {
      need("gender");
    } else if (rules.excluded_genders.includes(profile.gender)) {
      failed.push(`scheme excludes ${rules.excluded_genders.join(", ")} applicants`);
    } else {
      passed.push("gender not excluded");
    }
  }

  // 5. Social categories
  if (rules.social_categories.length > 0) {
    if (profile.categories.length === 0) {
      need("categories");
    } else if (!profile.categories.some((c) => rules.social_categories.includes(c))) {
      failed.push(`scheme is for ${rules.social_categories.join(", ")}`);
    } else {
      passed.push("social category matches");
    }
  }

  // 6. Student & Occupation
  if (rules.requires_student) {
    const inferredStudent =
      profile.is_student !== null
        ? profile.is_student
        : profile.occupation
          ? groupOf(profile.occupation) === 1
          : null;
    if (inferredStudent === null) {
      need("occupation");
    } else if (!inferredStudent) {
      failed.push("scheme requires applicant to be a student");
    } else {
      passed.push("student requirement met");
    }
  }

  if (rules.occupations.length > 0) {
    if (!profile.occupation) {
      if (!(rules.requires_student && profile.is_student)) {
        need("occupation");
      }
    } else if (!occupationMatches(profile.occupation, rules.occupations)) {
      failed.push(`scheme is for: ${rules.occupations.join(", ")}`);
    } else {
      passed.push("occupation matches");
    }
  }

  // 7. Disability & BPL
  if (rules.requires_disability) {
    if (profile.is_disabled === null) {
      need("is_disabled");
    } else if (!profile.is_disabled) {
      failed.push("scheme requires a disability");
    } else if (
      rules.min_disability_percent !== null &&
      rules.min_disability_percent !== undefined &&
      profile.disability_percent !== null &&
      profile.disability_percent < rules.min_disability_percent
    ) {
      failed.push(
        `disability ${profile.disability_percent}% is below required ${rules.min_disability_percent}%`
      );
    } else {
      passed.push("disability requirement met");
    }
  }

  if (rules.requires_bpl) {
    if (profile.is_bpl === null) {
      need("is_bpl");
    } else if (!profile.is_bpl) {
      failed.push("scheme requires BPL status");
    } else {
      passed.push("BPL requirement met");
    }
  }

  // 8. Checkable Exclusions
  if (rules.excludes_govt_employee && profile.is_govt_employee === true) {
    failed.push("government / PSU employees are excluded");
  }
  if (rules.excludes_income_tax_payer && profile.is_income_tax_payer === true) {
    failed.push("income tax payers are excluded");
  }

  const caveats: string[] = [
    ...rules.other_conditions.map((c) => `Also required: ${c}`),
    ...rules.exclusions.map((e) => `Not eligible if: ${e}`),
  ];

  let status: EligibilityStatus = "eligible";
  if (failed.length > 0) {
    status = "not_eligible";
  } else if (missing.length > 0) {
    status = "need_more_info";
  } else if (strictPossiblyEligible && caveats.length > 0) {
    status = "possibly_eligible";
  }

  return { status, passed, failed, missing, caveats };
}

export function evaluateAllSchemes(
  profile: UserProfile,
  schemes: SchemeRecord[] = SCHEMES_DATA
): { counts: StatusCounts; results: CheckerEvaluation[] } {
  const results: CheckerEvaluation[] = schemes.map((rec) => {
    const res = checkScheme(profile, rec.rules, rec.scope_state, true);
    return {
      slug: rec.slug,
      scheme: rec.scheme,
      level: rec.level,
      scope_state: rec.scope_state,
      url: rec.url,
      group: rec.group,
      status: res.status,
      passed: res.passed,
      failed: res.failed,
      missing: res.missing,
      caveats: res.caveats,
      rules: rec.rules,
    };
  });

  const priority: Record<EligibilityStatus, number> = {
    eligible: 0,
    possibly_eligible: 1,
    need_more_info: 2,
    not_eligible: 3,
  };

  results.sort(
    (a, b) =>
      priority[a.status] - priority[b.status] ||
      a.missing.length - b.missing.length ||
      a.slug.localeCompare(b.slug)
  );

  const counts: StatusCounts = {
    eligible: results.filter((r) => r.status === "eligible").length,
    possibly_eligible: results.filter((r) => r.status === "possibly_eligible").length,
    need_more_info: results.filter((r) => r.status === "need_more_info").length,
    not_eligible: results.filter((r) => r.status === "not_eligible").length,
  };

  return { counts, results };
}

const QUESTION_TEMPLATES: Record<Language, Record<string, string>> = {
  en: {
    age: "Could you tell me your age (in years)? Many pension and scholarship schemes have strict age limits.",
    state: "Which State or Union Territory do you live in? This helps filter state-specific schemes for you.",
    annual_income_inr: "What is your approximate annual family income (in ₹)?",
    gender: "Could you share your gender (female / male / transgender)?",
    categories: "Which social category do you belong to (General / OBC / SC / ST / EWS / Minority)?",
    occupation: "What is your occupation or status (e.g., farmer, student, worker, shop owner)?",
    is_bpl: "Do you belong to a Below Poverty Line (BPL) household?",
    is_disabled: "Do you have a certified disability (Divyangjan)?",
  },
  hi: {
    age: "कृपया अपनी आयु (वर्षों में) बताएं? कई पेंशन और छात्रवृत्ति योजनाओं के लिए आयु सीमा निर्धारित है।",
    state: "आप किस राज्य या केंद्र शासित प्रदेश के निवासी हैं?",
    annual_income_inr: "आपकी वार्षिक पारिवारिक आय (₹ में) लगभग कितनी है?",
    gender: "कृपया अपना लिंग (महिला / पुरुष / ट्रांसजेंडर) बताएं?",
    categories: "आप किस सामाजिक वर्ग (General / OBC / SC / ST / EWS / Minority) से संबंधित हैं?",
    occupation: "आपका मुख्य व्यवसाय या स्थिति क्या है (जैसे: किसान, छात्र, मजदूर, दुकानदार)?",
    is_bpl: "क्या आपका परिवार गरीबी रेखा से नीचे (BPL) श्रेणी में आता है?",
    is_disabled: "क्या आप दिव्यांगजन (विकलांगता प्रमाण-पत्र धारक) हैं?",
  },
};

export function extractProfileFromText(text: string, current: UserProfile): UserProfile {
  const updated: UserProfile = {
    ...current,
    categories: [...current.categories],
  };
  const lower = text.toLowerCase();

  // Age
  const ageMatch =
    lower.match(/\b(?:age[d]?\s*(?:is|=|:)?\s*(\d{1,2})|(\d{1,2})\s*(?:years?\s*old|yr[s]?\s*old|yo|साल|वर्ष))\b/) ??
    lower.match(/(?:उम्र|आयु)\s*(\d{1,2})/);
  if (ageMatch) {
    const raw = ageMatch[1] ?? ageMatch[2];
    if (raw) {
      const val = parseInt(raw, 10);
      if (val >= 0 && val <= 110) updated.age = val;
    }
  }

  // Income
  const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख)/);
  if (lakhMatch && lakhMatch[1]) {
    updated.annual_income_inr = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const incMatch = lower.match(
      /(?:income|earning[s]?|salary|आय|कमाई|rs\.?|₹)\s*(?:is|of|:|=)?\s*(?:rs\.?|₹)?\s*([\d,]{4,9})/
    );
    if (incMatch && incMatch[1]) {
      const num = parseInt(incMatch[1].replace(/,/g, ""), 10);
      if (!Number.isNaN(num)) updated.annual_income_inr = num;
    }
  }

  // Gender
  if (lower.includes("widow") || text.includes("विधवा")) {
    updated.gender = "female";
    updated.marital_status = "widow";
  } else if (
    ["woman", "female", "girl", "mother", "pregnant", "महिला", "लड़की", "छात्रा", "औरत"].some((w) =>
      lower.includes(w)
    )
  ) {
    updated.gender = "female";
  } else if (["transgender", "किन्नर", "ट्रांसजेंडर"].some((w) => lower.includes(w))) {
    updated.gender = "transgender";
  } else if (
    /\b(man|male|boy)\b/.test(lower) ||
    ["पुरुष", "लड़का", "छात्र"].some((w) => text.includes(w))
  ) {
    updated.gender = "male";
  }

  // State
  for (const st of INDIAN_STATES) {
    if (lower.includes(st.toLowerCase())) {
      updated.state = st;
      break;
    }
  }
  const hindiStates: Record<string, string> = {
    राजस्थान: "Rajasthan",
    "उत्तर प्रदेश": "Uttar Pradesh",
    बिहार: "Bihar",
    गुजरात: "Gujarat",
    दिल्ली: "Delhi",
    पंजाब: "Punjab",
    उत्तराखंड: "Uttarakhand",
    छत्तीसगढ़: "Chhattisgarh",
    असम: "Assam",
    "अरुणाचल प्रदेश": "Arunachal Pradesh",
    "मध्य प्रदेश": "Madhya Pradesh",
    महाराष्ट्र: "Maharashtra",
    ओडिशा: "Odisha",
    झारखंड: "Jharkhand",
    कर्नाटक: "Karnataka",
    केरल: "Kerala",
    तमिलनाडु: "Tamil Nadu",
  };
  for (const [hi, en] of Object.entries(hindiStates)) {
    if (text.includes(hi)) {
      updated.state = en;
      break;
    }
  }

  // Categories
  const addCat = (c: Category) => {
    if (!updated.categories.includes(c)) updated.categories.push(c);
  };
  if (/\bsc\b/.test(lower) || lower.includes("scheduled caste") || text.includes("अनुसूचित जाति")) addCat("SC");
  if (/\bst\b/.test(lower) || lower.includes("scheduled tribe") || text.includes("आदिवासी")) addCat("ST");
  if (/\bobc\b/.test(lower) || lower.includes("other backward") || text.includes("अन्य पिछड़ा")) addCat("OBC");
  if (/\bews\b/.test(lower) || lower.includes("economically weaker")) addCat("EWS");
  if (/\bminority\b/.test(lower) || text.includes("अल्पसंख्यक")) addCat("Minority");
  if (/\bgeneral\b/.test(lower) || text.includes("सामान्य वर्ग")) addCat("General");

  // Occupation
  if (["farmer", "kisan", "cultivator", "किसान", "खेती"].some((w) => lower.includes(w))) {
    updated.occupation = "farmer";
  } else if (
    ["student", "studying", "school", "college", "degree", "scholarship", "छात्र", "छात्रा", "पढ़ाई"].some((w) =>
      lower.includes(w)
    )
  ) {
    updated.occupation = "student";
    updated.is_student = true;
  } else if (["shop owner", "trader", "vyapari", "self-employed", "दुकानदार", "व्यापारी"].some((w) => lower.includes(w))) {
    updated.occupation = "self-employed shop owner";
  } else if (["worker", "labour", "laborer", "daily wage", "मजदूर"].some((w) => lower.includes(w))) {
    updated.occupation = "worker";
  }

  // Disability & BPL
  if (["disabled", "disability", "divyang", "दिव्यांग", "विकलांग"].some((w) => lower.includes(w))) {
    updated.is_disabled = true;
  }
  if (["bpl", "below poverty line", "गरीबी रेखा", "बीपीएल"].some((w) => lower.includes(w))) {
    updated.is_bpl = true;
  }

  return updated;
}

export function runConversationalTurn(
  message: string,
  currentProfile: UserProfile,
  askedFields: string[],
  turnCount: number,
  preferredLang: Language
): ChatTurnResponse {
  const hasDevanagari = /[\u0900-\u097F]/.test(message);
  const language: Language = hasDevanagari ? "hi" : preferredLang;
  const profile = extractProfileFromText(message, currentProfile);
  const { counts, results } = evaluateAllSchemes(profile);

  // Pick single most impactful missing field
  const needInfo = results.filter((r) => r.status === "need_more_info");
  const missingFreq: Record<string, number> = {};
  for (const r of needInfo) {
    for (const mf of r.missing) {
      if (!askedFields.includes(mf)) {
        missingFreq[mf] = (missingFreq[mf] ?? 0) + 1;
      }
    }
  }

  let nextField: string | null = null;
  let nextText: string | null = null;
  const newAsked = [...askedFields];

  if (Object.keys(missingFreq).length > 0 && turnCount < 8) {
    nextField = Object.entries(missingFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    if (nextField) {
      nextText = QUESTION_TEMPLATES[language][nextField] ?? null;
      if (!newAsked.includes(nextField)) newAsked.push(nextField);
    }
  }

  const matched = results.filter(
    (r) => r.status === "eligible" || r.status === "possibly_eligible"
  );

  const lines: string[] = [];
  if (language === "hi") {
    if (matched.length > 0) {
      lines.push(
        `आपकी प्रोफ़ाइल के आधार पर **${matched.length} सरकारी योजनाएं** (${counts.eligible} पूर्णतः पात्र, ${counts.possibly_eligible} संभावित पात्र) मिली हैं:`
      );
      for (const r of matched.slice(0, 4)) {
        const badge =
          r.status === "eligible"
            ? "✅ पात्र (Eligible)"
            : "⚠️ संभावित पात्र — शर्तें जांचें (Possibly Eligible)";
        lines.push(`• **${r.scheme}** — ${badge}\n  आधिकारिक लिंक: ${r.url}`);
      }
    } else if (counts.need_more_info > 0) {
      lines.push(
        `मैंने **${counts.need_more_info} संभावित योजनाएं** खोजी हैं, लेकिन सटीक पात्रता बताने के लिए कुछ जानकारी और चाहिए।`
      );
    } else {
      lines.push("दी गई जानकारी के अनुसार वर्तमान में कोई योजना मेल नहीं खाती।");
    }
    if (nextText) {
      lines.push(`\n**अगला प्रश्न:** ${nextText}`);
    }
    lines.push(
      `\n*अस्वीकरण: यह एक छात्र परियोजना है, कोई आधिकारिक सरकारी सेवा नहीं। आवेदन से पूर्व myscheme.gov.in पर जांच करें।*`
    );
  } else {
    if (matched.length > 0) {
      lines.push(
        `Based on your profile, you qualify for **${matched.length} schemes** (${counts.eligible} Eligible, ${counts.possibly_eligible} Possibly Eligible):`
      );
      for (const r of matched.slice(0, 4)) {
        const badge =
          r.status === "eligible"
            ? "✅ ELIGIBLE"
            : "⚠️ POSSIBLY ELIGIBLE (Verify Caveats)";
        lines.push(`• **${r.scheme}** — ${badge}\n  Official Link: ${r.url}`);
      }
    } else if (counts.need_more_info > 0) {
      lines.push(
        `I found **${counts.need_more_info} potential schemes**, but I need one more detail to narrow down your eligibility.`
      );
    } else {
      lines.push(
        "No indexed schemes matched all your criteria. Try adjusting your profile or check official portals."
      );
    }
    if (nextText) {
      lines.push(`\n**Next Question:** ${nextText}`);
    }
    lines.push(
      `\n*Disclaimer: EligiBharat is an open-source student project and NOT an official government portal. Verify on myscheme.gov.in.*`
    );
  }

  return {
    reply: lines.join("\n\n"),
    language,
    profile,
    asked_fields: newAsked,
    turn_count: turnCount + 1,
    next_question_field: nextField,
    next_question_text: nextText,
    counts,
    results,
  };
}
