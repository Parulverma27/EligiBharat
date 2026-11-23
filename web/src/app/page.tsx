"use client";

import React, { useMemo, useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { Navbar } from "@/components/Navbar";
import { ProfileForm } from "@/components/ProfileForm";
import { SchemeResultsList } from "@/components/SchemeResultsList";
import { EMPTY_PROFILE, evaluateAllSchemes } from "@/lib/checker";
import { SCHEMES_DATA } from "@/lib/schemesData";
import type { Language, UserProfile } from "@/types/scheme";

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);

  const { counts, results } = useMemo(
    () => evaluateAllSchemes(profile),
    [profile]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        totalSchemes={SCHEMES_DATA.length}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar: Editable Citizen Profile */}
          <div className="lg:col-span-4">
            <ProfileForm
              profile={profile}
              language={language}
              onChange={setProfile}
              onReset={() => setProfile(EMPTY_PROFILE)}
            />
          </div>

          {/* Right Area: Bilingual Conversational Assistant + Scheme Result Cards */}
          <div className="lg:col-span-8 space-y-5">
            <ChatPanel
              profile={profile}
              language={language}
              onProfileUpdate={setProfile}
              onLanguageDetected={setLanguage}
            />
            <SchemeResultsList
              results={results}
              counts={counts}
              language={language}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
