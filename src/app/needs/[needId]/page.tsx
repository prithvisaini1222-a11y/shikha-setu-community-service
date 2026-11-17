import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { ProgressBar } from '@/components/ui/atoms';
import { SponsorNeedModal } from '@/components/donations/SponsorNeedModal';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default async function NeedDetailPage({
  params,
}: {
  params: Promise<{ needId: string }>;
}) {
  const { needId } = await params;

  const need = await prisma.institutionNeed.findUnique({
    where: { id: needId },
    include: {
      institution: true,
      donations: {
        include: { donor: { select: { name: true } } },
        orderBy: { initiatedAt: 'desc' },
      },
    },
  });

  if (!need) notFound();

  const remaining = Math.max(0, need.requiredQuantity - need.fulfilledQuantity);
  const percent = Math.min(100, Math.round((need.fulfilledQuantity / need.requiredQuantity) * 100));

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        <div>
          <Link
            href="/needs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4E] hover:underline mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Needs Board</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {need.urgency === 'URGENT' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F2C96D]" /> Urgent
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-[#4E5C53] border border-[#E2E8E0]">
                    Standard Need
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F4F7F4] text-[#4E5C53] border border-[#E2E8E0]">
                  {need.category.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#18261E] leading-tight">
                {need.title}
              </h1>
              <p className="text-xs text-[#4E5C53]">
                Published by <strong className="text-[#18261E]">{need.institution?.orgName}</strong> • {need.institution?.city}, {need.institution?.state}
              </p>
            </div>

            <SponsorNeedModal need={need} buttonLabel="Support this Need" />
          </div>
        </div>

        {/* Overview & Fulfillment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#18261E]">Requirement Overview</h2>
            <p className="text-xs sm:text-sm text-[#4E5C53] leading-relaxed whitespace-pre-line">
              {need.description}
            </p>

            <div className="pt-4 border-t border-[#E2E8E0]/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#4E5C53] block text-[11px]">Class Level:</span>
                <strong className="text-[#18261E] font-semibold">{need.classLevel ? `Class ${need.classLevel}` : 'General / Care Home'}</strong>
              </div>
              <div>
                <span className="text-[#4E5C53] block text-[11px]">Delivery Mode:</span>
                <strong className="text-[#18261E] font-semibold capitalize">{need.mode}</strong>
              </div>
              <div>
                <span className="text-[#4E5C53] block text-[11px]">Care Home Location:</span>
                <strong className="text-[#18261E] font-semibold">{need.location}</strong>
              </div>
            </div>
          </div>

          {/* Fulfillment Breakdown Card (Clean White) */}
          <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#4E5C53] uppercase tracking-wider block">
                Fulfilment Status
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Total Required:</span>
                  <strong className="text-[#18261E] font-bold">{need.requiredQuantity} units</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Pledged:</span>
                  <strong className="text-[#4B749F] font-bold">{need.fulfilledQuantity} units</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Verified Delivered:</span>
                  <strong className="text-[#2E7D4E] font-bold">{need.verifiedQuantity} units</strong>
                </div>
                <div className="flex justify-between border-t border-[#E2E8E0] pt-2">
                  <span className="text-[#4E5C53]">Remaining:</span>
                  <strong className="text-[#18261E] font-bold">{remaining} units</strong>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-[#4E5C53]">
                <span>Progress</span>
                <span className="font-semibold text-[#1B4D2F]">{percent}%</span>
              </div>
              <div className="w-full bg-[#F8FAF8] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#2E7D4E] h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Donation Transparency Timeline (Section 22: Pledged -> Received -> Verified -> Fulfilled) */}
        <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#18261E]">Donation Verification Lifecycle</h2>
              <p className="text-xs text-[#4E5C53]">Real-time tracking from donor commitment to classroom distribution.</p>
            </div>
            <span className="text-xs text-[#1B4D2F] font-semibold flex items-center gap-1 bg-[#EBF5EE] px-2.5 py-1 rounded-full border border-[#C6E6CD]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4E]" /> Verified Audit Trail
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            {(() => {
              const isPledged = need.fulfilledQuantity > 0;
              const isReceived = need.fulfilledQuantity > 0;
              const isVerified = need.verifiedQuantity > 0;
              const isFulfilled = need.verifiedQuantity >= need.requiredQuantity && need.requiredQuantity > 0;

              const stages = [
                {
                  id: 'pledged',
                  step: 'Pledged',
                  desc: 'Donor pledged units to care home',
                  status: isPledged ? (isReceived ? 'completed' : 'current') : 'current',
                },
                {
                  id: 'received',
                  step: 'Received',
                  desc: 'Materials delivered at care home',
                  status: isReceived ? (isVerified ? 'completed' : 'current') : 'upcoming',
                },
                {
                  id: 'verified',
                  step: 'Verified',
                  desc: 'Superintendent audited items',
                  status: isVerified ? (isFulfilled ? 'completed' : 'current') : 'upcoming',
                },
                {
                  id: 'fulfilled',
                  step: 'Fulfilled',
                  desc: 'Handed to students for study',
                  status: isFulfilled ? 'completed' : 'upcoming',
                },
              ];

              return stages.map((st) => {
                const isDone = st.status === 'completed';
                const isCurr = st.status === 'current';

                return (
                  <div
                    key={st.id}
                    className={`p-4 rounded-[12px] border text-xs space-y-1.5 transition-all duration-300 ${
                      isDone
                        ? 'bg-[#EBF5EE] border-[#C6E6CD] text-[#1B4D2F] font-semibold'
                        : isCurr
                        ? 'bg-[#EEF3F8] border-[#CFE0FA] text-[#18261E] font-bold ring-1 ring-[#4B749F]'
                        : 'bg-[#F4F7F4] border-[#E2E8E0] text-[#9CA3AF]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#2E7D4E]" />
                      ) : isCurr ? (
                        <span className="w-2 h-2 rounded-full bg-[#4B749F] animate-pulse" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      )}
                      <span>{st.step}</span>
                    </div>
                    <p className={`text-[11px] font-normal leading-tight ${isDone || isCurr ? 'text-[#4E5C53]' : 'text-[#9CA3AF]'}`}>
                      {st.desc}
                    </p>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Recent Community Pledges */}
        <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#18261E]">
            Recent Community Pledges ({need.donations.length})
          </h2>
          {need.donations.length === 0 ? (
            <p className="text-xs text-[#4E5C53]">No sponsorships yet. Be the first to pledge!</p>
          ) : (
            <div className="divide-y divide-[#E2E8E0]/60">
              {need.donations.map((d) => (
                <div key={d.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#18261E]">{d.donor.name}</span> pledged{' '}
                    <strong className="text-[#4B749F] font-bold">{d.quantity} units</strong> ({d.itemDescription})
                    {d.trackingNumber && (
                      <span className="text-[11px] text-[#9CA3AF] ml-2 font-mono">[{d.trackingNumber}]</span>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      d.status === 'INSTITUTION_VERIFIED'
                        ? 'bg-[#EBF5EE] text-[#1B4D2F]'
                        : 'bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9]'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
