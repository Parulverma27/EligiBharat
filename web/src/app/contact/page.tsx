"use client";

import React, { useState } from "react";
import {
  Bug,
  CheckCircle2,
  ExternalLink,
  FileCode2,
  Globe,
  Mail,
  Send,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F9]">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />

      {/* Page Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-r from-[#0F2749] via-[#132F5B] to-[#1E3A8A] text-white py-10 px-4">
        <div className="mx-auto max-w-[1100px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Mail className="h-4 w-4" />
            <span>
              {language === "hi"
                ? "संपर्क और ओपन-सोर्स सहयोग"
                : "Contact, Feedback & Rule Bug Reports"}
            </span>
          </span>
          <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl">
            {language === "hi"
              ? "संपर्क करें या नियम त्रुटि रिपोर्ट करें"
              : "Get in Touch or Report a Scheme Rule Issue"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            {language === "hi"
              ? "यदि आपको किसी योजना के निकाले गए नियमों में कोई अंतर मिलता है या आप इस ओपन-सोर्स परियोजना में योगदान देना चाहते हैं, तो हमें लिखें।"
              : "Spotted an outdated eligibility rule, want to contribute human annotations to our benchmark, or interested in running EligiBharat at your NGO or college? Send a note below."}
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Feedback & Rule Discrepancy Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-extrabold text-[#0F2749]">
                {language === "hi"
                  ? "फीडबैक या नियम सुधार फॉर्म"
                  : "Send Feedback or Report a Rule Discrepancy"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                {language === "hi"
                  ? "आपका संदेश सीधे परियोजना रखरखाव टीम के लिए दर्ज किया जाएगा।"
                  : "Help us keep extracted scheme rules accurate against official myscheme.gov.in guidelines."}
              </p>

              {submitted ? (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 fill-emerald-700 text-white" />
                  <h3 className="mt-3 font-serif text-lg font-extrabold text-emerald-950">
                    {language === "hi"
                      ? "धन्यवाद! आपकी रिपोर्ट दर्ज कर ली गई है।"
                      : "Thank you! Your feedback has been recorded."}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-emerald-800">
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
                    className="mt-4 rounded-full bg-[#132F5B] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0F2749]"
                  >
                    {language === "hi" ? "एक और संदेश भेजें" : "Send Another Report"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-[#132F5B] focus:outline-none"
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
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-[#132F5B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block font-bold text-[#0F2749]">
                        {language === "hi" ? "विषय" : "Topic"}
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-[#132F5B] focus:outline-none"
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
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-[#132F5B] focus:outline-none"
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
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        language === "hi"
                          ? "कृपया बताएं कि आधिकारिक पोर्टल के अनुसार नियम क्या होना चाहिए..."
                          : "Describe the eligibility condition or feedback in detail..."
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-[#132F5B] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#132F5B] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#0F2749] transition"
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

          {/* Right Column: Direct GitHub, Dataset & Official Portal Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#132F5B] text-white">
                  <FileCode2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-extrabold text-[#0F2749]">
                    GitHub Repository
                  </h3>
                  <p className="text-xs text-slate-500">
                    Parulverma27/EligiBharat
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Inspect the Python rule extractor, ChromaDB ingestion scripts, 90-case evaluation benchmark, and Next.js frontend source code.
              </p>
              <a
                href="https://github.com/Parulverma27/EligiBharat"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#132F5B] hover:underline"
              >
                <span>Open GitHub Repository</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-[#FFF8EB] p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Bug className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-extrabold text-[#0F2749]">
                    Report Extraction Issues on GitHub
                  </h3>
                  <p className="text-xs text-slate-600">
                    Help expand our 90-case benchmark to 300+ cases
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-700">
                If a small 3B LLM mis-extracted a numeric threshold or exclusion on a scheme, open an issue with the scheme slug and official source quote.
              </p>
              <a
                href="https://github.com/Parulverma27/EligiBharat/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#132F5B] hover:underline"
              >
                <span>File a GitHub Issue</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-extrabold text-[#0F2749]">
                    Official Government Portal
                  </h3>
                  <p className="text-xs text-slate-500">myscheme.gov.in</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                To apply for any welfare scheme or check official government notifications, always visit the National Platform for Government Schemes.
              </p>
              <a
                href="https://www.myscheme.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
              >
                <span>Visit myscheme.gov.in</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
