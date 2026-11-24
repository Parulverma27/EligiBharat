"use client";

import React, { useMemo, useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import {
  EligibilitySummary,
  type GroupFilter,
  type StatusFilter,
} from "@/components/EligibilitySummary";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/HeroBanner";
import { Navbar } from "@/components/Navbar";
import { ProfileForm } from "@/components/ProfileForm";
import { SchemeResultsList } from "@/components/SchemeResultsList";
import { EMPTY_PROFILE, evaluateAllSchemes } from "@/lib/checker";
import { SCHEMES_DATA } from "@/lib/schemesData";
import type { Language, UserProfile } from "@/types/scheme";

const DEFAULT_DEMO_PROFILE: UserProfile = {
  ...EMPTY_PROFILE,
  age: 32,
  gender: "male",
  state: "Gujarat",
  annual_income_inr: 120000,
  categories: ["OBC"],
  occupation: "farmer",
  is_bpl: false,
  is_disabled: false,
};

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_DEMO_PROFILE);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");

  const { counts, results } = useMemo(
    () => evaluateAllSchemes(profile),
    [profile]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F9]">
      {/* 1. Top Navy Disclaimer Strip & Main Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />

      {/* 2. Civic Hero Banner with Sansad Bhavan & Trust Badges */}
      <HeroBanner language={language} />

      {/* 3. Three-Column Interactive Workspace Anchored Smoothly into Hero */}
      <main
        id="workspace"
        className="relative z-20 mx-auto -mt-5 w-full max-w-[1440px] flex-1 px-4 pb-6 sm:px-6"
      >
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* Left Column (3 cols): AI Chat Assistant with Robot Mascot */}
          <div className="lg:col-span-3">
            <ChatPanel
              profile={profile}
              language={language}
              onProfileUpdate={setProfile}
              onLanguageDetected={setLanguage}
            />
          </div>

          {/* Middle Column (4 cols): Your Profile Card + Eligibility Summary Card */}
          <div className="lg:col-span-4 space-y-5">
            <ProfileForm
              profile={profile}
              language={language}
              onChange={setProfile}
              onReset={() => setProfile(EMPTY_PROFILE)}
            />
            <EligibilitySummary
              counts={counts}
              totalSchemes={SCHEMES_DATA.length}
              language={language}
              selectedStatus={statusFilter}
              selectedGroup={groupFilter}
              onSelectStatus={setStatusFilter}
              onSelectGroup={setGroupFilter}
            />
          </div>

          {/* Right Column (5 cols): Illustrated Scheme Result Cards */}
          <div className="lg:col-span-5">
            <SchemeResultsList
              results={results}
              counts={counts}
              language={language}
              statusFilter={statusFilter}
              groupFilter={groupFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        </div>
      </main>

      {/* 4. Deep Navy Footer */}
      <Footer language={language} />
    </div>
  );
}
