"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Lock,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SCHEMES_DATA } from "@/lib/schemesData";
import type { Language } from "@/types/scheme";

export default function AboutPage() {
  const [language, setLanguage] = useState<Language>("en");

  const pillars = [
    {
      icon: Cpu,
      titleEn: "100% Local & Zero Cost",
      titleHi: "100% लोकल और निःशुल्क",
      descEn:
        "Runs entirely on open-weights models via Ollama (qwen2.5:3b + bge-m3) and ChromaDB on a standard 16 GB CPU laptop. No paid API keys required — NGOs, panchayats, and students can run it for free.",
      descHi:
        "यह पूरी तरह से Ollama (qwen2.5:3b + bge-m3) और ChromaDB के माध्यम से सामान्य लैपटॉप पर चलता है। किसी पेड API की आवश्यकता नहीं है।",
    },
    {
      icon: Scale,
      titleEn: "Extract Offline, Check Deterministically",
      titleHi: "ऑफ़लाइन नियम निष्कर्षण, पारदर्शी जांच",
      descEn:
        "A small LLM converts unstructured scheme eligibility text into structured JSON rules once, offline. At runtime, a pure Python/TypeScript rule checker evaluates your profile — the LLM never makes the final yes/no decision.",
      descHi:
        "LLM केवल एक बार ऑफ़लाइन रूप से योजना के पाठ को JSON नियमों में बदलता है। पात्रता का अंतिम निर्णय हमेशा शुद्ध नियम इंजन द्वारा किया जाता है।",
    },
    {
      icon: Award,
      titleEn: "Measured on a 90-Case Benchmark",
      titleHi: "90-केस बेंचमार्क पर प्रमाणित",
      descEn:
        "Tested across 30 central & state schemes and 18 independent citizen personas (60 dev / 30 held-out test cases). Checker v2 raised accuracy from 87.8% (m2-baseline) to 100.0% and cut false 'not_eligible' errors to zero.",
      descHi:
        "30 सरकारी योजनाओं और 18 नागरिक प्रोफ़ाइलों (90 परीक्षण केसेस) पर जांचा गया। Checker v2 ने सटीकता को 87.8% से बढ़ाकर 100.0% किया।",
    },
  ];

  const comparisons = [
    {
      project: "Jugalbandi (OpenNyAI, AI4Bharat)",
      what: "WhatsApp bot over 171 programmes using state-machine & cloud LLMs (repo now deprecated)",
      diff: "Depended on paid cloud LLM APIs; EligiBharat runs locally and focuses on deterministic eligibility reasoning.",
    },
    {
      project: "PM-KISAN AI Chatbot",
      what: "Multilingual chatbot for a single agricultural scheme",
      diff: "Covers one scheme only; EligiBharat screens across pensions, scholarships, farmers, and women/family schemes.",
    },
    {
      project: "Haqdarshak",
      what: "Established social enterprise with human field agents & researcher-mapped rules",
      diff: "Rules are authored manually by people; EligiBharat extracts rules automatically from text and measures extraction error.",
    },
    {
      project: "AgriGov & IndicRAGSuite (2026)",
      what: "Multilingual farmer-scheme dataset and Indian-language RAG benchmark",
      diff: "Neither provides labeled person-scheme eligibility test cases with deterministic rule checking.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F9]">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />

      {/* Page Hero Header */}
      <section className="border-b border-slate-200 bg-gradient-to-r from-[#0F2749] via-[#132F5B] to-[#1E3A8A] text-white py-10 px-4">
        <div className="mx-auto max-w-[1200px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {language === "hi"
                ? "परियोजना परिचय और मिशन"
                : "About the Project & Research Mission"}
            </span>
          </span>
          <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl">
            {language === "hi"
              ? "EligiBharat: पारदर्शी सरकारी योजना पात्रता सहायक"
              : "Why We Built EligiBharat"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
            {language === "hi"
              ? "नागरिक अक्सर तीन कारणों से कल्याणकारी योजनाओं से वंचित रह जाते हैं: उन्हें योजना के अस्तित्व का पता नहीं होता, वे यह नहीं समझ पाते कि वे पात्र हैं या नहीं, और आधिकारिक दस्तावेज़ लंबे तथा मुख्य रूप से अंग्रेजी में होते हैं।"
              : "Millions of citizens miss welfare benefits for three reasons: they do not know a scheme exists, they cannot tell whether they qualify, and official guidelines are long and mostly in English. EligiBharat bridges this gap with transparent, auditable rules."}
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1200px] flex-1 space-y-8 px-4 py-8 sm:px-6">
        {/* 1. Three Core Design Pillars */}
        <section>
          <h2 className="font-serif text-2xl font-extrabold text-[#0F2749]">
            {language === "hi"
              ? "तीन मुख्य डिज़ाइन सिद्धांत"
              : "Three Core Design Choices"}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#132F5B] text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3.5 font-serif text-lg font-extrabold text-[#0F2749]">
                    {language === "hi" ? p.titleHi : p.titleEn}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {language === "hi" ? p.descHi : p.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Goals vs Non-Goals (Safety & Ethics) */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-6 w-6 fill-emerald-700 text-white" />
              <h2 className="font-serif text-xl font-extrabold text-[#0F2749]">
                {language === "hi" ? "परियोजना के लक्ष्य (Goals)" : "Project Goals"}
              </h2>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓</span>
                <span>
                  Conversational eligibility screening in <strong>English and Hindi</strong> across central and state welfare schemes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓</span>
                <span>
                  Every answer names the exact scheme, shows passed/failed/missing rules, and links directly to its official{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                    myscheme.gov.in
                  </code>{" "}
                  page.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓</span>
                <span>
                  Asymmetric safety with a <strong>Possibly Eligible</strong> status whenever unchecked caveats remain — because turning away an eligible citizen is the worst error.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓</span>
                <span>
                  A published, blind-labeled benchmark with 95% Wilson confidence intervals.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-[#FFF8EB] p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-6 w-6 text-amber-700" />
              <h2 className="font-serif text-xl font-extrabold text-[#0F2749]">
                {language === "hi"
                  ? "गैर-लक्ष्य और सीमाएं (Non-Goals & Ethics)"
                  : "Non-Goals & Ethical Guardrails"}
              </h2>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-800">
              <li className="flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  <strong>Not an official government portal:</strong> Gives no legal advice and never imitates an official government service.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  <strong>Zero personal data storage:</strong> No user accounts and no database tracking. Your profile lives only in your active session.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  <strong>No application submission:</strong> Does not collect Aadhaar numbers or submit forms to government portals.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Database className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  <strong>Data attribution:</strong> Uses{" "}
                  <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                    gov_myscheme_data.csv
                  </code>{" "}
                  (2,066 schemes) from Aryan-Pardeshi/gov-myscheme-dataset, sourced from{" "}
                  <a
                    href="https://www.myscheme.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#132F5B] underline"
                  >
                    myscheme.gov.in
                  </a>
                  .
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. Related Work Comparison Table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-extrabold text-[#0F2749]">
            {language === "hi"
              ? "अन्य परियोजनाओं से तुलना (Related Work)"
              : "Related Work & Where EligiBharat Fits"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            EligiBharat is positioned as an open, fully local pipeline that extracts eligibility rules with small LLMs, checks them deterministically, and publishes a measured accuracy benchmark.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[#0F2749]">
                  <th className="py-3 px-4 font-bold">Project</th>
                  <th className="py-3 px-4 font-bold">What It Is</th>
                  <th className="py-3 px-4 font-bold">How EligiBharat Differs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-[#0F2749]">
                      {row.project}
                    </td>
                    <td className="py-3 px-4">{row.what}</td>
                    <td className="py-3 px-4 font-medium text-emerald-900">
                      {row.diff}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#132F5B] p-6 text-white shadow-md">
          <div>
            <h3 className="font-serif text-xl font-extrabold">
              {language === "hi"
                ? "अपनी पात्रता अभी जांचें"
                : "Ready to test the deterministic eligibility engine?"}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-200">
              Try our interactive citizen profile screener or read the full technical pipeline on the How It Works page.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              <span>How It Works</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2 text-xs font-bold text-[#0F2749] shadow-sm hover:bg-amber-400 transition"
            >
              <span>Check Eligibility Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
