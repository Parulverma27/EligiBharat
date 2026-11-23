"use client";

import React, { useState } from "react";
import { SchemeCard } from "@/components/SchemeCard";
import type {
  CheckerEvaluation,
  EligibilityStatus,
  Language,
  SchemeGroup,
  StatusCounts,
} from "@/types/scheme";

export interface SchemeResultsListProps {
  results: CheckerEvaluation[];
  counts: StatusCounts;
  language: Language;
}

type StatusFilter = "all" | EligibilityStatus;
type GroupFilter = "all" | SchemeGroup;

export function SchemeResultsList({
  results,
  counts,
  language,
}: SchemeResultsListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = results.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (groupFilter !== "all" && r.group !== groupFilter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        r.scheme.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.scope_state ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusTabs: Array<{
    id: StatusFilter;
    labelEn: string;
    labelHi: string;
    count: number;
    color: string;
  }> = [
    {
      id: "all",
      labelEn: "All Schemes",
      labelHi: "सभी योजनाएं",
      count: results.length,
      color: "bg-slate-800 text-white",
    },
    {
      id: "eligible",
      labelEn: "Eligible",
      labelHi: "पात्र",
      count: counts.eligible,
      color: "bg-emerald-600 text-white",
    },
    {
      id: "possibly_eligible",
      labelEn: "Possibly Eligible",
      labelHi: "संभावित पात्र",
      count: counts.possibly_eligible,
      color: "bg-amber-600 text-white",
    },
    {
      id: "need_more_info",
      labelEn: "Need More Info",
      labelHi: "जानकारी अधूरी",
      count: counts.need_more_info,
      color: "bg-blue-600 text-white",
    },
    {
      id: "not_eligible",
      labelEn: "Not Eligible",
      labelHi: "अपात्र",
      count: counts.not_eligible,
      color: "bg-slate-500 text-white",
    },
  ];

  const groupTabs: Array<{ id: GroupFilter; labelEn: string; labelHi: string }> = [
    { id: "all", labelEn: "All Categories", labelHi: "सभी श्रेणियां" },
    { id: "pension", labelEn: "Pensions (10)", labelHi: "पेंशन (10)" },
    { id: "scholarship", labelEn: "Scholarships (10)", labelHi: "छात्रवृत्ति (10)" },
    { id: "farmer", labelEn: "Farmers (7)", labelHi: "किसान (7)" },
    { id: "women_family", labelEn: "Women & Family (3)", labelHi: "महिला एवं परिवार (3)" },
  ];

  return (
    <section className="space-y-4">
      {/* Status Summary Filter Pills */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {statusTabs.map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? tab.color
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{language === "hi" ? tab.labelHi : tab.labelEn}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      active ? "bg-white/25 text-white" : "bg-white text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "hi"
                ? "योजना या राज्य खोजें..."
                : "Search scheme name or state..."
            }
            className="w-full sm:w-52 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2.5">
          {groupTabs.map((g) => {
            const active = groupFilter === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroupFilter(g.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {language === "hi" ? g.labelHi : g.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Scheme Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
          {language === "hi"
            ? "इस फ़िल्टर में कोई योजना नहीं मिली। कृपया फ़िल्टर बदलें।"
            : "No schemes match the current filter. Try selecting another status tab."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ev) => (
            <SchemeCard key={ev.slug} evaluation={ev} language={language} />
          ))}
        </div>
      )}
    </section>
  );
}
