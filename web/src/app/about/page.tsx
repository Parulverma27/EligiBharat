"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Lock,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Users,
  Target,
  BookOpen,
  Zap,
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
      accent: "from-blue-600 to-indigo-700",
      bgAccent: "bg-blue-50",
      borderAccent: "border-blue-200",
    },
    {
      icon: Scale,
      titleEn: "Extract Offline, Check Deterministically",
      titleHi: "ऑफ़लाइन नियम निष्कर्षण, पारदर्शी जांच",
      descEn:
        "A small LLM converts unstructured scheme eligibility text into structured JSON rules once, offline. At runtime, a pure Python/TypeScript rule checker evaluates your profile — the LLM never makes the final yes/no decision.",
      descHi:
        "LLM केवल एक बार ऑफ़लाइन रूप से योजना के पाठ को JSON नियमों में बदलता है। पात्रता का अंतिम निर्णय हमेशा शुद्ध नियम इंजन द्वारा किया जाता है।",
      accent: "from-amber-500 to-orange-600",
      bgAccent: "bg-amber-50",
      borderAccent: "border-amber-200",
    },
    {
      icon: Award,
      titleEn: "Measured on a 90-Case Benchmark",
      titleHi: "90-केस बेंचमार्क पर प्रमाणित",
      descEn:
        "Tested across 30 central & state schemes and 18 independent citizen personas (60 dev / 30 held-out test cases). Checker v2 raised accuracy from 87.8% (m2-baseline) to 100.0% and cut false 'not_eligible' errors to zero.",
      descHi:
        "30 सरकारी योजनाओं और 18 नागरिक प्रोफ़ाइलों (90 परीक्षण केसेस) पर जांचा गया। Checker v2 ने सटीकता को 87.8% से बढ़ाकर 100.0% किया।",
      accent: "from-emerald-600 to-teal-700",
      bgAccent: "bg-emerald-50",
      borderAccent: "border-emerald-200",
    },
  ];

  const comparisons = [
    {
      project: "Jugalbandi (OpenNyAI, AI4Bharat)",
      what: "WhatsApp bot over 171 programmes using state-machine & cloud LLMs (repo now deprecated)",
      diff: "Depended on paid cloud LLM APIs; EligiBharat runs locally and focuses on deterministic eligibility reasoning.",
      icon: Users,
    },
    {
      project: "PM-KISAN AI Chatbot",
      what: "Multilingual chatbot for a single agricultural scheme",
      diff: "Covers one scheme only; EligiBharat screens across pensions, scholarships, farmers, and women/family schemes.",
      icon: Target,
    },
    {
      project: "Haqdarshak",
      what: "Established social enterprise with human field agents & researcher-mapped rules",
      diff: "Rules are authored manually by people; EligiBharat extracts rules automatically from text and measures extraction error.",
      icon: BookOpen,
    },
    {
      project: "AgriGov & IndicRAGSuite (2026)",
      what: "Multilingual farmer-scheme dataset and Indian-language RAG benchmark",
      diff: "Neither provides labeled person-scheme eligibility test cases with deterministic rule checking.",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F9]">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />

      {/* Hero Section with Parliament Photo Background */}
      <section className="relative overflow-hidden border-b border-slate-200">
        {/* Background Photo with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/user-parliament.jpg"
            alt="Parliament House, New Delhi"
            fill
            className="object-cover object-[center_47%] scale-[1.05] brightness-[0.35] saturate-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2749]/90 via-[#0F2749]/75 to-[#1E3A8A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2749]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-16 sm:py-20 lg:py-24">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {language === "hi"
                ? "परियोजना परिचय और मिशन"
                : "About the Project & Research Mission"}
            </span>
          </span>
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px] leading-[1.1]">
            {language === "hi"
              ? "EligiBharat: पारदर्शी सरकारी योजना पात्रता सहायक"
              : "Why We Built EligiBharat"}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {language === "hi"
              ? "नागरिक अक्सर तीन कारणों से कल्याणकारी योजनाओं से वंचित रह जाते हैं: उन्हें योजना के अस्तित्व का पता नहीं होता, वे यह नहीं समझ पाते कि वे पात्र हैं या नहीं, और आधिकारिक दस्तावेज़ लंबे तथा मुख्य रूप से अंग्रेजी में होते हैं।"
              : "Millions of citizens miss welfare benefits for three reasons: they do not know a scheme exists, they cannot tell whether they qualify, and official guidelines are long and mostly in English. EligiBharat bridges this gap with transparent, auditable rules."}
          </p>

          {/* Stats Row */}
          <div className="mt-8 flex flex-wrap gap-6 sm:gap-10">
            <div>
              <div className="text-3xl font-extrabold text-amber-400 sm:text-4xl">30</div>
              <div className="mt-1 text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "hi" ? "सत्यापित योजनाएं" : "Verified Schemes"}
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">100%</div>
              <div className="mt-1 text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "hi" ? "बेंचमार्क सटीकता" : "Benchmark Accuracy"}
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-300 sm:text-4xl">0</div>
              <div className="mt-1 text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "hi" ? "झूठे अपात्र निर्णय" : "False Rejections"}
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white sm:text-4xl">16 GB</div>
              <div className="mt-1 text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "hi" ? "लैपटॉप पर चलता है" : "Runs on Any Laptop"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1200px] flex-1 space-y-10 px-4 py-10 sm:px-6">
        {/* 1. Three Core Design Pillars */}
        <section>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#132F5B]/10 px-3.5 py-1 text-xs font-bold text-[#132F5B]">
              {language === "hi" ? "मूल सिद्धांत" : "Core Principles"}
            </span>
            <h2 className="mt-3 font-serif text-2xl font-extrabold text-[#0F2749] sm:text-3xl">
              {language === "hi"
                ? "तीन मुख्य डिज़ाइन सिद्धांत"
                : "Three Core Design Choices"}
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className={`group relative rounded-2xl border ${p.borderAccent} ${p.bgAccent} p-6 shadow-sm transition hover:shadow-md`}
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.accent} text-white shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-extrabold text-[#0F2749]">
                    {language === "hi" ? p.titleHi : p.titleEn}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {language === "hi" ? p.descHi : p.descEn}
                  </p>
                  {/* Decorative step number */}
                  <span className="absolute top-4 right-5 font-serif text-5xl font-black text-slate-900/[0.04]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Goals vs Non-Goals (Safety & Ethics) */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-extrabold text-[#0F2749]">
                {language === "hi" ? "परियोजना के लक्ष्य (Goals)" : "Project Goals"}
              </h2>
            </div>
            <ul className="mt-5 space-y-3.5 text-sm text-slate-700">
              {[
                language === "hi"
                  ? "अंग्रेजी और हिन्दी दोनों में केंद्र और राज्य कल्याण योजनाओं की संवादात्मक पात्रता जांच।"
                  : <>Conversational eligibility screening in <strong>English and Hindi</strong> across central and state welfare schemes.</>,
                language === "hi"
                  ? "हर उत्तर में योजना का नाम, पास/फेल नियम दिखाता है और सीधे myscheme.gov.in पेज से लिंक करता है।"
                  : <>Every answer names the exact scheme, shows passed/failed/missing rules, and links directly to its official <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">myscheme.gov.in</code> page.</>,
                language === "hi"
                  ? "जब भी अनजांची शर्तें बची हों तो 'संभावित पात्र' स्थिति — क्योंकि पात्र नागरिक को मना करना सबसे बड़ी गलती है।"
                  : <>Asymmetric safety with a <strong>Possibly Eligible</strong> status whenever unchecked caveats remain — because turning away an eligible citizen is the worst error.</>,
                language === "hi"
                  ? "95% Wilson कॉन्फिडेंस इंटरवल के साथ प्रकाशित, ब्लाइंड-लेबल बेंचमार्क।"
                  : "A published, blind-labeled benchmark with 95% Wilson confidence intervals.",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-600 text-white" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-[#FFF8EB] p-7 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-extrabold text-[#0F2749]">
                {language === "hi"
                  ? "गैर-लक्ष्य और सीमाएं (Non-Goals & Ethics)"
                  : "Non-Goals & Ethical Guardrails"}
              </h2>
            </div>
            <ul className="mt-5 space-y-3.5 text-sm text-slate-800">
              {[
                { text: language === "hi" ? "यह आधिकारिक सरकारी पोर्टल नहीं है: कोई कानूनी सलाह नहीं देता और कभी सरकारी सेवा का रूप नहीं लेता।" : <><strong>Not an official government portal:</strong> Gives no legal advice and never imitates an official government service.</> },
                { text: language === "hi" ? "शून्य व्यक्तिगत डेटा भंडारण: कोई उपयोगकर्ता खाता नहीं और कोई डेटाबेस ट्रैकिंग नहीं। आपकी प्रोफ़ाइल केवल आपके सक्रिय सत्र में रहती है।" : <><strong>Zero personal data storage:</strong> No user accounts and no database tracking. Your profile lives only in your active session.</> },
                { text: language === "hi" ? "कोई आवेदन जमा नहीं: आधार नंबर एकत्र नहीं करता या सरकारी पोर्टल पर फॉर्म जमा नहीं करता।" : <><strong>No application submission:</strong> Does not collect Aadhaar numbers or submit forms to government portals.</> },
                { text: language === "hi" ? <>डेटा स्रोत: Aryan-Pardeshi/gov-myscheme-dataset से <code className="rounded bg-white px-1.5 py-0.5 text-xs">gov_myscheme_data.csv</code> (2,066 योजनाएं), <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold text-[#132F5B] underline">myscheme.gov.in</a> से प्राप्त।</> : <><strong>Data attribution:</strong> Uses <code className="rounded bg-white px-1.5 py-0.5 text-xs">gov_myscheme_data.csv</code> (2,066 schemes) from Aryan-Pardeshi/gov-myscheme-dataset, sourced from <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold text-[#132F5B] underline">myscheme.gov.in</a>.</> },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Related Work — Visual Cards Instead of Table */}
        <section>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#132F5B]/10 px-3.5 py-1 text-xs font-bold text-[#132F5B]">
              {language === "hi" ? "तुलनात्मक विश्लेषण" : "Competitive Landscape"}
            </span>
            <h2 className="mt-3 font-serif text-2xl font-extrabold text-[#0F2749] sm:text-3xl">
              {language === "hi"
                ? "अन्य परियोजनाओं से तुलना"
                : "Related Work & Where EligiBharat Fits"}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
              EligiBharat is positioned as an open, fully local pipeline that extracts eligibility rules with small LLMs, checks them deterministically, and publishes a measured accuracy benchmark.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {comparisons.map((row, idx) => {
              const Icon = row.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#132F5B] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-base font-extrabold text-[#0F2749]">
                      {row.project}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    {row.what}
                  </p>
                  <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                    <p className="text-xs font-medium leading-relaxed text-emerald-900">
                      <span className="font-bold">EligiBharat differs:</span>{" "}
                      {row.diff}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F2749] via-[#132F5B] to-[#1E3A8A] p-8 text-white shadow-lg sm:p-10">
          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/10" />
          <div className="pointer-events-none absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-blue-400/10" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
            <div>
              <h3 className="font-serif text-2xl font-extrabold sm:text-3xl">
                {language === "hi"
                  ? "अपनी पात्रता अभी जांचें"
                  : "Ready to test the deterministic eligibility engine?"}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Try our interactive citizen profile screener or read the full technical pipeline on the How It Works page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/20 transition backdrop-blur-sm"
              >
                <span>How It Works</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-[#0F2749] shadow-md hover:bg-amber-400 transition"
              >
                <span>Check Eligibility Now</span>
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
