"use client";

import React, { useState } from "react";
import type { CheckerEvaluation, EligibilityStatus, Language } from "@/types/scheme";

export interface SchemeCardProps {
  evaluation: CheckerEvaluation;
  language: Language;
}

const STATUS_STYLES: Record<
  EligibilityStatus,
  {
    badgeBg: string;
    badgeText: string;
    border: string;
    labelEn: string;
    labelHi: string;
  }
> = {
  eligible: {
    badgeBg: "bg-emerald-100 border-emerald-300",
    badgeText: "text-emerald-800",
    border: "border-emerald-200",
    labelEn: "Eligible",
    labelHi: "पात्र (Eligible)",
  },
  possibly_eligible: {
    badgeBg: "bg-amber-100 border-amber-300",
    badgeText: "text-amber-900",
    border: "border-amber-200",
    labelEn: "Possibly Eligible — Verify Caveats",
    labelHi: "संभावित पात्र — शर्तें जांचें",
  },
  need_more_info: {
    badgeBg: "bg-blue-100 border-blue-300",
    badgeText: "text-blue-800",
    border: "border-blue-200",
    labelEn: "Need More Info",
    labelHi: "अधिक जानकारी चाहिए",
  },
  not_eligible: {
    badgeBg: "bg-slate-100 border-slate-300",
    badgeText: "text-slate-700",
    border: "border-slate-200",
    labelEn: "Not Eligible",
    labelHi: "अपात्र (Not Eligible)",
  },
};

const GROUP_LABELS: Record<string, { en: string; hi: string }> = {
  pension: { en: "Pension", hi: "पेंशन" },
  scholarship: { en: "Scholarship", hi: "छात्रवृत्ति" },
  farmer: { en: "Farmer & Agriculture", hi: "किसान एवं कृषि" },
  women_family: { en: "Women & Family", hi: "महिला एवं परिवार" },
};

export function SchemeCard({ evaluation, language }: SchemeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = STATUS_STYLES[evaluation.status];
  const grp = GROUP_LABELS[evaluation.group] ?? {
    en: evaluation.group,
    hi: evaluation.group,
  };

  return (
    <article
      className={`rounded-xl border ${style.border} bg-white p-4 shadow-sm transition hover:shadow-md`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {language === "hi" ? grp.hi : grp.en}
            </span>
            <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
              {evaluation.scope_state ? evaluation.scope_state : "Central Govt"}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {evaluation.scheme}
          </h3>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.badgeBg} ${style.badgeText}`}
        >
          {language === "hi" ? style.labelHi : style.labelEn}
        </span>
      </div>

      {/* Deterministic Rule Breakdown Summary */}
      <div className="mt-3 space-y-1.5 text-xs">
        {evaluation.passed.length > 0 && (
          <div className="flex items-start gap-1.5 text-emerald-700">
            <span className="font-bold">✓</span>
            <span>
              <strong>{language === "hi" ? "पूरा किए गए नियम:" : "Passed:"}</strong>{" "}
              {evaluation.passed.join(" • ")}
            </span>
          </div>
        )}

        {evaluation.failed.length > 0 && (
          <div className="flex items-start gap-1.5 text-rose-700">
            <span className="font-bold">✗</span>
            <span>
              <strong>{language === "hi" ? "अपात्रता का कारण:" : "Failed:"}</strong>{" "}
              {evaluation.failed.join(" • ")}
            </span>
          </div>
        )}

        {evaluation.missing.length > 0 && (
          <div className="flex items-start gap-1.5 text-blue-700">
            <span className="font-bold">?</span>
            <span>
              <strong>{language === "hi" ? "आवश्यक जानकारी:" : "Missing facts:"}</strong>{" "}
              {evaluation.missing.join(", ")}
            </span>
          </div>
        )}

        {evaluation.caveats.length > 0 && (
          <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-2 text-amber-900">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                ⚠️{" "}
                {language === "hi"
                  ? `सत्यापित करने योग्य शर्तें (${evaluation.caveats.length})`
                  : `Conditions to Verify on Portal (${evaluation.caveats.length})`}
              </span>
              {evaluation.caveats.length > 2 && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="text-[11px] font-semibold text-indigo-700 underline"
                >
                  {expanded
                    ? language === "hi"
                      ? "कम दिखाएं"
                      : "Show less"
                    : language === "hi"
                      ? "सभी देखें"
                      : "Show all"}
                </button>
              )}
            </div>
            <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px]">
              {(expanded ? evaluation.caveats : evaluation.caveats.slice(0, 2)).map(
                (c, idx) => (
                  <li key={idx}>{c}</li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
        <span className="text-[11px] text-slate-400">
          slug: <code>{evaluation.slug}</code>
        </span>
        <a
          href={evaluation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
        >
          {language === "hi"
            ? "आधिकारिक पोर्टल (myscheme.gov.in) ↗"
            : "Official Scheme Page (myscheme.gov.in) ↗"}
        </a>
      </div>
    </article>
  );
}
