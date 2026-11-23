"use client";

import React from "react";
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
    labelEn: "32yo ST Farmer (Gujarat, ₹85k, BPL)",
    labelHi: "32 वर्षीय किसान (गुजरात, ST, ₹85k)",
    profile: {
      ...EMPTY_PROFILE,
      age: 32,
      annual_income_inr: 85000,
      gender: "male",
      state: "Gujarat",
      categories: ["ST"],
      occupation: "farmer",
      is_disabled: false,
      is_bpl: true,
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
  const toggleCategory = (cat: Category) => {
    const exists = profile.categories.includes(cat);
    const next = exists
      ? profile.categories.filter((c) => c !== cat)
      : [...profile.categories, cat];
    onChange({ ...profile, categories: next });
  };

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {language === "hi" ? "नागरिक प्रोफ़ाइल (Citizen Profile)" : "Citizen Profile"}
          </h2>
          <p className="text-xs text-slate-500">
            {language === "hi"
              ? "चैट से स्वतः अपडेट होता है या स्वयं भरें"
              : "Auto-updates from chat or edit directly"}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          {language === "hi" ? "रीसेट" : "Reset"}
        </button>
      </div>

      {/* Quick Demo Personas */}
      <div className="mt-3">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {language === "hi" ? "त्वरित डेमो प्रोफ़ाइल" : "Quick Test Personas"}
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {SAMPLE_PERSONAS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(p.profile)}
              className="rounded-md bg-slate-100 px-2 py-1 text-left text-[11px] font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
            >
              {language === "hi" ? p.labelHi : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="mt-4 space-y-3 text-xs">
        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block font-medium text-slate-700">
              {language === "hi" ? "आयु (वर्ष)" : "Age (Years)"}
            </label>
            <input
              type="number"
              min={0}
              max={110}
              value={profile.age ?? ""}
              placeholder={language === "hi" ? "अनजान (Ask)" : "Unknown"}
              onChange={(e) =>
                onChange({
                  ...profile,
                  age: e.target.value === "" ? null : parseInt(e.target.value, 10),
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700">
              {language === "hi" ? "लिंग (Gender)" : "Gender"}
            </label>
            <select
              value={profile.gender ?? ""}
              onChange={(e) =>
                onChange({
                  ...profile,
                  gender: (e.target.value || null) as Gender | null,
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">{language === "hi" ? "चुनें..." : "Unknown"}</option>
              <option value="female">{language === "hi" ? "महिला (Female)" : "Female"}</option>
              <option value="male">{language === "hi" ? "पुरुष (Male)" : "Male"}</option>
              <option value="transgender">
                {language === "hi" ? "ट्रांसजेंडर (Transgender)" : "Transgender"}
              </option>
            </select>
          </div>
        </div>

        {/* State */}
        <div>
          <label className="block font-medium text-slate-700">
            {language === "hi" ? "राज्य / केंद्र शासित प्रदेश" : "State / Union Territory"}
          </label>
          <select
            value={profile.state ?? ""}
            onChange={(e) =>
              onChange({
                ...profile,
                state: e.target.value || null,
              })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">{language === "hi" ? "सभी / अनजान" : "Unknown (Ask)"}</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Annual Income */}
        <div>
          <label className="block font-medium text-slate-700">
            {language === "hi" ? "वार्षिक पारिवारिक आय (₹)" : "Annual Family Income (₹)"}
          </label>
          <input
            type="number"
            min={0}
            step={5000}
            value={profile.annual_income_inr ?? ""}
            placeholder="e.g. 90000"
            onChange={(e) =>
              onChange({
                ...profile,
                annual_income_inr:
                  e.target.value === "" ? null : parseInt(e.target.value, 10),
              })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Occupation */}
        <div>
          <label className="block font-medium text-slate-700">
            {language === "hi" ? "व्यवसाय / स्थिति" : "Occupation / Status"}
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
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">{language === "hi" ? "अनजान (Ask)" : "Unknown"}</option>
            <option value="farmer">{language === "hi" ? "किसान (Farmer)" : "Farmer / Cultivator"}</option>
            <option value="student">{language === "hi" ? "छात्र / छात्रा (Student)" : "Student"}</option>
            <option value="worker">{language === "hi" ? "श्रमिक / मजदूर (Worker)" : "Worker / Labourer"}</option>
            <option value="self-employed shop owner">
              {language === "hi" ? "दुकानदार / व्यापारी (Trader)" : "Shop Owner / Trader (Vyapari)"}
            </option>
            <option value="unemployed">
              {language === "hi" ? "बेरोजगार / गृहिणी (Unemployed)" : "Unemployed / Homemaker"}
            </option>
          </select>
        </div>

        {/* Social Categories (Multi-select) */}
        <div>
          <label className="block font-medium text-slate-700">
            {language === "hi"
              ? "सामाजिक वर्ग (एक से अधिक चुन सकते हैं)"
              : "Social Categories (Multi-select)"}
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const active = profile.categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* BPL & Disability Tri-state Selects */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className="block font-medium text-slate-700">
              {language === "hi" ? "BPL कार्ड धारक?" : "BPL Household?"}
            </label>
            <select
              value={
                profile.is_bpl === null ? "" : profile.is_bpl ? "true" : "false"
              }
              onChange={(e) =>
                onChange({
                  ...profile,
                  is_bpl:
                    e.target.value === "" ? null : e.target.value === "true",
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900"
            >
              <option value="">{language === "hi" ? "अनजान" : "Unknown"}</option>
              <option value="true">{language === "hi" ? "हाँ (Yes)" : "Yes"}</option>
              <option value="false">{language === "hi" ? "नहीं (No)" : "No"}</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700">
              {language === "hi" ? "दिव्यांग (Disabled)?" : "Disability?"}
            </label>
            <select
              value={
                profile.is_disabled === null
                  ? ""
                  : profile.is_disabled
                    ? "true"
                    : "false"
              }
              onChange={(e) =>
                onChange({
                  ...profile,
                  is_disabled:
                    e.target.value === "" ? null : e.target.value === "true",
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900"
            >
              <option value="">{language === "hi" ? "अनजान" : "Unknown"}</option>
              <option value="true">{language === "hi" ? "हाँ (Yes)" : "Yes"}</option>
              <option value="false">{language === "hi" ? "नहीं (No)" : "No"}</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}
