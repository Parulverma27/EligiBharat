"use client";

import React, { useState } from "react";
import {
  Accessibility,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Tractor,
  User,
} from "lucide-react";
import { EMPTY_PROFILE, INDIAN_STATES } from "@/lib/checker";
import type { Category, Gender, Language, UserProfile } from "@/types/scheme";

export interface ProfileFormProps {
  profile: UserProfile;
  language: Language;
  onChange: (updated: UserProfile) => void;
  onReset: () => void;
}

const CATEGORIES: Category[] = ["SC", "ST", "OBC", "General", "EWS", "Minority"];

const SAMPLE_PERSONAS: Array<{
  labelEn: string;
  labelHi: string;
  profile: UserProfile;
}> = [
  {
    labelEn: "32yo Farmer (Gujarat, OBC, ₹1.2L)",
    labelHi: "32 वर्षीय किसान (गुजरात, OBC, ₹1.2L)",
    profile: {
      ...EMPTY_PROFILE,
      age: 32,
      annual_income_inr: 120000,
      gender: "male",
      state: "Gujarat",
      categories: ["OBC"],
      occupation: "farmer",
      is_disabled: false,
      is_bpl: false,
    },
  },
  {
    labelEn: "68yo SC Widow (Rajasthan, ₹36k, BPL)",
    labelHi: "68 वर्षीय विधवा (राजस्थान, SC, ₹36k, BPL)",
    profile: {
      ...EMPTY_PROFILE,
      age: 68,
      annual_income_inr: 36000,
      gender: "female",
      state: "Rajasthan",
      categories: ["SC"],
      occupation: "unemployed",
      is_disabled: false,
      is_bpl: true,
      marital_status: "widow",
    },
  },
  {
    labelEn: "16yo SC Girl Student (UP, ₹1.2L)",
    labelHi: "16 वर्षीय छात्रा (उत्तर प्रदेश, SC, ₹1.2L)",
    profile: {
      ...EMPTY_PROFILE,
      age: 16,
      annual_income_inr: 120000,
      gender: "female",
      state: "Uttar Pradesh",
      categories: ["SC"],
      occupation: "student",
      is_student: true,
      is_disabled: false,
      is_bpl: false,
    },
  },
  {
    labelEn: "19yo B.Tech Girl Student (Assam, ₹4.5L)",
    labelHi: "19 वर्षीय इंजीनियरिंग छात्रा (असम, ₹4.5L)",
    profile: {
      ...EMPTY_PROFILE,
      age: 19,
      annual_income_inr: 450000,
      gender: "female",
      state: "Assam",
      categories: ["General"],
      occupation: "student",
      is_student: true,
      is_disabled: false,
      is_bpl: false,
    },
  },
];

export function ProfileForm({
  profile,
  language,
  onChange,
  onReset,
}: ProfileFormProps) {
  const [showEditor, setShowEditor] = useState(false);

  const toggleCategory = (cat: Category) => {
    const exists = profile.categories.includes(cat);
    const next = exists
      ? profile.categories.filter((c) => c !== cat)
      : [...profile.categories, cat];
    onChange({ ...profile, categories: next });
  };

  const genderDisplay =
    profile.gender === "male"
      ? language === "hi"
        ? "पुरुष"
        : "Male"
      : profile.gender === "female"
        ? language === "hi"
          ? "महिला"
          : "Female"
        : profile.gender === "transgender"
          ? language === "hi"
            ? "ट्रांसजेंडर"
            : "Transgender"
          : language === "hi"
            ? "अनजान"
            : "Ask";

  const occDisplay =
    profile.occupation === "farmer"
      ? language === "hi"
        ? "किसान"
        : "Farmer"
      : profile.occupation === "student"
        ? language === "hi"
          ? "छात्र"
          : "Student"
        : profile.occupation === "worker"
          ? language === "hi"
            ? "श्रमिक"
            : "Worker"
          : profile.occupation === "self-employed shop owner"
            ? language === "hi"
              ? "व्यापारी"
              : "Trader"
            : profile.occupation === "unemployed"
              ? language === "hi"
                ? "बेरोजगार"
                : "Unemployed"
              : language === "hi"
                ? "व्यवसाय"
                : "Occupation";

  const bplDisplay =
    profile.is_bpl === null
      ? "BPL: Ask"
      : profile.is_bpl
        ? "BPL: Yes"
        : "BPL: No";

  const disabilityDisplay =
    profile.is_disabled === null
      ? "Disability: Ask"
      : profile.is_disabled
        ? "Disability: Yes"
        : "Disability: No";

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-md">
      {/* 1. Card Header with Real Vector Icons */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 fill-[#0F2749] text-[#0F2749]" />
          <h2 className="font-serif text-[17px] font-bold text-[#0F2749]">
            {language === "hi" ? "आपकी प्रोफ़ाइल" : "Your Profile"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-[#132F5B] hover:bg-slate-100 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{language === "hi" ? "रीसेट" : "Reset"}</span>
        </button>
      </div>

      {/* 2. Avatar + 4 Metric Columns (Proportional Grid so Income ₹ 1,20,000 never truncates) */}
      <div className="mt-3.5 flex items-center gap-3">
        {/* Circular Avatar Silhouette */}
        <button
          type="button"
          onClick={() => setShowEditor(!showEditor)}
          title="Click to edit profile details"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[#475569] shadow-inner hover:ring-2 hover:ring-[#132F5B]/40 transition"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-11 w-11 fill-current"
            aria-hidden="true"
          >
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
          </svg>
        </button>

        {/* 4 Metric Columns + Attribute Pills */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="grid grid-cols-12 divide-x divide-slate-200 text-left">
            <div className="col-span-2 pr-1">
              <span className="block text-[11px] font-medium text-slate-500">
                {language === "hi" ? "आयु" : "Age"}
              </span>
              <span className="mt-0.5 block text-[15px] font-extrabold text-[#0F2749]">
                {profile.age !== null ? profile.age : "--"}
              </span>
            </div>

            <div className="col-span-3 px-2">
              <span className="block text-[11px] font-medium text-slate-500">
                {language === "hi" ? "लिंग" : "Gender"}
              </span>
              <span className="mt-0.5 block text-[15px] font-extrabold text-[#0F2749]">
                {genderDisplay}
              </span>
            </div>

            <div className="col-span-3 px-2">
              <span className="block text-[11px] font-medium text-slate-500">
                {language === "hi" ? "राज्य" : "State"}
              </span>
              <span className="mt-0.5 block text-[15px] font-extrabold text-[#0F2749] truncate">
                {profile.state ?? (language === "hi" ? "अनजान" : "Ask")}
              </span>
            </div>

            <div className="col-span-4 pl-2">
              <span className="block text-[11px] font-medium text-slate-500">
                {language === "hi" ? "आय" : "Income"}
              </span>
              <span className="mt-0.5 block text-[15px] font-extrabold text-[#0F2749] whitespace-nowrap">
                {profile.annual_income_inr !== null
                  ? `₹ ${profile.annual_income_inr.toLocaleString("en-IN")}`
                  : "--"}
              </span>
            </div>
          </div>

          {/* 3. Four Attribute Pill Badges on One Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowEditor(true)}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11.5px] font-bold text-[#0F2749] shadow-sm hover:bg-slate-100"
            >
              {profile.categories.length > 0
                ? profile.categories.join(", ")
                : "OBC"}
            </button>

            <button
              type="button"
              onClick={() => setShowEditor(true)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11.5px] font-bold text-[#0F2749] shadow-sm hover:bg-slate-100"
            >
              <Tractor className="h-3.5 w-3.5 text-emerald-600" />
              <span>{occDisplay}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...profile,
                  is_bpl:
                    profile.is_bpl === null
                      ? true
                      : profile.is_bpl
                        ? false
                        : null,
                })
              }
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11.5px] font-bold text-[#0F2749] shadow-sm hover:bg-slate-100"
            >
              <Check className="h-3.5 w-3.5 stroke-[3] text-amber-500" />
              <span>{bplDisplay}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...profile,
                  is_disabled:
                    profile.is_disabled === null
                      ? true
                      : profile.is_disabled
                        ? false
                        : null,
                })
              }
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11.5px] font-bold text-[#0F2749] shadow-sm hover:bg-slate-100"
            >
              <Accessibility className="h-3.5 w-3.5 text-blue-600" />
              <span>{disabilityDisplay}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. "More Details v" Toggle Button */}
      <div className="mt-3 border-t border-slate-100 pt-2 text-center">
        <button
          type="button"
          onClick={() => setShowEditor(!showEditor)}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0F2749] hover:underline"
        >
          <span>
            {showEditor
              ? language === "hi"
                ? "विवरण छुपाएं"
                : "Hide Details"
              : language === "hi"
                ? "अधिक विवरण"
                : "More Details"}
          </span>
          {showEditor ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* 5. Expandable Inline Editor Drawer */}
      {showEditor && (
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {language === "hi"
                ? "त्वरित डेमो प्रोफ़ाइल चुनें:"
                : "Quick Test Personas:"}
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {SAMPLE_PERSONAS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(p.profile)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0F2749] shadow-sm hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  {language === "hi" ? p.labelHi : p.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div>
              <label className="block font-semibold text-slate-700">Age</label>
              <input
                type="number"
                min={0}
                max={110}
                value={profile.age ?? ""}
                placeholder="32"
                onChange={(e) =>
                  onChange({
                    ...profile,
                    age:
                      e.target.value === ""
                        ? null
                        : parseInt(e.target.value, 10),
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Gender
              </label>
              <select
                value={profile.gender ?? ""}
                onChange={(e) =>
                  onChange({
                    ...profile,
                    gender: (e.target.value || null) as Gender | null,
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900"
              >
                <option value="">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">Transgender</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                State
              </label>
              <select
                value={profile.state ?? ""}
                onChange={(e) =>
                  onChange({
                    ...profile,
                    state: e.target.value || null,
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900"
              >
                <option value="">Unknown</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Income (₹)
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                value={profile.annual_income_inr ?? ""}
                placeholder="120000"
                onChange={(e) =>
                  onChange({
                    ...profile,
                    annual_income_inr:
                      e.target.value === ""
                        ? null
                        : parseInt(e.target.value, 10),
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700">
                Occupation
              </label>
              <select
                value={profile.occupation ?? ""}
                onChange={(e) => {
                  const occ = e.target.value || null;
                  onChange({
                    ...profile,
                    occupation: occ,
                    is_student: occ === "student" ? true : profile.is_student,
                  });
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900"
              >
                <option value="">Unknown</option>
                <option value="farmer">Farmer / Cultivator</option>
                <option value="student">Student</option>
                <option value="worker">Worker / Labourer</option>
                <option value="self-employed shop owner">
                  Shop Owner / Trader (Vyapari)
                </option>
                <option value="unemployed">Unemployed / Homemaker</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Social Categories
              </label>
              <div className="mt-1 flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => {
                  const active = profile.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`rounded-md border px-2 py-1 text-[11px] font-bold transition ${
                        active
                          ? "border-[#132F5B] bg-[#132F5B] text-white"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
