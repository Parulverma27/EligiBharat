"use client";

import React from "react";
import { ArrowRight, Link2, MapPin, ShieldCheck } from "lucide-react";
import type { Language } from "@/types/scheme";

export interface HeroBannerProps {
  language: Language;
}

export function HeroBanner({ language }: HeroBannerProps) {
  return (
    <section
      id="top"
      className="relative flex min-h-[380px] sm:min-h-[420px] lg:min-h-[450px] w-full items-center overflow-hidden border-b border-slate-200 bg-gradient-to-r from-[#EEF4FA] via-[#F5F5F0] to-[#AFC8E2]"
    >
      {/* User's Provided Real Photograph of Sansad Bhavan framed to show the full flag, colonnade, red sandstone base, and fountain lawn */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden md:block md:w-[58%] lg:w-[56%]">
        <img
          src="/images/user-parliament.jpg"
          alt="Parliament House (Sansad Bhavan), New Delhi"
          className="h-full w-full object-cover object-[center_46%]"
        />
        {/* Smooth gradient fade on the left so headline text has 100% contrast and blends into the sky */}
        <div
          className="absolute inset-y-0 left-0 w-[44%]"
          style={{
            background:
              "linear-gradient(90deg, #F3F5F3 0%, rgba(243, 245, 243, 0.92) 28%, rgba(243, 245, 243, 0.45) 65%, rgba(243, 245, 243, 0) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-14 sm:px-10 lg:py-16">
        <div className="max-w-2xl space-y-5">
          {/* Strictly 2-Line Serif Headline */}
          <h1 className="font-serif text-3xl font-extrabold leading-[1.18] tracking-tight text-[#0F2749] sm:text-[42px] lg:text-[46px]">
            {language === "hi" ? (
              <>
                <span className="block">अपनी सरकारी योजनाएं खोजें,</span>
                <span className="block mt-1.5">पूरी पारदर्शिता के साथ</span>
              </>
            ) : (
              <>
                <span className="block sm:whitespace-nowrap">
                  Find Your Government Schemes,
                </span>
                <span className="block mt-1.5 sm:whitespace-nowrap">
                  With Complete Transparency
                </span>
              </>
            )}
          </h1>

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

          {/* 3 Feature Pills + Explore Schemes CTA on One Clean Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2.5 text-xs sm:text-[13px] font-bold text-[#0F2749] shadow-sm">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 fill-emerald-600 text-white" />
              <span>
                {language === "hi"
                  ? "नियम-आधारित परिणाम"
                  : "Rule-Based Results"}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/90 bg-[#FFF8EB]/95 px-4 py-2.5 text-xs sm:text-[13px] font-bold text-[#0F2749] shadow-sm">
              <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-500 text-white">
                <Link2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </span>
              <span>
                {language === "hi" ? "आधिकारिक स्रोत लिंक" : "Source Linked"}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/90 bg-[#FFF8EB]/95 px-4 py-2.5 text-xs sm:text-[13px] font-bold text-[#0F2749] shadow-sm">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-500 text-white" />
              <span>
                {language === "hi"
                  ? "आपका डेटा लोकल रहता है"
                  : "Your Data Stays Local"}
              </span>
            </div>

            <a
              href="#workspace"
              className="inline-flex items-center gap-2 rounded-full bg-[#132F5B] px-6 py-2.5 text-xs sm:text-[13.5px] font-bold text-white shadow-md hover:bg-[#0F2749] transition"
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
