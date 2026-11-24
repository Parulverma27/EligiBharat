"use client";

import React from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  XCircle,
} from "lucide-react";
import type {
  EligibilityStatus,
  Language,
  SchemeGroup,
  StatusCounts,
} from "@/types/scheme";

export type StatusFilter = "all" | EligibilityStatus;
export type GroupFilter = "all" | SchemeGroup;

export interface EligibilitySummaryProps {
  counts: StatusCounts;
  totalSchemes: number;
  language: Language;
  selectedStatus: StatusFilter;
  selectedGroup: GroupFilter;
  onSelectStatus: (status: StatusFilter) => void;
  onSelectGroup: (group: GroupFilter) => void;
}

export function EligibilitySummary({
  counts,
  totalSchemes,
  language,
  selectedStatus,
  selectedGroup,
  onSelectStatus,
  onSelectGroup,
}: EligibilitySummaryProps) {
  const statusTiles: Array<{
    id: EligibilityStatus;
    labelEn: string;
    labelHi: string;
    count: number;
    bg: string;
    border: string;
    activeRing: string;
    titleColor: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "eligible",
      labelEn: "Eligible",
      labelHi: "पात्र",
      count: counts.eligible,
      bg: "bg-[#E2F3E7]",
      border: "border-[#B9E2C6]",
      activeRing: "ring-2 ring-emerald-700",
      titleColor: "text-emerald-950",
      icon: (
        <CheckCircle2 className="h-7 w-7 fill-emerald-700 text-white" />
      ),
    },
    {
      id: "possibly_eligible",
      labelEn: "Possibly Eligible",
      labelHi: "संभावित पात्र",
      count: counts.possibly_eligible,
      bg: "bg-[#FCECC9]",
      border: "border-[#F7D48C]",
      activeRing: "ring-2 ring-amber-600",
      titleColor: "text-amber-950",
      icon: <AlertCircle className="h-7 w-7 fill-amber-500 text-white" />,
    },
    {
      id: "need_more_info",
      labelEn: "Need More Info",
      labelHi: "जानकारी अधूरी",
      count: counts.need_more_info,
      bg: "bg-[#DCEBFA]",
      border: "border-[#B3D2F5]",
      activeRing: "ring-2 ring-blue-600",
      titleColor: "text-blue-950",
      icon: <HelpCircle className="h-7 w-7 fill-blue-600 text-white" />,
    },
    {
      id: "not_eligible",
      labelEn: "Not Eligible",
      labelHi: "अपात्र",
      count: counts.not_eligible,
      bg: "bg-[#FADCD9]",
      border: "border-[#F4B8B1]",
      activeRing: "ring-2 ring-rose-600",
      titleColor: "text-rose-950",
      icon: <XCircle className="h-7 w-7 fill-rose-600 text-white" />,
    },
  ];

  const categoryPills: Array<{
    id: GroupFilter;
    labelEn: string;
    labelHi: string;
  }> = [
    {
      id: "all",
      labelEn: `All (${totalSchemes})`,
      labelHi: `सभी (${totalSchemes})`,
    },
    { id: "pension", labelEn: "Pensions (10)", labelHi: "पेंशन (10)" },
    {
      id: "scholarship",
      labelEn: "Scholarships (10)",
      labelHi: "छात्रवृत्ति (10)",
    },
    { id: "farmer", labelEn: "Farmers (7)", labelHi: "किसान (7)" },
    {
      id: "women_family",
      labelEn: "Women & Family (3)",
      labelHi: "महिला एवं परिवार (3)",
    },
  ];

  return (
    <section className="rounded-2xl border border-amber-200/80 bg-[#FFF8EB] p-4 shadow-md">
      {/* 1. Header with Real Vector BarChart Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-amber-600" />
          <h2 className="font-serif text-[17px] font-bold text-[#0F2749]">
            {language === "hi" ? "पात्रता सारांश" : "Eligibility Summary"}
          </h2>
        </div>

        {selectedStatus !== "all" && (
          <button
            type="button"
            onClick={() => onSelectStatus("all")}
            className="text-[11px] font-semibold text-[#132F5B] underline"
          >
            {language === "hi" ? "सभी दिखाएं" : "Show All"}
          </button>
        )}
      </div>

      {/* 2. Four Colored Counter Tiles */}
      <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {statusTiles.map((tile) => {
          const active = selectedStatus === tile.id;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => onSelectStatus(active ? "all" : tile.id)}
              className={`flex flex-col items-center justify-center rounded-xl border ${tile.border} ${tile.bg} px-2 py-3 text-center shadow-sm transition hover:scale-[1.02] ${
                active ? tile.activeRing : ""
              }`}
            >
              {tile.icon}
              <span
                className={`mt-1.5 text-[11.5px] font-extrabold leading-tight ${tile.titleColor}`}
              >
                {language === "hi" ? tile.labelHi : tile.labelEn}
              </span>
              <span
                className={`mt-1 text-2xl font-black tracking-tight ${tile.titleColor}`}
              >
                {tile.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Filter by Category Pill Bar */}
      <div className="mt-4 border-t border-amber-200/70 pt-3">
        <p className="text-xs font-extrabold text-[#0F2749]">
          {language === "hi"
            ? "श्रेणी के अनुसार फ़िल्टर करें:"
            : "Filter by Category:"}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {categoryPills.map((cat) => {
            const active = selectedGroup === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectGroup(cat.id)}
                className={`rounded-full px-3 py-1.5 text-[11.5px] font-bold transition shadow-sm ${
                  active
                    ? "bg-[#132F5B] text-white"
                    : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                {language === "hi" ? cat.labelHi : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
