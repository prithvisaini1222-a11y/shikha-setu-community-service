import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { ProgressBar } from '@/components/ui/atoms';
import { SponsorNeedModal } from '@/components/donations/SponsorNeedModal';
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
  PackageCheck,
  Clock,
  Check,
  BookOpen,
  Backpack,
  Laptop,
  HeartHandshake,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DonatePage() {
  const resourceNeeds = await prisma.institutionNeed.findMany({
    where: {
      category: { notIn: ['TEACHING', 'MENTORING'] },
      status: { in: ['OPEN', 'PARTIALLY_FULFILLED'] },
    },
    include: {
      institution: true,
    },
    orderBy: { urgency: 'desc' },
  });

  const contributionActions = [
    {
      icon: BookOpen,
      title: 'Books',
      desc: 'Class 6–10 NCERT textbooks, reference material & library books.',
      filter: 'BOOKS',
    },
    {
      icon: Backpack,
      title: 'Study Material',
      desc: 'Notebooks, geometry kits, school bags, and examination stationery.',
      filter: 'STATIONERY',
    },
    {
      icon: Laptop,
      title: 'Devices',
      desc: 'Refurbished tablets and laptops for interactive digital learning.',
      filter: 'TABLETS',
    },
    {
      icon: HeartHandshake,
      title: 'Sponsor a Need',
      desc: 'Sponsor science laboratory kits and structured classroom essentials.',
      filter: 'EDUCATIONAL_KITS',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
        {/* Header with Staggered Entrance */}
        <div className="max-w-3xl space-y-2 animate-fade-in stagger-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F7F4] border border-[#E2E8E0] text-xs font-semibold text-[#4E5C53]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D4E]" />
            <span>Calm & Verified Giving</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#18261E] tracking-tight">
            Make your contribution count.
          </h1>
          <p className="text-xs sm:text-sm text-[#4E5C53] leading-relaxed">
            ShikshaSetu enables direct material and equipment sponsorship for verified Child Care Institutions. Every item is tracked until physical inspection and superintendent verification.
          </p>
        </div>

        {/* Four Action Cards on White Background with Interactive Lift */}
        <div className="space-y-4 animate-fade-in stagger-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#4E5C53]">
            Ways to Contribute
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contributionActions.map((cat, i) => (
              <Link
                key={i}
                href={`/needs?category=${cat.filter}`}
                className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs hover:border-[#2E7D4E]/50 card-interactive flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#EBF5EE] border border-[#C6E6CD] flex items-center justify-center text-[#2E7D4E] group-hover:bg-[#2E7D4E] group-hover:text-white transition-all duration-200">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#18261E] group-hover:text-[#2E7D4E] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#4E5C53] leading-relaxed">{cat.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E8E0]/60 flex items-center justify-between text-xs font-semibold text-[#2E7D4E]">
                  <span>Explore Needs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Requirement 21: DONATION TIMELINE ANIMATION (Pledged -> Received -> Verified -> Fulfilled) */}
        <div className="bg-white border border-[#E2E8E0] rounded-[16px] p-6 sm:p-8 space-y-6 shadow-xs card-interactive animate-fade-in stagger-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8E0] pb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#18261E]">
                Transparent Fulfillment Pipeline
              </h3>
              <p className="text-xs text-[#4E5C53] mt-0.5">
                Real-time tracking from initial donor commitment to student hand-off.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#1B4D2F] bg-[#EBF5EE] px-2.5 py-0.5 rounded-full border border-[#C6E6CD] flex items-center gap-1 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4E]" /> 100% Verifiable Chain of Custody
            </span>
          </div>

          {/* Connected Steps Progress Bar */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  stage: '01',
                  title: 'Pledged',
                  desc: 'Donor registers intent & item specifications',
                  status: 'Completed',
                  isCompleted: true,
                  isCurrent: false,
                },
                {
                  stage: '02',
                  title: 'Received',
                  desc: 'Dispatched package arrives at care institution',
                  status: 'Delivered & Staged',
                  isCompleted: true,
                  isCurrent: false,
                },
                {
                  stage: '03',
                  title: 'Verified',
                  desc: 'Superintendent inspects quality & count',
                  status: 'Current Inspection',
                  isCompleted: false,
                  isCurrent: true,
                },
                {
                  stage: '04',
                  title: 'Fulfilled',
                  desc: 'Items issued to children; impact logged',
                  status: 'Upcoming Hand-off',
                  isCompleted: false,
                  isCurrent: false,
                },
              ].map((step) => (
                <div
                  key={step.stage}
                  className={`p-4 rounded-[12px] border space-y-2 relative transition-all duration-300 card-interactive ${
                    step.isCurrent
                      ? 'bg-[#EEF3F8] border-[#4B749F] timeline-active-pulse'
                      : step.isCompleted
                      ? 'bg-[#F4F7F4] border-[#E2E8E0]'
                      : 'bg-[#F4F7F4]/50 border-[#E2E8E0]/60 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#4E5C53]">{step.stage}</span>
                    {step.isCompleted ? (
                      <span className="w-5 h-5 rounded-full bg-[#EBF5EE] text-[#1B4D2F] flex items-center justify-center border border-[#C6E6CD] animate-check-pop">
                        <Check className="w-3 h-3 text-[#1B4D2F]" />
                      </span>
                    ) : step.isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4B749F] animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#E2E8E0]" />
                    )}
                  </div>
                  <div className="text-sm font-bold text-[#18261E]">{step.title}</div>
                  <p className="text-[11px] text-[#4E5C53] leading-relaxed">{step.desc}</p>
                  <div
                    className={`text-[10px] font-semibold pt-1 ${
                      step.isCompleted
                        ? 'text-[#1B4D2F]'
                        : step.isCurrent
                        ? 'text-[#4B749F] font-bold'
                        : 'text-[#9CA3AF]'
                    }`}
                  >
                    {step.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Requirements Grid with Card Hover effects */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#18261E]">
                Active Care Home Requirements ({resourceNeeds.length})
              </h2>
              <p className="text-xs text-[#4E5C53]">Verified physical needs awaiting direct sponsorship.</p>
            </div>
            <Link
              href="/needs"
              className="text-xs font-semibold text-[#2E7D4E] hover:underline flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceNeeds.map((need, index) => {
              const isUrgent = need.urgency === 'URGENT';
              const percent = Math.min(100, Math.round((need.fulfilledQuantity / need.requiredQuantity) * 100));

              return (
                <div
                  key={need.id}
                  className={`bg-white rounded-[16px] border border-[#E2E8E0] shadow-xs p-6 flex flex-col justify-between space-y-5 card-interactive animate-fade-in stagger-${(index % 4) + 1}`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      {isUrgent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F2C96D] animate-pulse" />
                          Urgent
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F4F7F4] text-[#4E5C53] border border-[#E2E8E0]">
                          {need.category.replace('_', ' ')}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[#18261E]">
                        {need.requiredQuantity} needed
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#18261E] leading-snug">
                        {need.title}
                      </h3>
                      <p className="text-xs text-[#4E5C53] mt-1 line-clamp-2 leading-relaxed">
                        {need.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#4E5C53] bg-[#F4F7F4] p-2.5 rounded-[10px] border border-[#E2E8E0]/80">
                      <Building2 className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                      <span className="font-semibold text-[#18261E] truncate">{need.institution.orgName}</span>
                      <span className="text-[#1B4D2F] text-[11px] font-semibold shrink-0 ml-auto flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2E7D4E]" /> Verified
                      </span>
                    </div>

                    {/* Green Fulfilment Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs text-[#4E5C53]">
                        <span>Fulfilment</span>
                        <span className="font-semibold text-[#1B4D2F]">{percent}% fulfilled</span>
                      </div>
                      <div className="w-full bg-[#F8FAF8] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#2E7D4E] h-2 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#E2E8E0]/60 flex items-center justify-between gap-3">
                    <Link
                      href={`/needs/${need.id}`}
                      className="text-xs font-semibold text-[#4E5C53] hover:text-[#18261E] transition-colors"
                    >
                      View Details
                    </Link>
                    <SponsorNeedModal need={need} buttonLabel="Support this Need" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
