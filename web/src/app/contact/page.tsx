"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bug,
  CheckCircle2,
  ExternalLink,
  FileCode2,
  Globe,
  Mail,
  Send,
  MessageSquare,
  Users,
  BookOpen,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SCHEMES_DATA } from "@/lib/schemesData";
import type { Language } from "@/types/scheme";

export default function ContactPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("rule_discrepancy");
  const [schemeSlug, setSchemeSlug] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  const sideCards = [
    {
      icon: FileCode2,
      iconBg: "bg-[#132F5B]",
      title: "GitHub Repository",
      subtitle: "Parulverma27/EligiBharat",
      desc: "Inspect the Python rule extractor, ChromaDB ingestion scripts, 90-case evaluation benchmark, and Next.js frontend source code.",
      linkText: "Open GitHub Repository",
      linkHref: "https://github.com/Parulverma27/EligiBharat",
      linkColor: "text-[#132F5B]",
      border: "border-slate-200",
      bg: "bg-white",
    },
    {
      icon: Bug,
      iconBg: "bg-amber-500",
      title: "Report Extraction Issues",
      subtitle: "Help expand our 90-case benchmark",
      desc: "If a small 3B LLM mis-extracted a numeric threshold or exclusion on a scheme, open an issue with the scheme slug and official source quote.",
      linkText: "File a GitHub Issue",
      linkHref: "https://github.com/Parulverma27/EligiBharat/issues",
      linkColor: "text-[#132F5B]",
      border: "border-amber-200",
      bg: "bg-[#FFF8EB]",
    },
    {
      icon: Globe,
      iconBg: "bg-emerald-700",
      title: "Official Government Portal",
      subtitle: "myscheme.gov.in",
      desc: "To apply for any welfare scheme or check official government notifications, always visit the National Platform for Government Schemes.",
      linkText: "Visit myscheme.gov.in",
      linkHref: "https://www.myscheme.gov.in",
      linkColor: "text-emerald-800",
      border: "border-emerald-200",
      bg: "bg-emerald-50",
    },
  ];

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

        <div className="relative z-10 mx-auto max-w-[1100px] px-4 py-16 sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Mail className="h-4 w-4" />
            <span>
              {language === "hi"
                ? "संपर्क और ओपन-सोर्स सहयोग"
                : "Contact, Feedback & Rule Bug Reports"}
            </span>
          </span>
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.1]">
            {language === "hi"
              ? "संपर्क करें या नियम त्रुटि रिपोर्ट करें"
              : "Get in Touch or Report a Scheme Rule Issue"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {language === "hi"
              ? "यदि आपको किसी योजना के निकाले गए नियमों में कोई अंतर मिलता है या आप इस ओपन-सोर्स परियोजना में योगदान देना चाहते हैं, तो हमें लिखें।"
              : "Spotted an outdated eligibility rule, want to contribute human annotations to our benchmark, or interested in running EligiBharat at your NGO or college? Send a note below."}
          </p>

          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <MessageSquare className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-bold text-white">
                {language === "hi" ? "फीडबैक फॉर्म" : "Feedback Form"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <Users className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-bold text-white">
                {language === "hi" ? "ओपन-सोर्स सहयोग" : "Open Source Collab"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-bold text-white">
                {language === "hi" ? "बेंचमार्क योगदान" : "Benchmark Contributions"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Feedback & Rule Discrepancy Form */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Form Header */}
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                <h2 className="font-serif text-xl font-extrabold text-[#0F2749]">
                  {language === "hi"
                    ? "फीडबैक या नियम सुधार फॉर्म"
                    : "Send Feedback or Report a Rule Discrepancy"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {language === "hi"
                    ? "आपका संदेश सीधे परियोजना रखरखाव टीम के लिए दर्ज किया जाएगा।"
                    : "Help us keep extracted scheme rules accurate against official myscheme.gov.in guidelines."}
                </p>
              </div>

              <div className="p-6">
                {submitted ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600">
                      <CheckCircle2 className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-extrabold text-emerald-950">
                      {language === "hi"
                        ? "धन्यवाद! आपकी रिपोर्ट दर्ज कर ली गई है।"
                        : "Thank you! Your feedback has been recorded."}
                    </h3>
                    <p className="mt-2 text-sm text-emerald-800">
                      {language === "hi"
                        ? "आप GitHub Issues पर भी सीधे ट्रैक या योगदान कर सकते हैं।"
                        : "You can also open a direct issue on our public GitHub repository for immediate tracking."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setMessage("");
                      }}
                      className="mt-5 rounded-full bg-[#132F5B] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#0F2749] transition"
                    >
                      {language === "hi" ? "एक और संदेश भेजें" : "Send Another Report"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block font-bold text-[#0F2749]">
                          {language === "hi" ? "आपका नाम" : "Your Name"}
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={language === "hi" ? "उदा. पारुल वर्मा" : "e.g. Parul Verma"}
                          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 transition focus:border-[#132F5B] focus:ring-1 focus:ring-[#132F5B]/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#0F2749]">
                          {language === "hi" ? "ईमेल पता" : "Email Address"}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 transition focus:border-[#132F5B] focus:ring-1 focus:ring-[#132F5B]/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block font-bold text-[#0F2749]">
                          {language === "hi" ? "विषय" : "Topic"}
                        </label>
                        <select
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 transition focus:border-[#132F5B] focus:ring-1 focus:ring-[#132F5B]/20 focus:outline-none"
                        >
                          <option value="rule_discrepancy">
                            Scheme Rule Extraction Discrepancy
                          </option>
                          <option value="new_scheme">
                            Request a New Central/State Scheme
                          </option>
                          <option value="hindi_translation">
                            Hindi Translation / Fluency Feedback
                          </option>
                          <option value="research_collab">
                            Academic / NGO Collaboration
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#0F2749]">
                          {language === "hi"
                            ? "संबंधित योजना (वैकल्पिक)"
                            : "Related Scheme (Optional)"}
                        </label>
                        <select
                          value={schemeSlug}
                          onChange={(e) => setSchemeSlug(e.target.value)}
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 transition focus:border-[#132F5B] focus:ring-1 focus:ring-[#132F5B]/20 focus:outline-none"
                        >
                          <option value="">-- Select a Scheme --</option>
                          {SCHEMES_DATA.map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {s.scheme} ({s.slug})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0F2749]">
                        {language === "hi" ? "संदेश या विवरण" : "Message / Details"}
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          language === "hi"
                            ? "कृपया बताएं कि आधिकारिक पोर्टल के अनुसार नियम क्या होना चाहिए..."
                            : "Describe the eligibility condition or feedback in detail..."
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 transition focus:border-[#132F5B] focus:ring-1 focus:ring-[#132F5B]/20 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2.5 rounded-full bg-[#132F5B] px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0F2749] transition"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {language === "hi" ? "फीडबैक भेजें" : "Submit Feedback"}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Side Cards */}
          <div className="lg:col-span-5 space-y-5">
            {sideCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`group overflow-hidden rounded-2xl border ${card.border} ${card.bg} shadow-sm transition hover:shadow-md`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} text-white shadow-sm`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-extrabold text-[#0F2749]">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {card.desc}
                    </p>
                    <a
                      href={card.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${card.linkColor} hover:underline transition`}
                    >
                      <span>{card.linkText}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
