"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Language } from "@/types/scheme";

export interface FooterProps {
  language: Language;
}

export function Footer({ language }: FooterProps) {
  return (
    <footer
      id="footer"
      className="mt-6 border-t border-slate-800 bg-[#0F2749] px-4 py-3 text-xs text-slate-200"
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
        {/* Left: Real Cropped Footer Chakra Emblem + Wordmark + Tagline */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/footer-chakra.png"
              alt="Ashoka Chakra Emblem"
              className="h-7 w-auto object-contain"
            />
            <span className="font-serif text-lg font-extrabold tracking-tight">
              <span className="text-white">Eligi</span>
              <span className="text-[#F97316]">Bharat</span>
            </span>
          </Link>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="text-slate-300">
            {language === "hi"
              ? "पारदर्शी योजना जानकारी के साथ नागरिकों को सशक्त बनाना"
              : "Empowering Citizens with Transparent Scheme Information"}
          </span>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap items-center gap-3 text-slate-300 font-medium">
          <Link href="/about" className="hover:text-white transition">
            {language === "hi" ? "परिचय" : "About"}
          </Link>
          <span className="text-slate-600">|</span>
          <Link href="/how-it-works" className="hover:text-white transition">
            {language === "hi" ? "कैसे काम करता है" : "How It Works"}
          </Link>
          <span className="text-slate-600">|</span>
          <Link href="/faq" className="hover:text-white transition">
            {language === "hi" ? "प्रश्न (FAQ)" : "FAQ"}
          </Link>
          <span className="text-slate-600">|</span>
          <a
            href="https://www.myscheme.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            {language === "hi" ? "अस्वीकरण" : "Disclaimer"}
          </a>
          <span className="text-slate-600">|</span>
          <Link href="/contact" className="hover:text-white transition">
            {language === "hi" ? "संपर्क ▾" : "Contact ▾"}
          </Link>
        </div>

        {/* Right: Made with heart for India + Real National Emblem */}
        <div className="flex items-center gap-2.5 font-semibold text-slate-200">
          <span className="inline-flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>for India</span>
          </span>
          <img
            src="/images/footer-emblem.png"
            alt="Emblem"
            className="h-7 w-auto object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
