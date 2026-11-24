"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  ArrowDown,
  Zap,
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
      accent: "from-blue-600 to-indigo-700",
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
      accent: "from-violet-600 to-purple-700",
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
      accent: "from-emerald-600 to-teal-700",
    },
  ];

  const onlineNodes = [
    {
      num: "1",
      name: "detect_language",
      desc: "Detects English ('en') or Hindi Devanagari ('hi') from the citizen's message.",
      color: "bg-blue-600",
    },
    {
      num: "2",
      name: "extract_profile",
      desc: "Extracts age, gender, state, annual income, social category, occupation, BPL, and disability into UserProfile.",
      color: "bg-indigo-600",
    },
    {
      num: "3",
      name: "retrieve_candidates",
      desc: "Filters candidate schemes deterministically by state scope (Central + user's state) and topic keywords.",
      color: "bg-violet-600",
    },
    {
      num: "4",
      name: "run_checker",
      desc: "Evaluates every rule without any LLM call — returning eligible, possibly_eligible, need_more_info, or not_eligible.",
      color: "bg-emerald-700",
    },
    {
      num: "5",
      name: "choose_question",
      desc: "Selects the single missing profile field that unblocks the highest number of candidate schemes.",
      color: "bg-amber-600",
    },
    {
      num: "6",
      name: "explain",
      desc: "Formats a cited explanation in English or Hindi strictly from checker output and official chunks.",
      color: "bg-orange-600",
    },
    {
      num: "7",
      name: "safety_guard",
      desc: "Rejects any draft that contradicts the checker's decision, invents ungrounded numbers, or omits the official myscheme.gov.in URL and disclaimer.",
      color: "bg-rose-700",
    },
  ];

  const outcomes = [
    {
      icon: CheckCircle2,
      label: "Eligible",
      labelHi: "पात्र",
      desc: "Every stated demographic rule passes and there are zero remaining free-text caveats.",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-950",
      iconClass: "fill-emerald-700 text-white",
      accentBar: "bg-emerald-600",
    },
    {
      icon: AlertCircle,
      label: "Possibly Eligible",
      labelHi: "संभावित पात्र",
      desc: "All checkable rules pass, AND unchecked caveats remain (e.g. bank account or crop type) for you to verify on the portal.",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-950",
      iconClass: "fill-amber-500 text-white",
      accentBar: "bg-amber-500",
    },
    {
      icon: HelpCircle,
      label: "Need More Info",
      labelHi: "जानकारी अधूरी",
      desc: "No stated rule has failed, but one or more required facts about you are still unknown.",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-950",
      iconClass: "fill-blue-600 text-white",
      accentBar: "bg-blue-600",
    },
    {
      icon: XCircle,
      label: "Not Eligible",
      labelHi: "अपात्र",
      desc: "At least one stated rule or checkable exclusion definitely fails (this takes priority over missing facts).",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      textColor: "text-rose-950",
      iconClass: "fill-rose-600 text-white",
      accentBar: "bg-rose-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F9]">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />

      {/* Hero Section with Photo Background */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0">
          <Image
            src="/images/user-parliament.jpg"
            alt="Parliament House, New Delhi"
            fill
            className="object-cover object-[center_47%] scale-[1.05] brightness-[0.3] saturate-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2749]/95 via-[#132F5B]/80 to-[#1E3A8A]/65" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-16 sm:py-20 lg:py-24">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Compass className="h-4 w-4" />
            <span>
              {language === "hi"
                ? "सिस्टम आर्किटेक्चर और पाइपलाइन"
                : "System Architecture & Deterministic Pipeline"}
            </span>
          </span>
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px] leading-[1.1]">
            {language === "hi"
              ? "EligiBharat कैसे काम करता है?"
              : "How EligiBharat Works Under the Hood"}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {language === "hi"
              ? "भाषा समझने का काम LLM करता है, लेकिन पात्रता का निर्णय हमेशा शुद्ध नियम इंजन (Python / TypeScript) करता है।"
              : "The LLM handles language. Deterministic code handles decisions. Here is the two-stage offline extraction and online 7-node conversational architecture."}
          </p>

          {/* Architecture Summary */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Stage 1</div>
              <div className="mt-1 text-sm font-bold text-white">Offline Extraction</div>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 text-amber-400" />
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Stage 2</div>
              <div className="mt-1 text-sm font-bold text-white">Online 7-Node Agent</div>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 text-amber-400" />
            </div>
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/15 px-5 py-3 backdrop-blur-sm">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Result</div>
              <div className="mt-1 text-sm font-bold text-white">Deterministic Eligibility</div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1200px] flex-1 space-y-10 px-4 py-10 sm:px-6">
        {/* 1. Stage 1: Offline Pipeline */}
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#132F5B] text-white">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage 1</span>
              <h2 className="font-serif text-2xl font-extrabold text-[#0F2749] sm:text-3xl">
                {language === "hi"
                  ? "ऑफ़लाइन डेटा और नियम निष्कर्षण (Run Once)"
                  : "Offline Indexing & Rule Extraction"}
              </h2>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {offlineSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Accent Top Bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${s.accent}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} text-white shadow-md`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-serif text-4xl font-black text-slate-900/[0.06]">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-extrabold text-[#0F2749]">
                      {language === "hi" ? s.titleHi : s.titleEn}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {language === "hi" ? s.descHi : s.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrow Connector */}
          <div className="flex justify-center py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#132F5B] text-white shadow-md">
              <ArrowDown className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* 2. Stage 2: Online 7-Node Conversational Agent */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-[#0F2749] to-[#1E3A8A] p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Stage 2</span>
                <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">
                  {language === "hi"
                    ? "ऑनलाइन 7-नोड संवादात्मक एजेंट"
                    : "Online 7-Node Conversational Agent"}
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-200">
              Every citizen message passes through 7 deterministic and schema-constrained nodes:
            </p>
          </div>

          {/* Node Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {onlineNodes.map((node) => (
                <div
                  key={node.num}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-slate-300"
                >
                  {/* Color indicator bar */}
                  <div className={`h-1 ${node.color}`} />
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${node.color} text-xs font-bold text-white shadow-sm`}>
                        {node.num}
                      </span>
                      <code className="text-xs font-extrabold text-[#0F2749]">
                        {node.name}
                      </code>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                      {node.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Insight Callout */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <p className="text-sm text-emerald-900">
                <strong>Key Insight:</strong> Node 4 (<code className="rounded bg-emerald-100 px-1 text-xs">run_checker</code>) is the{" "}
                <strong>only node that determines eligibility</strong> — it uses pure Python/TypeScript code with zero LLM involvement. The LLM is used only for language understanding (nodes 1-2) and response formatting (node 6).
              </p>
            </div>
          </div>
        </section>

        {/* 3. Four Eligibility Statuses Explained */}
        <section>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-800">
              <Scale className="h-3.5 w-3.5" />
              {language === "hi" ? "निर्णय प्रणाली" : "Decision Framework"}
            </span>
            <h2 className="mt-3 font-serif text-2xl font-extrabold text-[#0F2749] sm:text-3xl">
              {language === "hi"
                ? "चार पात्रता स्थितियां"
                : "Understanding the 4 Eligibility Outcomes"}
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((o) => {
              const Icon = o.icon;
              return (
                <div
                  key={o.label}
                  className={`relative overflow-hidden rounded-2xl border ${o.borderColor} ${o.bgColor} shadow-sm`}
                >
                  <div className={`h-1.5 ${o.accentBar}`} />
                  <div className="p-5">
                    <div className={`flex items-center gap-2 font-extrabold ${o.textColor}`}>
                      <Icon className={`h-5 w-5 ${o.iconClass}`} />
                      <span>
                        {o.label}{" "}
                        <span className="font-normal text-xs opacity-70">
                          ({o.labelHi})
                        </span>
                      </span>
                    </div>
                    <p className={`mt-3 text-xs leading-relaxed ${o.textColor} opacity-85`}>
                      {o.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Benchmark Table (v1 vs v2) */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation</span>
                <h2 className="font-serif text-2xl font-extrabold text-[#0F2749]">
                  {language === "hi"
                    ? "बेंचमार्क मूल्यांकन परिणाम"
                    : "Measured Evaluation Results"}
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {language === "hi"
                ? "90 लेबल किए गए केसेस (60 dev + 30 test) पर m2-baseline (v1) बनाम v2-final की तुलना"
                : "Comparing m2-baseline (v1) vs v2-final across 90 labeled cases (60 dev + 30 held-out test)"}
            </p>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[#0F2749]">
                  <th className="py-3 px-4 font-bold">Version</th>
                  <th className="py-3 px-4 font-bold">Split</th>
                  <th className="py-3 px-4 font-bold">Accuracy</th>
                  <th className="py-3 px-4 font-bold">95% Wilson CI</th>
                  <th className="py-3 px-4 font-bold">False &lsquo;not_eligible&rsquo;</th>
                  <th className="py-3 px-4 font-bold">False &lsquo;eligible&rsquo;</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold">m2-baseline (v1)</td>
                  <td className="py-3.5 px-4">Dev (60 cases)</td>
                  <td className="py-3.5 px-4">83.3% (50/60)</td>
                  <td className="py-3.5 px-4 text-slate-500">[72.0%, 90.7%]</td>
                  <td className="py-3.5 px-4 text-rose-700 font-bold">3</td>
                  <td className="py-3.5 px-4">7 (all with caveats)</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold">m2-baseline (v1)</td>
                  <td className="py-3.5 px-4">Test (30 cases)</td>
                  <td className="py-3.5 px-4">96.7% (29/30)</td>
                  <td className="py-3.5 px-4 text-slate-500">[83.3%, 99.4%]</td>
                  <td className="py-3.5 px-4 text-rose-700 font-bold">1</td>
                  <td className="py-3.5 px-4">0</td>
                </tr>
                <tr className="bg-emerald-50/70 font-semibold text-emerald-950">
                  <td className="py-3.5 px-4 font-extrabold">v2-final (v2)</td>
                  <td className="py-3.5 px-4">All (90 cases)</td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">100.0%</span>
                  </td>
                  <td className="py-3.5 px-4">[95.9%, 100.0%]</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-extrabold">0 (0.0%)</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-extrabold">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F2749] via-[#132F5B] to-[#1E3A8A] p-8 text-white shadow-lg sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/10" />
          <div className="pointer-events-none absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-blue-400/10" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
            <div>
              <h3 className="font-serif text-2xl font-extrabold sm:text-3xl">
                Have questions about scheme rules or privacy?
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Read our Frequently Asked Questions or jump straight to the interactive eligibility screener.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/20 transition backdrop-blur-sm"
              >
                <span>Read FAQ</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-[#0F2749] shadow-md hover:bg-amber-400 transition"
              >
                <span>Open Eligibility Screener</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
