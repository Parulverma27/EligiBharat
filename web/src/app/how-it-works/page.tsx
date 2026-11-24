"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Compass,
  Cpu,
  Database,
  FileJson,
  HelpCircle,
  Layers,
  Scale,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SCHEMES_DATA } from "@/lib/schemesData";
import type { Language } from "@/types/scheme";

export default function HowItWorksPage() {
  const [language, setLanguage] = useState<Language>("en");

  const offlineSteps = [
    {
      step: "01",
      icon: Database,
      titleEn: "Dataset Ingestion & Chunking",
      titleHi: "डेटासेट संग्रहण और चंकिंग",
      descEn:
        "2,066 government schemes from gov_myscheme_data.csv are cleaned and split into ~1,000-character chunks (150-char overlap) preserving paragraph boundaries and prepending scheme/state/section headers.",
      descHi:
        "2,066 सरकारी योजनाओं को ~1,000 अक्षरों के खंडों में विभाजित किया जाता है और प्रत्येक खंड में योजना व राज्य का नाम जोड़ा जाता है।",
    },
    {
      step: "02",
      icon: Layers,
      titleEn: "Multilingual Embedding (bge-m3 -> ChromaDB)",
      titleHi: "बहुभाषी एम्बेडिंग (bge-m3 -> ChromaDB)",
      descEn:
        "Chunks are embedded locally using BAAI/bge-m3 through Ollama and indexed in ChromaDB with cosine distance (provisional cutoff 0.55 to drop off-topic queries).",
      descHi:
        "Ollama के माध्यम से bge-m3 मॉडल का उपयोग करके हिंदी और अंग्रेजी खोज के लिए ChromaDB में इंडेक्स किया जाता है।",
    },
    {
      step: "03",
      icon: FileJson,
      titleEn: "Structured LLM Rule Extraction + v2 Validator",
      titleHi: "संरचित JSON नियम निष्कर्षण + v2 सत्यापन",
      descEn:
        "qwen2.5:3b extracts eligibility criteria into a strict Pydantic SchemeRules JSON schema (temperature 0), followed by a deterministic v2 validator that repairs numeric lakh conversions, girl/women gender rules, and student requirements.",
      descHi:
        "qwen2.5:3b मॉडल पात्रता शर्तों को JSON नियमों में बदलता है और v2 सत्यापनकर्ता संख्याओं व लिंग नियमों की जांच करता है।",
    },
  ];

  const onlineNodes = [
    {
      num: "1",
      name: "detect_language",
      desc: "Detects English ('en') or Hindi Devanagari ('hi') from the citizen's message.",
    },
    {
      num: "2",
      name: "extract_profile",
      desc: "Extracts age, gender, state, annual income, social category, occupation, BPL, and disability into UserProfile.",
    },
    {
      num: "3",
      name: "retrieve_candidates",
      desc: "Filters candidate schemes deterministically by state scope (Central + user's state) and topic keywords.",
    },
    {
      num: "4",
      name: "run_checker (Pure Python / TS)",
      desc: "Evaluates every rule without any LLM call — returning eligible, possibly_eligible, need_more_info, or not_eligible.",
    },
    {
      num: "5",
      name: "choose_question",
      desc: "Selects the single missing profile field that unblocks the highest number of candidate schemes.",
    },
    {
      num: "6",
      name: "explain",
      desc: "Formats a cited explanation in English or Hindi strictly from checker output and official chunks.",
    },
    {
      num: "7",
      name: "safety_guard",
      desc: "Rejects any draft that contradicts the checker's decision, invents ungrounded numbers, or omits the official myscheme.gov.in URL and disclaimer.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F9]">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />

      {/* Page Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-r from-[#0F2749] via-[#132F5B] to-[#1E3A8A] text-white py-10 px-4">
        <div className="mx-auto max-w-[1200px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Compass className="h-4 w-4" />
            <span>
              {language === "hi"
                ? "सिस्टम आर्किटेक्चर और पाइपलाइन"
                : "System Architecture & Deterministic Pipeline"}
            </span>
          </span>
          <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl">
            {language === "hi"
              ? "EligiBharat कैसे काम करता है?"
              : "How EligiBharat Works Under the Hood"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
            {language === "hi"
              ? "भाषा समझने का काम LLM करता है, लेकिन पात्रता का निर्णय हमेशा शुद्ध नियम इंजन (Python / TypeScript) करता है।"
              : "The LLM handles language. Deterministic code handles decisions. Here is the two-stage offline extraction and online 7-node conversational architecture."}
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1200px] flex-1 space-y-8 px-4 py-8 sm:px-6">
        {/* 1. Stage 1: Offline Pipeline */}
        <section>
          <div className="flex items-center gap-2.5">
            <Cpu className="h-6 w-6 text-[#132F5B]" />
            <h2 className="font-serif text-2xl font-extrabold text-[#0F2749]">
              {language === "hi"
                ? "चरण 1: ऑफ़लाइन डेटा और नियम निष्कर्षण (Run Once)"
                : "Stage 1: Offline Indexing & Rule Extraction (Run Once)"}
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {offlineSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#132F5B] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-serif text-2xl font-black text-slate-200">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mt-3.5 font-serif text-lg font-extrabold text-[#0F2749]">
                    {language === "hi" ? s.titleHi : s.titleEn}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {language === "hi" ? s.descHi : s.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Stage 2: Online 7-Node Conversational Agent */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Bot className="h-6 w-6 text-[#132F5B]" />
            <h2 className="font-serif text-2xl font-extrabold text-[#0F2749]">
              {language === "hi"
                ? "चरण 2: ऑनलाइन 7-नोड संवादात्मक एजेंट (Every Turn)"
                : "Stage 2: Online 7-Node Conversational Agent (Every Turn)"}
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Every citizen message passes through 7 deterministic and schema-constrained nodes:
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {onlineNodes.map((node) => (
              <div
                key={node.num}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#132F5B] text-xs font-bold text-white">
                    {node.num}
                  </span>
                  <code className="text-xs font-extrabold text-[#0F2749]">
                    {node.name}
                  </code>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Four Eligibility Statuses Explained */}
        <section className="rounded-2xl border border-amber-200 bg-[#FFF8EB] p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Scale className="h-6 w-6 text-amber-700" />
            <h2 className="font-serif text-2xl font-extrabold text-[#0F2749]">
              {language === "hi"
                ? "चार पात्रता स्थितियां (4 Deterministic Outcomes)"
                : "Understanding the 4 Eligibility Outcomes"}
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#B9E2C6] bg-[#E2F3E7] p-4">
              <div className="flex items-center gap-2 font-extrabold text-emerald-950">
                <CheckCircle2 className="h-5 w-5 fill-emerald-700 text-white" />
                <span>Eligible (पात्र)</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-emerald-950">
                Every stated demographic rule passes and there are zero remaining free-text caveats.
              </p>
            </div>

            <div className="rounded-xl border border-[#F7D48C] bg-[#FCECC9] p-4">
              <div className="flex items-center gap-2 font-extrabold text-amber-950">
                <AlertCircle className="h-5 w-5 fill-amber-500 text-white" />
                <span>Possibly Eligible</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-amber-950">
                All checkable rules pass, AND unchecked caveats remain (e.g. bank account or crop type) for you to verify on the portal.
              </p>
            </div>

            <div className="rounded-xl border border-[#B3D2F5] bg-[#DCEBFA] p-4">
              <div className="flex items-center gap-2 font-extrabold text-blue-950">
                <HelpCircle className="h-5 w-5 fill-blue-600 text-white" />
                <span>Need More Info</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-blue-950">
                No stated rule has failed, but one or more required facts about you are still unknown (&ldquo;Unknown means ask, never guess&rdquo;).
              </p>
            </div>

            <div className="rounded-xl border border-[#F4B8B1] bg-[#FADCD9] p-4">
              <div className="flex items-center gap-2 font-extrabold text-rose-950">
                <XCircle className="h-5 w-5 fill-rose-600 text-white" />
                <span>Not Eligible (अपात्र)</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-rose-950">
                At least one stated rule or checkable exclusion definitely fails (this takes priority over missing facts).
              </p>
            </div>
          </div>
        </section>

        {/* 4. Benchmark Table (v1 vs v2) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
            <h2 className="font-serif text-2xl font-extrabold text-[#0F2749]">
              {language === "hi"
                ? "बेंचमार्क मूल्यांकन परिणाम (90 Labeled Cases)"
                : "Measured Evaluation Results (m2-baseline v1 vs. v2-final)"}
            </h2>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[#0F2749]">
                  <th className="py-3 px-4 font-bold">Version</th>
                  <th className="py-3 px-4 font-bold">Split</th>
                  <th className="py-3 px-4 font-bold">Accuracy</th>
                  <th className="py-3 px-4 font-bold">95% Wilson CI</th>
                  <th className="py-3 px-4 font-bold">False &lsquo;not_eligible&rsquo; (FN)</th>
                  <th className="py-3 px-4 font-bold">False &lsquo;eligible&rsquo; (FP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-bold">m2-baseline (v1)</td>
                  <td className="py-3 px-4">Dev (60 cases)</td>
                  <td className="py-3 px-4">83.3% (50/60)</td>
                  <td className="py-3 px-4">[72.0%, 90.7%]</td>
                  <td className="py-3 px-4 text-rose-700 font-bold">3</td>
                  <td className="py-3 px-4">7 (all with caveats)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">m2-baseline (v1)</td>
                  <td className="py-3 px-4">Test (30 cases)</td>
                  <td className="py-3 px-4">96.7% (29/30)</td>
                  <td className="py-3 px-4">[83.3%, 99.4%]</td>
                  <td className="py-3 px-4 text-rose-700 font-bold">1</td>
                  <td className="py-3 px-4">0</td>
                </tr>
                <tr className="bg-emerald-50/70 font-semibold text-emerald-950">
                  <td className="py-3 px-4 font-bold">v2-final (v2)</td>
                  <td className="py-3 px-4">All (90 cases: 60 dev + 30 test)</td>
                  <td className="py-3 px-4 font-extrabold">100.0% (90/90)</td>
                  <td className="py-3 px-4">[95.9%, 100.0%]</td>
                  <td className="py-3 px-4 text-emerald-800 font-extrabold">0 (0.0%)</td>
                  <td className="py-3 px-4 text-emerald-800 font-extrabold">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#132F5B] p-6 text-white shadow-md">
          <div>
            <h3 className="font-serif text-xl font-extrabold">
              Have questions about scheme rules or privacy?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-200">
              Read our Frequently Asked Questions or jump straight to the interactive eligibility screener.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              <span>Read FAQ</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2 text-xs font-bold text-[#0F2749] shadow-sm hover:bg-amber-400 transition"
            >
              <span>Open Eligibility Screener</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
