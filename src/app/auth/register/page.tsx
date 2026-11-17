'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { registerAction } from '@/actions/auth';
import { UserRole } from '@prisma/client';
import { Button } from '@/components/ui/atoms';
import { Building2, GraduationCap, HeartHandshake, BookOpen, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.VOLUNTEER);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await registerAction(fd);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  const roleConfigs = [
    { role: UserRole.VOLUNTEER, label: 'Volunteer Teacher', icon: GraduationCap, desc: 'Offer live classes, mentoring, and notes.' },
    { role: UserRole.INSTITUTION, label: 'Child Care Inst. (CCI)', icon: Building2, desc: 'Post needs and coordinate classes.' },
    { role: UserRole.DONOR, label: 'Donor / Sponsor', icon: HeartHandshake, desc: 'Sponsor books, kits, and tablets.' },
    { role: UserRole.LEARNER, label: 'Student / Learner', icon: BookOpen, desc: 'Class 6-10 video lessons & quizzes.' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8FAF8]">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-[10px] bg-[#2E7D4E] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-xs">
            श
          </div>
          <h1 className="text-2xl font-bold text-[#18261E] tracking-tight">Join ShikshaSetu</h1>
          <p className="text-xs text-[#4E5C53]">
            Select your role in India&apos;s verified educational network.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {roleConfigs.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => setSelectedRole(item.role)}
                className={`p-3 rounded-[12px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'border-[#2E7D4E] bg-[#EBF5EE] text-[#1B4D2F] font-semibold'
                    : 'border-[#E2E8E0] bg-white hover:bg-[#F4F7F4] text-[#4E5C53]'
                }`}
              >
                <div
                  className={`p-2 rounded-[8px] ${
                    isSelected ? 'bg-[#2E7D4E] text-white' : 'bg-[#F4F7F4] text-[#4E5C53]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
          {error && (
            <div className="p-3 rounded-[10px] bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <input type="hidden" name="role" value={selectedRole} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                  Full Name / Contact Person
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Smt. Neha Gupta"
                  className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-[10px] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 bg-[#F4F7F4] text-[#18261E] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="user@example.org"
                  className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-[10px] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 bg-[#F4F7F4] text-[#18261E] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-[10px] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 bg-[#F4F7F4] text-[#18261E] focus:bg-white transition-all"
              />
            </div>

            {/* Role-Specific Custom Fields */}
            {selectedRole === UserRole.INSTITUTION && (
              <div className="p-4 rounded-[12px] bg-[#F4F7F4] border border-[#E2E8E0] space-y-3">
                <span className="text-xs font-semibold text-[#18261E] uppercase tracking-wider block">
                  Child Care Institution License Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#4E5C53] mb-1">Organization Name</label>
                    <input
                      type="text"
                      name="orgName"
                      placeholder="e.g. Bal Bhavan Society"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E2E8E0] rounded-[8px] focus:outline-none focus:border-[#2E7D4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4E5C53] mb-1">Govt Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      placeholder="e.g. DL-CCI-2023-4412"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E2E8E0] rounded-[8px] focus:outline-none focus:border-[#2E7D4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4E5C53] mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. New Delhi"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E2E8E0] rounded-[8px] focus:outline-none focus:border-[#2E7D4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4E5C53] mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="e.g. Delhi"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E2E8E0] rounded-[8px] focus:outline-none focus:border-[#2E7D4E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === UserRole.VOLUNTEER && (
              <div className="p-4 rounded-[12px] bg-[#F4F7F4] border border-[#E2E8E0] space-y-3">
                <span className="text-xs font-semibold text-[#18261E] uppercase tracking-wider block">
                  Volunteer Teaching Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#4E5C53] mb-1">Primary Subjects</label>
                    <input
                      type="text"
                      name="subjects"
                      placeholder="e.g. Mathematics, Science"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E2E8E0] rounded-[8px] focus:outline-none focus:border-[#2E7D4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4E5C53] mb-1">Target Classes (e.g. 6,7,8)</label>
                    <input
                      type="text"
                      name="classes"
                      defaultValue="6,7,8"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E2E8E0] rounded-[8px] focus:outline-none focus:border-[#2E7D4E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === UserRole.LEARNER && (
              <div className="p-4 rounded-[12px] bg-[#F4F7F4] border border-[#E2E8E0] space-y-3">
                <span className="text-xs font-semibold text-[#18261E] uppercase tracking-wider block">
                  Learner Academic Class
                </span>
                <div>
                  <label className="block text-[11px] font-medium text-[#4E5C53] mb-1">Select Current Class</label>
                  <select
                    name="classLevel"
                    defaultValue="8"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#E2E8E0] rounded-[8px] focus:outline-none focus:border-[#2E7D4E]"
                  >
                    <option value="6">Class 6 (Middle School)</option>
                    <option value="7">Class 7 (Middle School)</option>
                    <option value="8">Class 8 (Pre-Secondary)</option>
                    <option value="9">Class 9 (Secondary)</option>
                    <option value="10">Class 10 (Board Prep)</option>
                  </select>
                </div>
                <p className="text-[11px] text-[#4E5C53]">
                  Note: In compliance with Child Safety guidelines, no personal phone numbers or home addresses are collected.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isPending}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="pt-4 border-t border-[#E2E8E0]/60 text-center text-xs text-[#4E5C53]">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-[#2E7D4E] hover:underline">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
