"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircleMore,
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

export default function FaqPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCat, setActiveCat] = useState<
    "all" | "general" | "eligibility" | "privacy" | "technical"
  >("all");

  const filtered = FAQ_ITEMS.filter(
    (item) => activeCat === "all" || item.category === activeCat
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F9]">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />

      {/* Page Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-r from-[#0F2749] via-[#132F5B] to-[#1E3A8A] text-white py-10 px-4">
        <div className="mx-auto max-w-[1000px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <HelpCircle className="h-4 w-4" />
            <span>
              {language === "hi"
                ? "अक्सर पूछे जाने वाले प्रश्न (FAQ)"
                : "Frequently Asked Questions"}
            </span>
          </span>
          <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl">
            {language === "hi"
              ? "आपके प्रश्नों के स्पष्ट उत्तर"
              : "Frequently Asked Questions"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            {language === "hi"
              ? "EligiBharat की पात्रता जांच, डेटा गोपनीयता और स्थानीय AI मॉडल के बारे में सामान्य प्रश्न।"
              : "Everything you need to know about how EligiBharat checks scheme eligibility, protects your privacy, and runs locally."}
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1000px] flex-1 space-y-6 px-4 py-8 sm:px-6">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", en: "All Questions (7)", hi: "सभी प्रश्न (7)" },
              { id: "general", en: "General", hi: "सामान्य" },
              {
                id: "eligibility",
                en: "Eligibility Logic",
                hi: "पात्रता नियम",
              },
              { id: "privacy", en: "Privacy & Safety", hi: "गोपनीयता और सुरक्षा" },
              {
                id: "technical",
                en: "Technical & Schemes",
                hi: "तकनीकी और योजनाएं",
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveCat(tab.id);
                setOpenIndex(0);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-bold shadow-sm transition ${
                activeCat === tab.id
                  ? "bg-[#132F5B] text-white"
                  : "border border-slate-200 bg-white text-[#0F2749] hover:bg-slate-50"
              }`}
            >
              {language === "hi" ? tab.hi : tab.en}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-serif text-base font-extrabold text-[#0F2749] sm:text-lg">
                    {language === "hi" ? item.qHi : item.qEn}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-[#132F5B]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
                    {language === "hi" ? item.aHi : item.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-[#FFF8EB] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#132F5B] text-white">
              <MessageCircleMore className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-extrabold text-[#0F2749]">
                {language === "hi"
                  ? "कोई अन्य प्रश्न है या नियम में त्रुटि मिली?"
                  : "Still have a question or spotted an extraction bug?"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === "hi"
                  ? "संपर्क पृष्ठ के माध्यम से हमें बताएं या सीधे पात्रता जांचें।"
                  : "Reach out on our Contact page or test your profile on the Home screen."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#132F5B] bg-white px-4 py-2 text-xs font-bold text-[#132F5B] hover:bg-slate-50 transition"
            >
              <span>{language === "hi" ? "संपर्क करें" : "Contact Us"}</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#132F5B] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0F2749] transition"
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
