"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Globe,
  HelpCircle,
  Home,
  Info,
  Mail,
  Star,
  User,
} from "lucide-react";
import type { Language } from "@/types/scheme";

export interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  totalSchemes: number;
}

export function Navbar({
  language,
  onLanguageChange,
  totalSchemes,
}: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      labelEn: "Home",
      labelHi: "होम",
      icon: Home,
    },
    {
      href: "/about",
      labelEn: "About",
      labelHi: "परिचय",
      icon: User,
    },
    {
      href: "/how-it-works",
      labelEn: "How It Works",
      labelHi: "कैसे काम करता है",
      icon: Compass,
    },
    {
      href: "/faq",
      labelEn: "FAQ",
      labelHi: "प्रश्न (FAQ)",
      icon: HelpCircle,
    },
    {
      href: "/contact",
      labelEn: "Contact",
      labelHi: "संपर्क",
      icon: Mail,
    },
  ];

  return (
    <header className="w-full shadow-sm">
      {/* 1. Taller Top Deep Navy Disclaimer & Trust Strip */}
      <div className="bg-[#0F2749] text-white px-6 py-3 text-xs sm:text-[13.5px]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 fill-white text-[#0F2749]" />
            {language === "hi" ? (
              <span>
                <strong>EligiBharat</strong> एक ओपन-सोर्स छात्र परियोजना है, कोई आधिकारिक सरकारी पोर्टल नहीं। सभी विवरण{" "}
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-400 underline hover:text-amber-300"
                >
                  myscheme.gov.in
                </a>{" "}
                पर सत्यापित करें।
              </span>
            ) : (
              <span>
                <strong>EligiBharat</strong> is an open-source student project, NOT an official government portal. Verify all details on{" "}
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-400 underline hover:text-amber-300"
                >
                  myscheme.gov.in
                </a>
                .
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-slate-200">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>100% Local</span>
            <span className="text-slate-500">|</span>
            <span>Deterministic Rule Engine</span>
            <span className="text-slate-500">|</span>
            <span>{totalSchemes} Verified Schemes</span>
          </div>
        </div>
      </div>

      {/* 2. Taller Main White Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sm:py-5">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6">
          {/* Left: Razor-Sharp High-Resolution Vector Ashoka Chakra & Tricolor Wave Emblem + EligiBharat Wordmark */}
          <Link href="/" className="flex items-center gap-3.5">
            <img
              src="/images/logo-emblem.svg"
              alt="EligiBharat Ashoka Chakra Emblem"
              className="h-14 sm:h-16 w-auto object-contain"
            />
            <div>
              <div className="flex items-baseline text-3xl sm:text-[34px] leading-none font-extrabold tracking-tight font-serif">
                <span className="text-[#0F2749]">Eligi</span>
                <span className="text-[#EA580C]">Bharat</span>
              </div>
              <p className="mt-1 text-xs leading-snug font-medium text-slate-700 max-w-[300px]">
                Transparent, Open-Source Indian Government
                <br />
                Scheme Eligibility Assistant (English &amp; हिन्दी)
              </p>
            </div>
          </Link>

          {/* Center: Spacious Navigation Links with Vector Icons & Active Pill State */}
          <nav className="flex flex-wrap items-center gap-2.5 border-l border-slate-300 pl-6 sm:pl-8 text-sm font-semibold text-[#0F2749]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition ${
                    isActive
                      ? "bg-[#132F5B] text-white shadow-sm"
                      : "text-[#0F2749] hover:bg-slate-200/60"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-white" : "text-[#132F5B]"
                    }`}
                  />
                  <span>
                    {language === "hi" ? item.labelHi : item.labelEn}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Language Pill Switcher */}
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center rounded-full border border-[#132F5B]/35 bg-white p-1 shadow-sm"
              role="group"
              aria-label="Language toggle"
            >
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                  language === "en"
                    ? "bg-[#132F5B] text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>English</span>
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange("hi")}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                  language === "hi"
                    ? "bg-[#132F5B] text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
