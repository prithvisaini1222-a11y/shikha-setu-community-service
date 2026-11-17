import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { ProgressBar } from '@/components/ui/atoms';
import { SponsorNeedModal } from '@/components/donations/SponsorNeedModal';
import { Search, Building2, CheckCircle2, AlertCircle, Inbox, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NeedsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const urgencyFilter = typeof resolvedSearchParams.urgency === 'string' ? resolvedSearchParams.urgency : undefined;
  const searchQuery = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q.toLowerCase() : undefined;

  const whereClause: any = {};
  if (categoryFilter && categoryFilter !== 'ALL') {
    if (categoryFilter === 'URGENT') {
      whereClause.urgency = 'URGENT';
    } else if (categoryFilter === 'EDUCATION') {
      whereClause.category = { in: ['EDUCATIONAL_KITS', 'BOOKS', 'STATIONERY'] };
    } else {
      whereClause.category = categoryFilter;
    }
  }
  if (urgencyFilter && urgencyFilter !== 'ALL') {
    whereClause.urgency = urgencyFilter;
  }

  const needs = await prisma.institutionNeed.findMany({
    where: whereClause,
    include: {
      institution: {
        select: {
          orgName: true,
          city: true,
          state: true,
          verificationStatus: true,
        },
      },
      donations: {
        take: 3,
        orderBy: { initiatedAt: 'desc' },
      },
    },
    orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
  });

  const filteredNeeds = searchQuery
    ? needs.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery) ||
          n.description.toLowerCase().includes(searchQuery) ||
          n.institution.orgName.toLowerCase().includes(searchQuery)
      )
    : needs;

  const filterTabs = [
    { id: 'ALL', label: 'All Needs' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'BOOKS', label: 'Books' },
    { id: 'STATIONERY', label: 'Stationery' },
    { id: 'TABLETS', label: 'Devices' },
    { id: 'TEACHING', label: 'Teaching' },
    { id: 'URGENT', label: 'Urgent Needs' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        {/* Header with Subtle Fade In */}
        <div className="space-y-2 animate-fade-in stagger-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F7F4] border border-[#E2E8E0] text-xs font-semibold text-[#4E5C53]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D4E]" />
            <span>Verified Need Board</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#18261E] tracking-tight">
                Needs that matter right now.
              </h1>
              <p className="text-xs sm:text-sm text-[#4E5C53] mt-1.5 max-w-2xl leading-relaxed">
                Direct educational requirements posted by verified Child Care Institutions. Every contribution is tracked until verified delivery.
              </p>
            </div>
            <div className="text-xs text-[#4E5C53] bg-white px-3.5 py-2 rounded-[10px] border border-[#E2E8E0] shadow-2xs self-start md:self-auto card-interactive">
              Active Needs: <strong className="text-[#18261E] font-bold">{filteredNeeds.length}</strong>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3 animate-fade-in stagger-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <form method="GET" action="/needs">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery || ''}
                placeholder="Search by book title, grade, or institution..."
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#E2E8E0] rounded-[10px] bg-white text-[#18261E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 shadow-xs transition-all"
              />
            </form>
          </div>

          {/* Filter Pills with Micro-Interactions */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            {filterTabs.map((tab) => {
              const isActive = (!categoryFilter && tab.id === 'ALL') || categoryFilter === tab.id;
              const isUrgentTab = tab.id === 'URGENT';
              return (
                <Link
                  key={tab.id}
                  href={tab.id === 'ALL' ? '/needs' : `/needs?category=${tab.id}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-[#2E7D4E] text-white shadow-xs scale-105'
                      : isUrgentTab
                      ? 'bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9] hover:bg-[#FDF4DC] hover:-translate-y-px'
                      : 'bg-white text-[#4E5C53] border border-[#E2E8E0] hover:bg-[#F4F7F4] hover:text-[#18261E] hover:-translate-y-px'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Needs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNeeds.length === 0 ? (
            <div className="col-span-3 bg-white p-12 rounded-[16px] border border-[#E2E8E0] text-center space-y-3 shadow-xs animate-fade-in">
              <div className="w-12 h-12 rounded-[12px] bg-[#F8FAF8] border border-[#E2E8E0] text-[#9CA3AF] flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#18261E]">No active requirements found</h4>
              <p className="text-xs text-[#4E5C53]">Try adjusting your search keywords or filter category.</p>
            </div>
          ) : (
            filteredNeeds.map((need, index) => {
              const percent = Math.min(100, Math.round((need.fulfilledQuantity / need.requiredQuantity) * 100));
              const isUrgent = need.urgency === 'URGENT';

              return (
                /* Requirement 37: Need Card Hover (card lifts, fulfilment bar brightens, CTA emphasized) */
                <div
                  key={need.id}
                  className={`bg-white rounded-[16px] border border-[#E2E8E0] shadow-xs p-6 flex flex-col justify-between space-y-5 card-interactive group animate-fade-in stagger-${(index % 4) + 1}`}
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Urgent Indicator & Required Qty */}
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

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-[#18261E] leading-snug group-hover:text-[#2E7D4E] transition-colors">
                        {need.title}
                      </h3>
                      <p className="text-xs text-[#4E5C53] mt-1 line-clamp-2 leading-relaxed">
                        {need.description}
                      </p>
                    </div>

                    {/* Verified Institution Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-[#4E5C53] bg-[#F4F7F4] p-2.5 rounded-[10px] border border-[#E2E8E0]/80 transition-colors group-hover:bg-[#F8FAF8]">
                      <Building2 className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                      <span className="font-semibold text-[#18261E] truncate">{need.institution.orgName}</span>
                      <span className="text-[#1B4D2F] text-[11px] font-semibold shrink-0 ml-auto flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2E7D4E]" /> Verified Institution
                      </span>
                    </div>

                    {/* Requirement 37: Fulfilment progress brightens slightly on card hover */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs text-[#4E5C53]">
                        <span>Fulfilment</span>
                        <span className="font-semibold text-[#1B4D2F]">{percent}% fulfilled</span>
                      </div>
                      <div className="w-full bg-[#F8FAF8] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#2E7D4E] group-hover:bg-[#24663F] group-hover:brightness-105 h-2 rounded-full transition-all duration-700 ease-out"
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
                    <div className="transition-transform duration-200 group-hover:scale-[1.02]">
                      <SponsorNeedModal need={need} buttonLabel="Support this Need" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
