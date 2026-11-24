"use client";

import React from "react";
import {
  ArrowRight,
  Link2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Language } from "@/types/scheme";

export interface HeroBannerProps {
  language: Language;
}

export function HeroBanner({ language }: HeroBannerProps) {
  return (
    <section
      id="top"
      className="relative flex min-h-[410px] sm:min-h-[440px] lg:min-h-[470px] w-full items-center overflow-hidden border-b border-slate-200/80 bg-gradient-to-r from-[#EEF4FA] via-[#F4F6F9] to-[#8EB4D9]"
    >
      {/* Right-Side Parliament Photograph with CSS Alpha Mask (Zero Vertical Seam, Cropped Corner Leaves & Enhanced Vibrancy) */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden md:block md:w-[62%] lg:w-[60%] overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.22) 16%, rgba(0,0,0,0.68) 34%, black 52%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.22) 16%, rgba(0,0,0,0.68) 34%, black 52%)",
        }}
      >
        <img
          src="/images/user-parliament.jpg"
          alt="Parliament House (Sansad Bhavan), New Delhi"
          className="h-full w-full scale-[1.12] object-cover object-[center_47%] contrast-[1.07] saturate-[1.14] brightness-[1.03]"
        />
        {/* Subtle bottom fade into the workspace background */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#EEF3F9]/85 via-[#EEF3F9]/30 to-transparent" />
      </div>

      {/* Subtle Sweeping Tricolor Ribbon Accent in Far Top-Right Corner */}
      <svg
        viewBox="0 0 260 150"
        className="pointer-events-none absolute top-0 right-0 hidden lg:block h-36 w-64 opacity-85"
        aria-hidden="true"
      >
        <path
          d="M110 150 C 165 105, 215 55, 260 10 L 260 36 C 215 78, 165 122, 130 150 Z"
          fill="#F97316"
        />
        <path
          d="M132 150 C 180 112, 222 68, 260 34 L 260 56 C 222 88, 180 126, 150 150 Z"
          fill="#FFFFFF"
        />
        <path
          d="M152 150 C 195 118, 230 82, 260 54 L 260 78 C 230 104, 195 134, 172 150 Z"
          fill="#15803D"
        />
      </svg>

      {/* Left Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 lg:py-14">
        <div className="max-w-3xl space-y-4">
          {/* 1. Civic-Tech Eyebrow Badge Balancing Vertical Space */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#132F5B] shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
            <span>
              {language === "hi"
                ? "AI-सहायक • 100% नियम-सत्यापित सरकारी योजना खोज (English & हिन्दी)"
                : "AI-Assisted • 100% Rule-Verified Welfare Discovery (English & हिन्दी)"}
            </span>
          </div>

          {/* 2. Strictly 2-Line Serif Headline */}
          <h1 className="font-serif text-3xl font-extrabold leading-[1.16] tracking-tight text-[#0F2749] sm:text-[42px] lg:text-[48px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {language === "hi" ? (
              <>
                <span className="block">अपनी सरकारी योजनाएं खोजें,</span>
                <span className="block mt-1">पूरी पारदर्शिता के साथ</span>
              </>
            ) : (
              <>
                <span className="block sm:whitespace-nowrap">
                  Find Your Government Schemes,
                </span>
                <span className="block mt-1 sm:whitespace-nowrap">
                  With Complete Transparency
                </span>
              </>
            )}
          </h1>

          {/* 3. Subtitle */}
          <p className="max-w-xl text-base leading-relaxed font-medium text-slate-800 sm:text-[17px]">
            {language === "hi" ? (
              <>
                अपनी स्थिति{" "}
                <span className="font-bold underline decoration-amber-600/80 underline-offset-4">
                  अंग्रेजी या हिंदी
                </span>{" "}
                में बताएं, और हम आपको दिखाएंगे कि आप किन योजनाओं के लिए पात्र हैं, क्यों, और आगे क्या जांचना है।
              </>
            ) : (
              <>
                Tell us about your situation in{" "}
                <span className="font-bold underline decoration-amber-600/80 underline-offset-4">
                  English or Hindi
                </span>
                , and we&apos;ll show you which schemes you qualify for, why, and what to check next.
              </>
            )}
          </p>

          {/* 4. All 3 Feature Pills + Explore Schemes CTA Aligned on ONE Single Horizontal Row */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 pt-2">
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 px-3.5 py-2 text-xs sm:text-[13px] font-bold text-[#0F2749] shadow-sm">
              <ShieldCheck className="h-4 w-4 shrink-0 fill-emerald-600 text-white" />
              <span>
                {language === "hi"
                  ? "नियम-आधारित परिणाम"
                  : "Rule-Based Results"}
              </span>
            </div>

            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200/90 bg-[#FFF8EB]/95 px-3.5 py-2 text-xs sm:text-[13px] font-bold text-[#0F2749] shadow-sm">
              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                <Link2 className="h-2.5 w-2.5" />
              </span>
              <span>
                {language === "hi" ? "आधिकारिक स्रोत लिंक" : "Source Linked"}
              </span>
            </div>

            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200/90 bg-[#FFF8EB]/95 px-3.5 py-2 text-xs sm:text-[13px] font-bold text-[#0F2749] shadow-sm">
              <MapPin className="h-4 w-4 shrink-0 fill-amber-500 text-white" />
              <span>
                {language === "hi"
                  ? "आपका डेटा लोकल रहता है"
                  : "Your Data Stays Local"}
              </span>
            </div>

            <a
              href="#workspace"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#132F5B] px-5 py-2 text-xs sm:text-[13px] font-bold text-white shadow-md hover:bg-[#0F2749] transition"
            >
              <span>
                {language === "hi" ? "योजनाएं देखें" : "Explore Schemes"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
