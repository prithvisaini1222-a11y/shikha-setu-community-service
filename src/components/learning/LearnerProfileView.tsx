'use client';

import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  GraduationCap,
  Flame,
  Building,
  Calendar,
  Lock,
  Layers,
  CheckCircle2,
  Settings,
} from 'lucide-react';

interface LearnerProfileViewProps {
  currentClass: number;
  studentName: string;
  learnerProfile?: {
    displayName?: string;
    rollAlias?: string;
    institutionName?: string;
    streakDays?: number;
    classLevel?: number;
  };
  onChangeClass: () => void;
}

export function LearnerProfileView({
  currentClass,
  studentName,
  learnerProfile,
  onChangeClass,
}: LearnerProfileViewProps) {
  const [languagePref, setLanguagePref] = useState<'bilingual' | 'hindi' | 'english'>('bilingual');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);
  const [savedSettingsToast, setSavedSettingsToast] = useState<boolean>(false);

  const handleSavePref = () => {
    setSavedSettingsToast(true);
    setTimeout(() => setSavedSettingsToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              <User className="w-3.5 h-3.5" />
              Institutional Learner Identity
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#18261E] tracking-tight">
              {studentName}
            </h1>
            <p className="text-xs sm:text-sm text-[#4E5C53]">
              Active enrollment under institutional supervision for CBSE/NCERT Academic Session 2026–27.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onChangeClass}
              className="px-4 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] text-xs font-bold text-[#18261E] hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              Switch Class Level
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Institutional ID Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-4">
            <h2 className="text-base font-extrabold text-[#18261E] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#2E7D32]" />
              Enrollment Details
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              Verified
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-[#E2E8E0]/60">
              <span className="text-[#4E5C53] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2E7D32]" />
                Institutional Identifier:
              </span>
              <span className="font-mono font-bold text-[#18261E] bg-[#FAFBF9] px-2 py-0.5 rounded border border-[#E2E8E0]">
                {learnerProfile?.rollAlias || 'LRN-482'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E2E8E0]/60">
              <span className="text-[#4E5C53] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#2E7D32]" />
                Affiliated Institution:
              </span>
              <span className="font-bold text-[#18261E]">
                {learnerProfile?.institutionName || 'ShikshaSetu Learning Center'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E2E8E0]/60">
              <span className="text-[#4E5C53] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#2E7D32]" />
                Current Standard:
              </span>
              <span className="font-bold text-[#2E7D32]">
                Class {currentClass} NCERT (2026–27)
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E2E8E0]/60">
              <span className="text-[#4E5C53] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Learning Streak:
              </span>
              <span className="font-extrabold text-amber-600">
                {learnerProfile?.streakDays || 1} Day Active Streak 🔥
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-[#4E5C53] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2E7D32]" />
                Academic Session:
              </span>
              <span className="font-semibold text-[#18261E]">
                2026–2027 Baseline
              </span>
            </div>
          </div>
        </div>

        {/* Child Safety & Privacy Protection Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-4">
            <h2 className="text-base font-extrabold text-[#18261E] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              Child Safety & Privacy Standard
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
              POCSO Compliant
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#4E5C53] leading-relaxed">
            <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-1">
              <span className="font-bold text-[#18261E] block">
                1. Institutional Anonymization
              </span>
              <p>
                Student personal contact details (phone numbers, private emails, residential addresses) are never stored or exposed to volunteers, donors, or the public.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-1">
              <span className="font-bold text-[#18261E] block">
                2. Supervised Learning
              </span>
              <p>
                All doubt inquiries and live teaching sessions are conducted in institutional group settings under the direct supervision of registered coordinators.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-1">
              <span className="font-bold text-[#18261E] block">
                3. Zero Direct Adult-to-Child Messaging
              </span>
              <p>
                No unmonitored private communication channels exist between adult volunteers/donors and minors on ShikshaSetu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-extrabold text-[#18261E] flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#2E7D32]" />
              Video Lecture Preferences
            </h3>
            <p className="text-xs text-[#4E5C53]">
              Personalize video playback and bandwidth optimization.
            </p>
          </div>

          {savedSettingsToast && (
            <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Saved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#18261E] block">
              Default Lecture Language
            </label>
            <div className="flex items-center gap-2">
              {(['bilingual', 'hindi', 'english'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLanguagePref(lang);
                    handleSavePref();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    languagePref === lang
                      ? 'bg-[#2E7D32] text-white'
                      : 'bg-[#FAFBF9] border border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#18261E] block">
              Bandwidth Optimization (Community Hubs)
            </label>
            <label className="flex items-center gap-2 text-xs text-[#18261E] cursor-pointer">
              <input
                type="checkbox"
                checked={lowBandwidthMode}
                onChange={(e) => {
                  setLowBandwidthMode(e.target.checked);
                  handleSavePref();
                }}
                className="w-4 h-4 rounded text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <span>Prefer lighter stream qualities (360p / 480p) for slow internet</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

