"use client";

import React, { useState } from "react";
import { MessageCircleMore, Paperclip, Send } from "lucide-react";
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

const QUICK_PERSONA_PILLS: Array<{
  line1En: string;
  line2En: string;
  line1Hi: string;
  line2Hi: string;
  messageEn: string;
  messageHi: string;
}> = [
  {
    line1En: "I am a 68yo widow",
    line2En: "in Rajasthan",
    line1Hi: "मैं 68 वर्षीय विधवा हूँ",
    line2Hi: "राजस्थान से",
    messageEn:
      "I am a 68 years old SC widow in Rajasthan with annual income Rs 36,000 and BPL card.",
    messageHi:
      "मैं राजस्थान से 68 साल की विधवा महिला हूँ, SC वर्ग और BPL कार्ड धारक हूँ, मेरी वार्षिक आय 36000 है।",
  },
  {
    line1En: "I am a student",
    line2En: "in UP",
    line1Hi: "मैं एक छात्रा हूँ",
    line2Hi: "उत्तर प्रदेश से",
    messageEn:
      "I am a 16 year old SC female school student in Uttar Pradesh with family income Rs 1,20,000.",
    messageHi:
      "मैं उत्तर प्रदेश से 16 साल की SC छात्रा हूँ, परिवार की आय 1,20,000 है।",
  },
  {
    line1En: "I am a farmer",
    line2En: "in Gujarat",
    line1Hi: "मैं एक किसान हूँ",
    line2Hi: "गुजरात से",
    messageEn:
      "I am a 32 year old ST farmer in Gujarat with annual income Rs 85,000 and BPL card.",
    messageHi:
      "मैं गुजरात से 32 साल का ST किसान हूँ, मेरी आय 85000 है और BPL कार्ड है।",
  },
];

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
    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-[#EDF4FC] shadow-md">
      {/* 1. Deep Navy Header Bar with Real Vector Chat Icon */}
      <div className="flex items-center justify-between bg-[#132F5B] px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <MessageCircleMore className="h-5 w-5 fill-white text-[#132F5B]" />
          <h2 className="font-serif text-[17px] font-bold tracking-wide">
            {language === "hi" ? "चैट सहायक" : "Chat Assistant"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setAskedFields([]);
                setTurnCount(0);
                setNextQuestion(null);
              }}
              className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white hover:bg-white/25 transition"
            >
              {language === "hi" ? "साफ़ करें" : "Clear"}
            </button>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
            <span>{language === "hi" ? "ऑनलाइन" : "Online"}</span>
          </span>
        </div>
      </div>

      {/* 2. Real 3D Robot Mascot Image & Speech Bubble Greeting */}
      <div className="p-3.5 space-y-3.5">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/robot-mascot.png"
            alt="EligiBharat 3D Robot Mascot"
            className="h-28 w-24 shrink-0 rounded-xl object-contain"
          />

          {/* Speech Bubble */}
          <div className="relative flex-1 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 text-xs leading-relaxed text-slate-800 shadow-sm">
            <p className="text-sm font-extrabold text-[#0F2749]">
              {language === "hi" ? "नमस्ते! 👋" : "Namaste! 👋"}
            </p>
            <p className="mt-1 font-medium text-slate-700 leading-snug">
              {language === "hi"
                ? "अपनी स्थिति के बारे में बताएं, या नीचे दिए गए त्वरित विकल्पों में से एक चुनें।"
                : "Tell me about your situation, or choose a quick option below."}
            </p>
          </div>
        </div>

        {/* Conversation History (When active) */}
        {messages.length > 0 && (
          <div className="no-scrollbar max-h-52 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2.5 text-xs shadow-inner">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl p-2.5 whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-6 bg-[#132F5B] text-white"
                    : "mr-3 border border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <div className="mb-0.5 text-[10px] font-bold uppercase opacity-75">
                  {m.role === "user"
                    ? language === "hi"
                      ? "आप"
                      : "You"
                    : "EligiBharat AI"}
                </div>
                {m.content}
              </div>
            ))}
          </div>
        )}

        {/* 3. Three 2-Line Quick Persona Pill Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {QUICK_PERSONA_PILLS.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() =>
                void sendMessage(
                  language === "hi" ? pill.messageHi : pill.messageEn
                )
              }
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-[#E4EFFB] px-2 py-2.5 text-center text-[11px] font-bold leading-snug text-[#0F2749] shadow-sm hover:border-[#132F5B] hover:bg-white transition"
            >
              <span>{language === "hi" ? pill.line1Hi : pill.line1En}</span>
              <span>{language === "hi" ? pill.line2Hi : pill.line2En}</span>
            </button>
          ))}
        </div>

        {/* 4. Rounded Chat Input Bar + Navy Paper-Plane Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex flex-1 items-center rounded-full border border-slate-300 bg-white px-3.5 py-2 shadow-sm focus-within:border-[#132F5B]">
            <Paperclip className="mr-2 h-4 w-4 shrink-0 text-slate-500" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "hi"
                  ? "अंग्रेजी या हिंदी में अपना संदेश लिखें..."
                  : "Type your message in English or हिंदी..."
              }
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="flex h-9 w-10 shrink-0 items-center justify-center rounded-xl bg-[#132F5B] text-white shadow-sm hover:bg-[#0F2749] disabled:opacity-60 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* 5. Real Quick Help Banner Image (or Follow-up Question overlay) */}
        {nextQuestion ? (
          <div className="rounded-xl border border-amber-300 bg-[#FFF6E0] p-3 text-xs text-[#0F2749] shadow-sm">
            <p className="font-serif font-extrabold">
              {language === "hi" ? "अगला प्रश्न:" : "Follow-up Question:"}
            </p>
            <p className="mt-0.5 font-medium text-slate-800">{nextQuestion}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-amber-200/80 shadow-sm">
            <img
              src="/images/quick-help-bg.jpg"
              alt="Quick Help — Get scheme suggestions in just one message!"
              className="w-full h-auto block object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
