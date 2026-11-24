"use client";

import React, { useState } from "react";
import { ChevronDown, ListFilter, Scale, Search } from "lucide-react";
import type { GroupFilter, StatusFilter } from "@/components/EligibilitySummary";
import { SchemeCard } from "@/components/SchemeCard";
import type {
  CheckerEvaluation,
  Language,
  StatusCounts,
} from "@/types/scheme";

export interface SchemeResultsListProps {
  results: CheckerEvaluation[];
  counts: StatusCounts;
  language: Language;
  statusFilter?: StatusFilter;
  groupFilter?: GroupFilter;
  onStatusFilterChange?: (status: StatusFilter) => void;
}

export function SchemeResultsList({
  results,
  counts,
  language,
  statusFilter = "all",
  groupFilter = "all",
  onStatusFilterChange,
}: SchemeResultsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

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

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-[#EDF4FC] shadow-md">
      {/* 1. Deep Navy Header Bar with Real Vector Scale Icon */}
      <div className="flex items-center justify-between bg-[#132F5B] px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <Scale className="h-5 w-5 text-white" />
          <h2 className="font-serif text-[17px] font-bold tracking-wide">
            {language === "hi" ? "योजना परिणाम" : "Scheme Results"}
          </h2>
        </div>

        <span className="text-xs font-bold text-white">
          {language === "hi"
            ? `कुल योजनाएं: ${results.length}`
            : `Total Schemes: ${results.length}`}
        </span>
      </div>

      {/* 2. Search Bar + "Filters v" Button with Real Vector Icons */}
      <div className="p-3.5 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex flex-1 items-center rounded-full border border-slate-300 bg-white px-3.5 py-2 shadow-sm focus-within:border-[#132F5B]">
            <Search className="mr-2 h-4 w-4 shrink-0 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "hi"
                  ? "योजनाएं खोजें... (जैसे PM-KISAN, APY)"
                  : "Search schemes... (e.g. PM-KISAN, APY)"
              }
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-[#0F2749] shadow-sm hover:bg-slate-50 transition"
            >
              <ListFilter className="h-3.5 w-3.5 text-[#0F2749]" />
              <span>{language === "hi" ? "फ़िल्टर" : "Filters"}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {showFilterMenu && onStatusFilterChange && (
              <div className="absolute right-0 z-20 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-xs shadow-lg">
                {(
                  [
                    { id: "all", label: `All (${results.length})` },
                    { id: "eligible", label: `Eligible (${counts.eligible})` },
                    {
                      id: "possibly_eligible",
                      label: `Possibly Eligible (${counts.possibly_eligible})`,
                    },
                    {
                      id: "need_more_info",
                      label: `Need More Info (${counts.need_more_info})`,
                    },
                    {
                      id: "not_eligible",
                      label: `Not Eligible (${counts.not_eligible})`,
                    },
                  ] as Array<{ id: StatusFilter; label: string }>
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onStatusFilterChange(opt.id);
                      setShowFilterMenu(false);
                    }}
                    className={`block w-full rounded-lg px-3 py-1.5 text-left font-semibold ${
                      statusFilter === opt.id
                        ? "bg-[#132F5B] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Scrollable List of Illustrated Scheme Result Cards */}
      <div className="no-scrollbar max-h-[540px] space-y-3 overflow-y-auto p-3.5 pt-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
            {language === "hi"
              ? "इस फ़िल्टर में कोई योजना नहीं मिली। कृपया फ़िल्टर बदलें।"
              : "No schemes match the current filter. Try selecting another category or status tile."}
          </div>
        ) : (
          filtered.map((ev) => (
            <SchemeCard key={ev.slug} evaluation={ev} language={language} />
          ))
        )}
      </div>
    </section>
  );
}
