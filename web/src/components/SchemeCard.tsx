"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Landmark,
  PlusCircle,
  XCircle,
} from "lucide-react";
import type {
  CheckerEvaluation,
  EligibilityStatus,
  Language,
  SchemeGroup,
} from "@/types/scheme";

export interface SchemeCardProps {
  evaluation: CheckerEvaluation;
  language: Language;
}

const STATUS_CONFIG: Record<
  EligibilityStatus,
  {
    pillBg: string;
    pillText: string;
    labelEn: string;
    labelHi: string;
    calloutBg: string;
    calloutText: string;
    calloutMsgEn: string;
    calloutMsgHi: string;
  }
> = {
  eligible: {
    pillBg: "bg-[#D1F2D9] border-[#9CE0AF]",
    pillText: "text-emerald-900",
    labelEn: "Eligible",
    labelHi: "पात्र",
    calloutBg: "bg-[#E5F6EB] border-[#BCE8C8]",
    calloutText: "text-emerald-950",
    calloutMsgEn: "You are eligible for this scheme.",
    calloutMsgHi: "आप इस योजना के लिए पात्र हैं।",
  },
  possibly_eligible: {
    pillBg: "bg-[#FDECC8] border-[#F7D38B]",
    pillText: "text-amber-900",
    labelEn: "Possibly Eligible",
    labelHi: "संभावित पात्र",
    calloutBg: "bg-[#FEF6E4] border-[#F7D38B]",
    calloutText: "text-amber-950",
    calloutMsgEn: "You meet core rules; verify caveats on portal.",
    calloutMsgHi: "मुख्य नियम पूरे हैं; पोर्टल पर शर्तें जांचें।",
  },
  need_more_info: {
    pillBg: "bg-[#DCEBFA] border-[#B3D2F5]",
    pillText: "text-blue-900",
    labelEn: "Need More Info",
    labelHi: "जानकारी अधूरी",
    calloutBg: "bg-[#EAF3FC] border-[#C2DBF7]",
    calloutText: "text-blue-950",
    calloutMsgEn: "More details required",
    calloutMsgHi: "पात्रता जांचने हेतु अधिक जानकारी आवश्यक",
  },
  not_eligible: {
    pillBg: "bg-[#FADCD9] border-[#F4B8B1]",
    pillText: "text-rose-900",
    labelEn: "Not Eligible",
    labelHi: "अपात्र",
    calloutBg: "bg-[#FDF0EE] border-[#F4B8B1]",
    calloutText: "text-rose-950",
    calloutMsgEn: "Does not match one or more criteria.",
    calloutMsgHi: "एक या अधिक पात्रता शर्तें मेल नहीं खातीं।",
  },
};

const GROUP_META: Record<
  SchemeGroup,
  {
    en: string;
    hi: string;
    pillBg: string;
    pillText: string;
    photoUrl: string;
  }
> = {
  pension: {
    en: "Pension",
    hi: "पेंशन",
    pillBg: "bg-[#E6E6FA]",
    pillText: "text-[#312E81]",
    photoUrl: "/images/scheme-pension.jpg",
  },
  scholarship: {
    en: "Scholarship",
    hi: "छात्रवृत्ति",
    pillBg: "bg-[#DBEAFE]",
    pillText: "text-[#1E3A8A]",
    photoUrl: "/images/scheme-scholarship.jpg",
  },
  farmer: {
    en: "Farmer",
    hi: "किसान",
    pillBg: "bg-[#DCFCE7]",
    pillText: "text-[#14532D]",
    photoUrl: "/images/scheme-pension.jpg",
  },
  women_family: {
    en: "Women & Family",
    hi: "महिला एवं परिवार",
    pillBg: "bg-[#FCE7F3]",
    pillText: "text-[#831843]",
    photoUrl: "/images/scheme-pension.jpg",
  },
};

export function SchemeCard({ evaluation, language }: SchemeCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const cfg = STATUS_CONFIG[evaluation.status];
  const grp = GROUP_META[evaluation.group] ?? GROUP_META.pension;

  // Format 2-3 readable human criteria bullets matching the reference mockup
  const r = evaluation.rules;
  const bullets: string[] = [];

  if (r.min_age !== null || r.max_age !== null) {
    if (r.min_age !== null && r.max_age !== null) {
      bullets.push(`Age: ${r.min_age}-${r.max_age} years`);
    } else if (r.min_age !== null) {
      bullets.push(`Age: ${r.min_age}+ years`);
    } else if (r.max_age !== null) {
      bullets.push(`Age: up to ${r.max_age} years`);
    }
  } else if (r.requires_student || evaluation.group === "scholarship") {
    bullets.push("Education: School / Post-Matric / Degree");
  } else if (r.occupations.length > 0) {
    bullets.push(`Occupation: ${r.occupations.slice(0, 2).join(", ")}`);
  }

  bullets.push(
    `State: ${evaluation.scope_state ?? (language === "hi" ? "संपूर्ण भारत" : "All India")}`
  );

  if (r.max_annual_income_inr !== null) {
    bullets.push(
      `Income: ₹ ${r.max_annual_income_inr.toLocaleString("en-IN")} (within limit)`
    );
  } else if (r.social_categories.length > 0) {
    bullets.push(`Category: ${r.social_categories.join(", ")}`);
  }

  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition hover:shadow-md">
      {/* 1. Top Pill Row: Category Pill + Scope Pill on Left, Status Pill on Right */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-3 py-0.5 text-[11.5px] font-bold ${grp.pillBg} ${grp.pillText}`}
          >
            {language === "hi" ? grp.hi : grp.en}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-[11.5px] font-semibold text-slate-700">
            <Landmark className="h-3.5 w-3.5 text-[#132F5B]" />
            <span>
              {evaluation.scope_state
                ? evaluation.scope_state
                : language === "hi"
                  ? "केंद्र सरकार"
                  : "Central Government"}
            </span>
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-extrabold ${cfg.pillBg} ${cfg.pillText}`}
        >
          {evaluation.status === "eligible" && (
            <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-700 text-white" />
          )}
          {evaluation.status === "possibly_eligible" && (
            <AlertCircle className="h-3.5 w-3.5 fill-amber-600 text-white" />
          )}
          {evaluation.status === "need_more_info" && (
            <PlusCircle className="h-3.5 w-3.5 fill-blue-600 text-white" />
          )}
          {evaluation.status === "not_eligible" && (
            <XCircle className="h-3.5 w-3.5 fill-rose-600 text-white" />
          )}
          <span>{language === "hi" ? cfg.labelHi : cfg.labelEn}</span>
          {evaluation.status === "eligible" && (
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          )}
          {evaluation.status === "need_more_info" && (
            <HelpCircle className="h-3.5 w-3.5" />
          )}
        </span>
      </div>

      {/* 2. Card Body: Real Cropped Photograph + Title/Bullets + Right Callout Box */}
      <div className="mt-2.5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3">
          <img
            src={grp.photoUrl}
            alt={evaluation.scheme}
            className="h-20 w-20 shrink-0 rounded-xl border border-slate-200 object-cover shadow-sm"
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-[15px] font-extrabold leading-snug text-[#0F2749]">
              {evaluation.scheme}
            </h3>

            <ul className="mt-1.5 space-y-1 text-xs text-slate-800">
              {bullets.slice(0, 3).map((text, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-emerald-700 text-white" />
                  <span className="leading-snug font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Status Callout Box */}
        <div
          className={`sm:w-44 shrink-0 rounded-xl border ${cfg.calloutBg} px-3 py-2.5 text-center text-xs font-bold leading-snug ${cfg.calloutText}`}
        >
          <p>{language === "hi" ? cfg.calloutMsgHi : cfg.calloutMsgEn}</p>
          {evaluation.missing.length > 0 && (
            <p className="mt-0.5 text-[11px] font-medium opacity-90">
              (e.g. {evaluation.missing.slice(0, 2).join(", ")})
            </p>
          )}
        </div>
      </div>

      {/* 3. Footer Row: "View Details ->" on Left, "Verify on myscheme.gov.in ↗" Navy CTA on Right */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#132F5B] hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>
            {showDetails
              ? language === "hi"
                ? "विवरण छुपाएं"
                : "Hide Details"
              : language === "hi"
                ? "विवरण देखें"
                : "View Details"}
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <a
          href={evaluation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#132F5B] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#0F2749] transition"
        >
          <span>
            {language === "hi"
              ? "myscheme.gov.in पर सत्यापित करें"
              : "Verify on myscheme.gov.in"}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* 4. Expandable Full Rule & Caveat Details Drawer */}
      {showDetails && (
        <div className="mt-2.5 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
          {evaluation.passed.length > 0 && (
            <div className="text-emerald-800">
              <strong>Passed:</strong> {evaluation.passed.join(" • ")}
            </div>
          )}
          {evaluation.failed.length > 0 && (
            <div className="text-rose-800">
              <strong>Failed:</strong> {evaluation.failed.join(" • ")}
            </div>
          )}
          {evaluation.missing.length > 0 && (
            <div className="text-blue-800">
              <strong>Missing facts:</strong> {evaluation.missing.join(", ")}
            </div>
          )}
          {evaluation.caveats.length > 0 && (
            <div className="text-amber-900">
              <strong>Caveats to verify on official portal:</strong>
              <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px]">
                {evaluation.caveats.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
