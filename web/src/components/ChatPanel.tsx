"use client";

import React, { useState } from "react";
import { runConversationalTurn } from "@/lib/checker";
import type { Language, UserProfile } from "@/types/scheme";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatPanelProps {
  profile: UserProfile;
  language: Language;
  onProfileUpdate: (updated: UserProfile) => void;
  onLanguageDetected: (lang: Language) => void;
}

const SAMPLE_PROMPTS: Record<Language, string[]> = {
  en: [
    "I am a 68 years old SC widow in Rajasthan with annual income Rs 36,000 and BPL card.",
    "I am a 32 year old ST farmer in Gujarat with income Rs 85,000.",
    "I am a 19 year old girl engineering student from Assam, family income 4.5 lakh.",
  ],
  hi: [
    "मैं राजस्थान से 68 साल की विधवा महिला हूँ, SC वर्ग और BPL कार्ड धारक हूँ, मेरी वार्षिक आय 36000 है।",
    "मैं गुजरात से 32 साल का ST किसान हूँ, मेरी आय 85000 है।",
    "मैं उत्तर प्रदेश से 16 साल की SC छात्रा हूँ, परिवार की आय 1,20,000 है।",
  ],
};

export function ChatPanel({
  profile,
  language,
  onProfileUpdate,
  onLanguageDetected,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [askedFields, setAskedFields] = useState<string[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [nextQuestion, setNextQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const endpoint = apiBase ? `${apiBase}/api/chat` : "/api/chat";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          profile,
          asked_fields: askedFields,
          turn_count: turnCount,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as {
        reply: string;
        language: Language;
        profile: UserProfile;
        asked_fields: string[];
        turn_count: number;
        next_question_text: string | null;
      };

      onProfileUpdate(data.profile);
      onLanguageDetected(data.language);
      setAskedFields(data.asked_fields);
      setTurnCount(data.turn_count);
      setNextQuestion(data.next_question_text);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: data.reply },
      ]);
    } catch {
      // Deterministic client fallback so chat never fails even offline
      const fallback = runConversationalTurn(
        trimmed,
        profile,
        askedFields,
        turnCount,
        language
      );
      onProfileUpdate(fallback.profile);
      onLanguageDetected(fallback.language);
      setAskedFields(fallback.asked_fields);
      setTurnCount(fallback.turn_count);
      setNextQuestion(fallback.next_question_text);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: fallback.reply },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {language === "hi"
              ? "संवादात्मक सहायक (Conversational Eligibility Assistant)"
              : "Conversational Eligibility Assistant (English & Hindi)"}
          </h2>
          <p className="text-xs text-slate-500">
            {language === "hi"
              ? "अपनी स्थिति हिंदी या अंग्रेजी में लिखें — प्रोफ़ाइल और पात्रता स्वतः अपडेट होगी"
              : "Describe your situation in English or Hindi — your profile and results update automatically"}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setAskedFields([]);
              setTurnCount(0);
              setNextQuestion(null);
            }}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            {language === "hi" ? "चैट साफ़ करें" : "Clear Chat"}
          </button>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {SAMPLE_PROMPTS[language].map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => void sendMessage(prompt)}
            className="rounded-lg border border-indigo-100 bg-indigo-50/70 px-2.5 py-1 text-left text-[11px] font-medium text-indigo-800 hover:bg-indigo-100 transition"
          >
            “{prompt}”
          </button>
        ))}
      </div>

      {/* Messages Container */}
      {messages.length > 0 && (
        <div className="mt-3 max-h-72 space-y-2.5 overflow-y-auto rounded-lg bg-slate-50 p-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg p-3 whitespace-pre-wrap ${
                m.role === "user"
                  ? "ml-8 bg-indigo-600 text-white"
                  : "mr-8 border border-slate-200 bg-white text-slate-800"
              }`}
            >
              <div className="mb-1 text-[10px] font-bold uppercase opacity-75">
                {m.role === "user"
                  ? language === "hi"
                    ? "आप (You)"
                    : "You"
                  : "EligiBharat Assistant"}
              </div>
              {m.content}
            </div>
          ))}
        </div>
      )}

      {/* Highlighted Single Follow-up Question Banner */}
      {nextQuestion && (
        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
          <strong>
            {language === "hi" ? "अगला प्रश्न:" : "Follow-up Question:"}
          </strong>{" "}
          {nextQuestion}
        </div>
      )}

      {/* Chat Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === "hi"
              ? "उदाहरण: मैं राजस्थान से 65 साल की महिला हूँ, मेरी आय 40,000 है..."
              : "e.g., I am a 65 year old farmer in Uttarakhand with income Rs 35,000..."
          }
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading
            ? language === "hi"
              ? "जांच रहा है..."
              : "Checking..."
            : language === "hi"
              ? "पूछें (Send)"
              : "Ask Assistant"}
        </button>
      </form>
    </section>
  );
}
