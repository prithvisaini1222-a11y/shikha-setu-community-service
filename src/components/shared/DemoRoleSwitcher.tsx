'use client';

import React, { useTransition } from 'react';
import { switchDemoRoleAction } from '@/actions/auth';
import { Shield, Building2, GraduationCap, HeartHandshake, BookOpen, Loader2, Sparkles } from 'lucide-react';
import { UserRole } from '@prisma/client';

interface DemoRoleSwitcherProps {
  currentRole?: UserRole | null;
  userName?: string | null;
}

export function DemoRoleSwitcher({ currentRole, userName }: DemoRoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTarget, setActiveTarget] = React.useState<string | null>(null);

  const roles = [
    { id: 'admin', label: 'Admin', role: UserRole.ADMIN, icon: Shield },
    { id: 'institution', label: 'Institution', role: UserRole.INSTITUTION, icon: Building2 },
    { id: 'volunteer', label: 'Volunteer', role: UserRole.VOLUNTEER, icon: GraduationCap },
    { id: 'donor', label: 'Donor', role: UserRole.DONOR, icon: HeartHandshake },
    { id: 'learner', label: 'Learner', role: UserRole.LEARNER, icon: BookOpen },
  ];

  const handleSwitch = (roleId: 'admin' | 'institution' | 'volunteer' | 'donor' | 'learner') => {
    setActiveTarget(roleId);
    startTransition(async () => {
      await switchDemoRoleAction(roleId);
      setActiveTarget(null);
    });
  };

  return (
    <div className="bg-white text-[#25352B] border border-[#E2E8E0] rounded-xl text-xs py-2 px-3 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#4F9D69] border border-[#78B98A]/30 tracking-tight">
            <Sparkles className="w-3 h-3 text-[#4F9D69]" />
            Developer Emulation
          </span>
          <span className="text-[11px] text-[#647067] hidden sm:inline">
            Emulate View As:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] text-[#647067] font-semibold mr-1 hidden md:inline shrink-0">
            Switch Role (Dev):
          </span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.role;
            const isLoading = isPending && activeTarget === r.id;

            return (
              <button
                key={r.id}
                type="button"
                disabled={isPending}
                onClick={() => handleSwitch(r.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50 ${
                  isActive
                    ? 'bg-[#2E7D4E] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#EBF5EE] text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-current" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
