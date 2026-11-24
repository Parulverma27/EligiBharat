"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircleMore,
  Search,
  Shield,
  Cpu,
  Scale,
  BookOpen,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SCHEMES_DATA } from "@/lib/schemesData";
import type { Language } from "@/types/scheme";

interface FaqItem {
  category: "general" | "eligibility" | "privacy" | "technical";
  qEn: string;
  qHi: string;
  aEn: string;
  aHi: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: "general",
    qEn: "Is EligiBharat an official Government of India website?",
    qHi: "क्या EligiBharat भारत सरकार की आधिकारिक वेबसाइट है?",
    aEn: "No. EligiBharat is an open-source academic and student research project. It is NOT affiliated with any government ministry or portal. While every scheme links directly to its official myscheme.gov.in page, you must always verify final guidelines on the official government portal before applying.",
    aHi: "नहीं। EligiBharat एक ओपन-सोर्स छात्र अनुसंधान परियोजना है। यह किसी भी सरकारी मंत्रालय से संबद्ध नहीं है। आवेदन करने से पहले हमेशा आधिकारिक पोर्टल myscheme.gov.in पर विवरण सत्यापित करें।",
  },
  {
    category: "eligibility",
    qEn: "Does the AI (LLM) decide whether I am eligible or not?",
    qHi: "क्या AI (LLM) तय करता है कि मैं पात्र हूँ या नहीं?",
    aEn: "No — and that is our core safety rule. The small LLM (qwen2.5:3b) is only used once offline to extract structured JSON rules from scheme text, and online to parse your conversational message. The actual yes/no eligibility check is executed by a 100% deterministic Python/TypeScript rule engine (checker.py).",
    aHi: "नहीं — यह हमारा मुख्य सुरक्षा नियम है। LLM का उपयोग केवल भाषा समझने के लिए किया जाता है। पात्रता की वास्तविक जांच 100% पारदर्शी नियम इंजन (checker.py) द्वारा की जाती है।",
  },
  {
    category: "eligibility",
    qEn: "What is the difference between 'Eligible' and 'Possibly Eligible'?",
    qHi: "'पात्र (Eligible)' और 'संभावित पात्र (Possibly Eligible)' में क्या अंतर है?",
    aEn: "'Eligible' means every stated demographic rule (age, income, gender, state, category, occupation, disability, BPL) passed AND there are zero remaining free-text conditions. 'Possibly Eligible' means all your demographic rules passed, but the scheme has extra conditions or exclusions (such as owning a specific bank account, land ceiling, or not receiving another scholarship) that you should verify in the 'View Details' caveats list.",
    aHi: "'पात्र (Eligible)' का अर्थ है कि आपकी सभी मुख्य शर्तें पूरी होती हैं और कोई अतिरिक्त शर्त शेष नहीं है। 'संभावित पात्र' का अर्थ है कि मुख्य नियम पूरे हैं, लेकिन कुछ अतिरिक्त शर्तें (caveats) पोर्टल पर जांचनी आवश्यक हैं।",
  },
  {
    category: "eligibility",
    qEn: "Why does a scheme say 'Need More Info' instead of 'Eligible'?",
    qHi: "किसी योजना में 'जानकारी अधूरी (Need More Info)' क्यों लिखा आता है?",
    aEn: "In EligiBharat, 'Unknown' never means 'no restriction'. If a scheme requires an annual income check or state residency check and you haven't entered your income or state yet, the checker marks it as 'Need More Info' and our Chat Assistant asks you a single follow-up question for the missing fact.",
    aHi: "EligiBharat में अज्ञात जानकारी का अर्थ 'कोई प्रतिबंध नहीं' कभी नहीं होता। यदि किसी योजना के लिए आय या राज्य की जानकारी आवश्यक है जो आपने अभी नहीं दी है, तो सिस्टम आपसे वह प्रश्न पूछता है।",
  },
  {
    category: "privacy",
    qEn: "Is my personal or income data stored on any server?",
    qHi: "क्या मेरी व्यक्तिगत या आय संबंधी जानकारी किसी सर्वर पर संग्रहीत की जाती है?",
    aEn: "No. EligiBharat requires no login, creates no user accounts, and stores zero personal profiles in any database. Your citizen profile exists only in your current browser session and is cleared the moment you click Reset or close the tab.",
    aHi: "नहीं। EligiBharat में किसी लॉगिन या खाते की आवश्यकता नहीं है और आपका कोई भी डेटा किसी डेटाबेस में सेव नहीं किया जाता। आपकी प्रोफ़ाइल केवल आपके वर्तमान ब्राउज़र सत्र तक ही सीमित रहती है।",
  },
  {
    category: "technical",
    qEn: "Which schemes are currently covered in the verified benchmark?",
    qHi: "वर्तमान में सत्यापित बेंचमार्क में कौन-कौन सी योजनाएं शामिल हैं?",
    aEn: "The verified v2 benchmark covers 30 major central and state schemes across 4 categories: 10 Pension schemes (APY, IGNDPS, IGNWPS, NPS-TSEP, CMENSPY, MVSPY, DPSWDWP, OAP, OAPSP, KPY), 10 Scholarships (PMSFSS, Pre-Matric SC/ST/Minority, MCM-Min, CBSE Single Girl Child, Pragati, UP General/OBC, Post-Matric Disability), 7 Farmer schemes (PM-KISAN, PMFBY, KCC, RGKNY, CMKRY, Gujarat AGR-3/AGR-4), and 3 Women & Family schemes (Sukanya Samriddhi, PMMVY, Ujjwala). ChromaDB also indexes 128 schemes (1,316 chunks) from the 2,066-scheme dataset.",
    aHi: "सत्यापित v2 बेंचमार्क में 4 श्रेणियों की 30 प्रमुख केंद्र और राज्य योजनाएं शामिल हैं: 10 पेंशन योजनाएं, 10 छात्रवृत्ति योजनाएं, 7 किसान योजनाएं, और 3 महिला एवं परिवार योजनाएं (उज्ज्वला, सुकन्या समृद्धि, मातृ वंदना)।",
  },
  {
    category: "technical",
    qEn: "Can I run EligiBharat completely offline on my own laptop?",
    qHi: "क्या मैं EligiBharat को अपने लैपटॉप पर पूरी तरह से ऑफ़लाइन चला सकता हूँ?",
    aEn: "Yes! By installing Ollama (with qwen2.5:3b and bge-m3) and cloning our public GitHub repository, the entire RAG pipeline, rule extractor, deterministic checker, FastAPI backend, and Next.js frontend run 100% offline on a 16 GB CPU laptop at zero cost.",
    aHi: "हाँ! Ollama (qwen2.5:3b और bge-m3) और हमारे GitHub रिपॉजिटरी की मदद से आप इसे बिना इंटरनेट या API कुंजी के अपने 16 GB RAM लैपटॉप पर पूरी तरह ऑफ़लाइन चला सकते हैं।",
  },
];

const CATEGORIES = [
  { id: "all" as const, en: "All Questions", hi: "सभी प्रश्न", icon: BookOpen },
  { id: "general" as const, en: "General", hi: "सामान्य", icon: HelpCircle },
  { id: "eligibility" as const, en: "Eligibility Logic", hi: "पात्रता नियम", icon: Scale },
  { id: "privacy" as const, en: "Privacy & Safety", hi: "गोपनीयता", icon: Shield },
  { id: "technical" as const, en: "Technical & Schemes", hi: "तकनीकी", icon: Cpu },
];

export default function FaqPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCat, setActiveCat] = useState<
    "all" | "general" | "eligibility" | "privacy" | "technical"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = FAQ_ITEMS.filter((item) => {
    const catMatch = activeCat === "all" || item.category === activeCat;
    if (!searchQuery.trim()) return catMatch;
    const q = searchQuery.toLowerCase();
    return (
      catMatch &&
      (item.qEn.toLowerCase().includes(q) ||
        item.aEn.toLowerCase().includes(q) ||
        item.qHi.includes(searchQuery) ||
        item.aHi.includes(searchQuery))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F9]">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0">
          <Image
            src="/images/user-parliament.jpg"
            alt="Parliament House, New Delhi"
            fill
            className="object-cover object-[center_47%] scale-[1.05] brightness-[0.3] saturate-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2749]/95 via-[#132F5B]/85 to-[#1E3A8A]/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1000px] px-4 py-16 sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <HelpCircle className="h-4 w-4" />
            <span>
              {language === "hi"
                ? "अक्सर पूछे जाने वाले प्रश्न"
                : "Frequently Asked Questions"}
            </span>
          </span>
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.1]">
            {language === "hi"
              ? "आपके प्रश्नों के स्पष्ट उत्तर"
              : "Frequently Asked Questions"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {language === "hi"
              ? "EligiBharat की पात्रता जांच, डेटा गोपनीयता और स्थानीय AI मॉडल के बारे में सामान्य प्रश्न।"
              : "Everything you need to know about how EligiBharat checks scheme eligibility, protects your privacy, and runs locally."}
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-lg">
            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm focus-within:border-amber-400/60 focus-within:bg-white/15 transition">
              <Search className="h-4 w-4 text-slate-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenIndex(0);
                }}
                placeholder={
                  language === "hi"
                    ? "प्रश्न खोजें..."
                    : "Search questions..."
                }
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1000px] flex-1 space-y-6 px-4 py-8 sm:px-6">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === "all"
                ? FAQ_ITEMS.length
                : FAQ_ITEMS.filter((i) => i.category === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveCat(tab.id);
                  setOpenIndex(0);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold shadow-sm transition ${
                  activeCat === tab.id
                    ? "bg-[#132F5B] text-white shadow-md"
                    : "border border-slate-200 bg-white text-[#0F2749] hover:bg-slate-50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{language === "hi" ? tab.hi : tab.en}</span>
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeCat === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Search className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">
                {language === "hi"
                  ? "कोई प्रश्न नहीं मिला।"
                  : "No questions match your search."}
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isOpen = openIndex === idx;
              const catConfig = CATEGORIES.find(
                (c) => c.id === item.category
              );
              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                    isOpen
                      ? "border-[#132F5B]/30 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {catConfig && (
                        <span
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            isOpen
                              ? "bg-[#132F5B] text-white"
                              : "bg-slate-100 text-slate-500"
                          } transition`}
                        >
                          <catConfig.icon className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <span className="font-serif text-base font-extrabold text-[#0F2749] sm:text-lg">
                        {language === "hi" ? item.qHi : item.qEn}
                      </span>
                    </div>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "bg-[#132F5B] text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50 to-white px-6 py-5">
                      <p className="text-sm leading-relaxed text-slate-700">
                        {language === "hi" ? item.aHi : item.aEn}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-amber-200 bg-gradient-to-r from-[#FFF8EB] to-[#FEF3CD] p-7 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#132F5B] text-white shadow-md">
              <MessageCircleMore className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-extrabold text-[#0F2749] sm:text-xl">
                {language === "hi"
                  ? "कोई अन्य प्रश्न है या नियम में त्रुटि मिली?"
                  : "Still have a question or spotted an extraction bug?"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {language === "hi"
                  ? "संपर्क पृष्ठ के माध्यम से हमें बताएं या सीधे पात्रता जांचें।"
                  : "Reach out on our Contact page or test your profile on the Home screen."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#132F5B] bg-white px-5 py-2.5 text-sm font-bold text-[#132F5B] hover:bg-slate-50 transition shadow-sm"
            >
              <span>{language === "hi" ? "संपर्क करें" : "Contact Us"}</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#132F5B] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#0F2749] transition"
            >
              <span>
                {language === "hi" ? "पात्रता जांचें" : "Check Eligibility"}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
