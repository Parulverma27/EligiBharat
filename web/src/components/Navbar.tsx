"use client";

import React from "react";
import type { Language } from "@/types/scheme";

export interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  totalSchemes: number;
}

export function Navbar({ language, onLanguageChange, totalSchemes }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      {/* Top Non-Government Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center text-xs text-amber-900">
        {language === "hi" ? (
          <span>
            <strong>अस्वीकरण:</strong> EligiBharat एक ओपन-सोर्स छात्र परियोजना है, कोई आधिकारिक सरकारी पोर्टल नहीं। आवेदन करने से पहले हमेशा{" "}
            <a
              href="https://www.myscheme.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              myscheme.gov.in
            </a>{" "}
            पर सत्यापित करें। (डेटा स्रोत: Aryan-Pardeshi / myscheme.gov.in)
          </span>
        ) : (
          <span>
            <strong>Disclaimer:</strong> EligiBharat is an open-source student project and NOT an official government tool. Always verify eligibility on{" "}
            <a
              href="https://www.myscheme.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              myscheme.gov.in
            </a>{" "}
            before applying. (Data credit: Aryan-Pardeshi / myscheme.gov.in)
          </span>
        )}
      </div>

      {/* Main Header Bar */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white shadow-sm">
            EB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                EligiBharat
              </h1>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-200">
                v2 Deterministic Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {language === "hi"
                ? `भारतीय सरकारी योजनाओं की पारदर्शी पात्रता जांच (${totalSchemes} सत्यापित योजनाएं)`
                : `Transparent Eligibility Checker for Indian Welfare Schemes (${totalSchemes} Verified Schemes)`}
            </p>
          </div>
        </div>

        {/* Language Toggle & Benchmark Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            {language === "hi"
              ? "100% बेंचमार्क सटीकता (90 केसेस)"
              : "100% v2 Benchmark Accuracy (90 cases)"}
          </div>

          <div
            className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                language === "en"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("hi")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                language === "hi"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
