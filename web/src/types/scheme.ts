export type Gender = "male" | "female" | "transgender";
export type Category = "SC" | "ST" | "OBC" | "General" | "EWS" | "Minority";
export type EducationStage = "school" | "pre_matric" | "post_matric" | "higher_education";
export type MaritalStatus = "single" | "married" | "widow" | "divorced" | "separated" | "deserted";
export type EligibilityStatus = "eligible" | "possibly_eligible" | "need_more_info" | "not_eligible";
export type SchemeGroup = "pension" | "scholarship" | "farmer" | "women_family";
export type Language = "en" | "hi";

export interface SchemeRules {
  min_age: number | null;
  max_age: number | null;
  max_annual_income_inr: number | null;
  genders: Gender[];
  social_categories: Category[];
  occupations: string[];
  requires_disability: boolean | null;
  min_disability_percent?: number | null;
  requires_bpl: boolean | null;
  requires_student?: boolean | null;
  education_stages?: EducationStage[];
  marital_statuses?: MaritalStatus[];
  max_land_hectares?: number | null;
  excluded_genders?: Gender[];
  excludes_govt_employee?: boolean | null;
  excludes_income_tax_payer?: boolean | null;
  other_conditions: string[];
  exclusions: string[];
}

export interface SchemeRecord {
  slug: string;
  scheme: string;
  level: string;
  scope_state: string | null;
  url: string;
  model: string;
  group: SchemeGroup;
  rules: SchemeRules;
}

export interface UserProfile {
  age: number | null;
  annual_income_inr: number | null;
  gender: Gender | null;
  state: string | null;
  categories: Category[];
  occupation: string | null;
  is_disabled: boolean | null;
  disability_percent: number | null;
  is_bpl: boolean | null;
  is_student: boolean | null;
  education_stage: EducationStage | null;
  marital_status: MaritalStatus | null;
  land_hectares: number | null;
  is_govt_employee: boolean | null;
  is_income_tax_payer: boolean | null;
}

export interface CheckerEvaluation {
  slug: string;
  scheme: string;
  level: string;
  scope_state: string | null;
  url: string;
  group: SchemeGroup;
  status: EligibilityStatus;
  passed: string[];
  failed: string[];
  missing: string[];
  caveats: string[];
  rules: SchemeRules;
}

export interface StatusCounts {
  eligible: number;
  possibly_eligible: number;
  need_more_info: number;
  not_eligible: number;
}

export interface ChatTurnResponse {
  reply: string;
  language: Language;
  profile: UserProfile;
  asked_fields: string[];
  turn_count: number;
  next_question_field: string | null;
  next_question_text: string | null;
  counts: StatusCounts;
  results: CheckerEvaluation[];
}
