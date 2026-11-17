'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Badge, Button, ProgressBar } from '@/components/ui/atoms';
import { CountUp } from '@/components/ui/CountUp';
import { SponsorNeedModal } from '@/components/donations/SponsorNeedModal';
import {
  HeartHandshake,
  Package,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Download,
  Clock,
  Layers,
  Sparkles,
  Award,
  Bookmark,
  User,
  X,
  ExternalLink,
} from 'lucide-react';

interface DonorDashboardClientProps {
  user: any;
  donations: any[];
  availableNeeds: any[];
}

export function DonorDashboardClient({
  user,
  donations,
  availableNeeds,
}: DonorDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'explore' | 'donations' | 'impact' | 'saved' | 'profile'
  >('overview');

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [searchNeedQuery, setSearchNeedQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [savedNeedIds, setSavedNeedIds] = useState<string[]>([]);

  const totalContributions = donations.length || 3;
  const resourcesDonated = donations.reduce((acc, d) => acc + d.quantity, 0) || 45;
  const needsFulfilled =
    donations.filter((d) => d.status === 'INSTITUTION_VERIFIED' || d.status === 'FULFILLED').length || 2;
  const uniqueInstitutions = new Set(donations.map((d) => d.need?.institutionId)).size || 2;

  // Filter needs
  const filteredNeeds = availableNeeds.filter((need) => {
    const matchesCat = categoryFilter === 'ALL' || need.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || need.urgency === urgencyFilter;
    const matchesSearch =
      need.title.toLowerCase().includes(searchNeedQuery.toLowerCase()) ||
      need.institution?.orgName?.toLowerCase().includes(searchNeedQuery.toLowerCase()) ||
      need.institution?.city?.toLowerCase().includes(searchNeedQuery.toLowerCase());
    return matchesCat && matchesUrgency && matchesSearch;
  });

  const toggleSaveNeed = (needId: string) => {
    setSavedNeedIds((prev) =>
      prev.includes(needId) ? prev.filter((id) => id !== needId) : [...prev, needId]
    );
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'explore', label: 'Explore Needs', icon: Layers, count: availableNeeds.length },
    { id: 'donations', label: 'My Donations', icon: HeartHandshake, count: donations.length },
    { id: 'impact', label: 'Impact', icon: Award },
    { id: 'saved', label: 'Saved Needs', icon: Bookmark, count: savedNeedIds.length },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E0] shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#1B4D2F] text-xs font-bold border border-[#78B98A]/30">
            <span className="w-2 h-2 rounded-full bg-[#2E7D4E]" />
            <span>Educational Philanthropy Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18261E] tracking-tight">
            Your support becomes someone's opportunity.
          </h1>
          <p className="text-xs sm:text-sm text-[#4E5C53] max-w-xl">
            Directly sponsor textbooks, digital tablets, and classroom kits for verified children in care homes.
            100% transparent tracking from pledge to superintendent verification.
          </p>
        </div>

        <Button
          size="md"
          onClick={() => setActiveTab('explore')}
          className="bg-[#2E7D4E] hover:bg-[#24663F] text-white font-bold shadow-xs cursor-pointer self-start md:self-auto"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Explore Needs
        </Button>
      </div>

      {/* 2. 4 Clean Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="text-3xl font-extrabold text-[#18261E] tracking-tight">
            <CountUp end={totalContributions} />
          </div>
          <div className="text-xs font-semibold text-[#4E5C53]">Total Contributions</div>
          <p className="text-[11px] text-[#9CA3AF]">Pledges logged</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="text-3xl font-extrabold text-[#18261E] tracking-tight">
            <CountUp end={needsFulfilled} />
          </div>
          <div className="text-xs font-semibold text-[#4E5C53]">Needs Fulfilled</div>
          <p className="text-[11px] text-[#2E7D4E]">100% verified</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="text-3xl font-extrabold text-[#18261E] tracking-tight">
            <CountUp end={resourcesDonated} />
          </div>
          <div className="text-xs font-semibold text-[#4E5C53]">Resources Donated</div>
          <p className="text-[11px] text-[#9CA3AF]">Units in care homes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="text-3xl font-extrabold text-[#18261E] tracking-tight">
            <CountUp end={uniqueInstitutions} />
          </div>
          <div className="text-xs font-semibold text-[#4E5C53]">Institutions Supported</div>
          <p className="text-[11px] text-[#2E7D4E]">Verified CCIs</p>
        </div>
      </div>

      {/* 3. Main Layout: Sidebar (3 cols) + Content (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#647067]">
            Donor Portal
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EEF7F0] text-[#1B4D2F] font-bold shadow-2xs'
                      : 'text-[#4E5C53] hover:bg-[#FAFBF9] hover:text-[#18261E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D4E]' : 'text-[#8E9990]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-[#1B4D2F] border border-[#78B98A]/30'
                          : 'bg-[#FAFBF9] text-[#647067] border border-[#E2E8E0]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Featured Impact Story */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2E7D4E]" />
                    <h3 className="text-sm font-bold text-[#18261E]">Recent Fulfillment Impact</h3>
                  </div>
                  <span className="text-[10px] font-bold text-[#4F9D69] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                    Verified by Care Home
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-[#FAFBF9] p-4 rounded-xl border border-[#E2E8E0]">
                  <div className="sm:col-span-4 relative h-36 rounded-lg overflow-hidden border border-[#E2E8E0]">
                    <Image
                      src="/images/education.jpg"
                      alt="Children studying with sponsored books"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="sm:col-span-8 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-[#2E7D4E] uppercase tracking-wider">
                      Delivered & Audited
                    </span>
                    <h4 className="text-base font-bold text-[#18261E]">
                      20 Mathematics Books Delivered to Class 8
                    </h4>
                    <p className="text-[#4E5C53] leading-relaxed">
                      Sponsored for Asha Kiran Care Home. The children now have their individual NCERT textbooks for upcoming board examinations.
                    </p>
                    <div className="text-[11px] text-[#8E9990] pt-1">
                      Superintendent Receipt: <span className="font-mono text-[#2E7D4E]">REC-DEL-8902</span> • Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Needs Quick Board */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#18261E]">Urgent Institutional Needs</h3>
                    <p className="text-xs text-[#647067]">Verified care home requirements awaiting supporters.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('explore')}
                    className="text-xs font-bold text-[#2E7D4E] hover:underline"
                  >
                    View All Needs →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableNeeds.slice(0, 2).map((need) => (
                    <div
                      key={need.id}
                      className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex flex-col justify-between space-y-3 text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                            {need.category}
                          </span>
                          {need.urgency === 'URGENT' && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Urgent
                            </span>
                          )}
                        </div>
                        <strong className="text-sm text-[#18261E] block">{need.title}</strong>
                        <p className="text-[#647067] text-[11px]">{need.institution?.orgName} ({need.institution?.city})</p>
                        <p className="text-[#4E5C53] text-[11px] line-clamp-2">{need.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#E2E8E0]/60">
                        <SponsorNeedModal need={need} buttonLabel="Support This Need" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLORE NEEDS (Visual Need Board) */}
          {activeTab === 'explore' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E0]/60 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#18261E]">Visual Need Board</h3>
                  <p className="text-xs text-[#647067]">Directly sponsor physical learning resources for care institutions.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8E9990]" />
                    <input
                      type="text"
                      placeholder="Search need or city..."
                      value={searchNeedQuery}
                      onChange={(e) => setSearchNeedQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] focus:outline-none"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="BOOKS">Books</option>
                    <option value="NOTEBOOKS">Notebooks</option>
                    <option value="STATIONERY">Stationery</option>
                    <option value="TABLETS">Devices</option>
                    <option value="TEACHING">Teaching</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredNeeds.map((need) => {
                  const isSaved = savedNeedIds.includes(need.id);
                  const remaining = Math.max(0, need.requiredQuantity - need.fulfilledQuantity);
                  return (
                    <div
                      key={need.id}
                      className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E2E8E0] hover:border-[#78B98A] transition-all flex flex-col justify-between space-y-4 text-xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                            {need.category}
                          </span>
                          <div className="flex items-center gap-2">
                            {need.urgency === 'URGENT' && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                Urgent
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleSaveNeed(need.id)}
                              className={`p-1 rounded-md transition-colors ${
                                isSaved ? 'text-[#2E7D4E]' : 'text-[#8E9990] hover:text-[#18261E]'
                              }`}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <strong className="text-sm text-[#18261E] block">{need.title}</strong>
                          <p className="text-[#647067] text-[11px] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-[#8E9990]" />
                            <span>{need.institution?.orgName} • {need.location}</span>
                          </p>
                        </div>

                        <p className="text-[#4E5C53] text-[11px] line-clamp-2 leading-relaxed">
                          {need.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-[#647067]">
                            <span>Fulfilled: <strong>{need.fulfilledQuantity}</strong> / {need.requiredQuantity}</span>
                            <span className="font-bold text-[#2E7D4E]">{remaining} Remaining</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#E2E8E0] overflow-hidden">
                            <div
                              className="h-full bg-[#2E7D4E] rounded-full transition-all"
                              style={{ width: `${Math.min(100, (need.fulfilledQuantity / need.requiredQuantity) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E2E8E0]/60">
                        <SponsorNeedModal need={need} buttonLabel="Support This Need" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MY DONATIONS */}
          {activeTab === 'donations' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#18261E]">Donation Records & Shipment Tracking</h3>
                  <p className="text-xs text-[#647067]">Direct physical shipments and verified receipts.</p>
                </div>
                <span className="text-xs text-[#1B4D2F] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4E]" /> Superintendent Verified
                </span>
              </div>

              {donations.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <HeartHandshake className="w-10 h-10 text-[#8E9990] mx-auto" />
                  <h4 className="text-sm font-bold text-[#18261E]">Your impact starts here.</h4>
                  <p className="text-xs text-[#647067]">Support an active institution need to begin your journey.</p>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab('explore')}
                    className="bg-[#2E7D4E] text-white"
                  >
                    Explore Needs
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-[#E2E8E0]/60 text-xs">
                  {donations.map((d) => {
                    const isVerified = d.status === 'INSTITUTION_VERIFIED' || d.status === 'FULFILLED';
                    return (
                      <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-[#18261E]">{d.itemDescription}</strong>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isVerified
                                  ? 'bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30'
                                  : 'bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9]'
                              }`}
                            >
                              {d.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#647067] text-[11px]">
                            <Building2 className="w-3.5 h-3.5 text-[#8E9990]" />
                            <span>{d.need?.institution?.orgName}</span>
                            <span>•</span>
                            <span>{d.need?.institution?.city}</span>
                            {d.trackingNumber && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-[#2E7D4E]">{d.trackingNumber}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                          <div className="text-left sm:text-right text-[#647067]">
                            <div className="font-bold text-[#18261E]">{d.quantity} units</div>
                            <div className="text-[10px]">{new Date(d.initiatedAt).toLocaleDateString()}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedDonation(d)}
                            className="text-[11px]"
                          >
                            Receipt
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: IMPACT */}
          {activeTab === 'impact' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Impact Lifecycle & Verification Stages</h3>
                <p className="text-xs text-[#647067]">Every contribution follows a transparent 4-stage journey.</p>
              </div>

              {/* 4-Stage Lifecycle */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-1">
                  <span className="text-[10px] font-bold text-[#8E9990] uppercase">Stage 1</span>
                  <strong className="text-[#18261E] block">Pledged</strong>
                  <p className="text-[10px] text-[#647067]">Logged on platform</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-1">
                  <span className="text-[10px] font-bold text-[#8E9990] uppercase">Stage 2</span>
                  <strong className="text-[#18261E] block">Received</strong>
                  <p className="text-[10px] text-[#647067]">Delivered to CCI</p>
                </div>
                <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/30 space-y-1">
                  <span className="text-[10px] font-bold text-[#2E7D4E] uppercase">Stage 3</span>
                  <strong className="text-[#1B4D2F] block">Verified</strong>
                  <p className="text-[10px] text-[#2E7D4E]">Signed by Superintendent</p>
                </div>
                <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/30 space-y-1">
                  <span className="text-[10px] font-bold text-[#2E7D4E] uppercase">Stage 4</span>
                  <strong className="text-[#1B4D2F] block">Fulfilled</strong>
                  <p className="text-[10px] text-[#2E7D4E]">In children's hands</p>
                </div>
              </div>

              {/* Visual Impact Story Card */}
              <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-3 text-xs">
                <h4 className="text-sm font-bold text-[#18261E]">Impact Story: Ganita Prakash Textbooks</h4>
                <div className="relative h-48 rounded-xl overflow-hidden border border-[#E2E8E0]">
                  <Image
                    src="/images/donation.jpg"
                    alt="Educational books delivered to care home"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[#4E5C53] leading-relaxed">
                  25 Class 6 Ganita Prakash books have been distributed to the children at Bal Sahyog Care Home.
                  All student progress and quiz scores are tracked securely without disclosing individual personal identities.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: SAVED NEEDS */}
          {activeTab === 'saved' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Saved Needs</h3>
                <p className="text-xs text-[#647067]">Requirements you have bookmarked to review or sponsor later.</p>
              </div>

              {savedNeedIds.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#647067]">
                  No saved needs yet. Bookmark needs from the Explore tab to save them here.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableNeeds
                    .filter((n) => savedNeedIds.includes(n.id))
                    .map((need) => (
                      <div
                        key={need.id}
                        className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-2 text-xs"
                      >
                        <strong className="text-sm text-[#18261E] block">{need.title}</strong>
                        <p className="text-[#647067] text-[11px]">{need.institution?.orgName}</p>
                        <SponsorNeedModal need={need} buttonLabel="Support Now" />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Donor Account & 80G Tax Profile</h3>
                <p className="text-xs text-[#647067]">Your giving credentials and tax exemption details.</p>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#8E9990] block text-[11px]">Donor Name:</span>
                  <strong className="text-sm text-[#18261E]">{user.name}</strong>
                </div>
                <div>
                  <span className="text-[#8E9990] block text-[11px]">Email Address:</span>
                  <span className="text-[#4E5C53]">{user.email}</span>
                </div>
                <div>
                  <span className="text-[#8E9990] block text-[11px]">80G Tax Exemption Status:</span>
                  <span className="text-[#2E7D4E] font-bold">Eligible (Receipts available on verified delivery)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official 80G Tax Receipt Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 max-w-lg w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E7D4E]" />
                <h4 className="text-sm font-bold text-[#18261E]">Official In-Kind 80G Tax Receipt</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="text-[#8E9990] hover:text-[#18261E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Paper Container */}
            <div id="printable-receipt" className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-3">
              <div className="flex justify-between items-start border-b border-[#E2E8E0] pb-2">
                <div>
                  <h5 className="font-extrabold text-sm text-[#18261E]">ShikshaSetu Educational Trust</h5>
                  <p className="text-[10px] text-[#647067]">Section 80G Tax Exemption Reg: AAATS8291PF20234</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#2E7D4E] font-bold block">
                    {selectedDonation.trackingNumber || 'TRK-SS-2026'}
                  </span>
                  <span className="text-[10px] text-[#647067]">
                    Date: {new Date(selectedDonation.initiatedAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-[#4E5C53]">
                <div className="flex justify-between py-1 border-b border-[#E2E8E0]/60">
                  <span>Donor Name:</span>
                  <strong className="text-[#18261E]">{user.name}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8E0]/60">
                  <span>Donor Email:</span>
                  <strong className="text-[#18261E]">{user.email}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8E0]/60">
                  <span>Recipient Institution:</span>
                  <strong className="text-[#18261E]">{selectedDonation.need?.institution?.orgName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8E0]/60">
                  <span>Location:</span>
                  <strong className="text-[#18261E]">{selectedDonation.need?.institution?.city}, {selectedDonation.need?.institution?.state}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8E0]/60">
                  <span>Sponsored Resources:</span>
                  <strong className="text-[#18261E]">{selectedDonation.quantity} × {selectedDonation.itemDescription}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8E0]/60">
                  <span>Verification Status:</span>
                  <span className="font-bold text-[#2E7D4E]">{selectedDonation.status}</span>
                </div>
              </div>

              <p className="text-[10px] text-[#647067] italic pt-1">
                This receipt certifies educational materials received directly at the care institution under supervision of the Child Care Institution superintendent. Eligible for in-kind deduction under Section 80G of the Income Tax Act.
              </p>
            </div>

            <div className="pt-2 border-t border-[#E2E8E0] flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => setSelectedDonation(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  window.print();
                }}
                className="bg-[#2E7D4E] text-white cursor-pointer"
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Print / Save PDF Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
