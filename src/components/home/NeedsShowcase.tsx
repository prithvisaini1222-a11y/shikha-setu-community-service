'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Briefcase,
  Tablet,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { ProgressBar, Button } from '@/components/ui/atoms';

interface NeedItem {
  id: string;
  title: string;
  category: string;
  institution: string;
  location: string;
  required: number;
  fulfilled: number;
  unit: string;
  urgency: 'URGENT' | 'HIGH' | 'MODERATE';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function NeedsShowcase() {
  const [selectedNeed, setSelectedNeed] = useState<NeedItem | null>(null);
  const [pledgeQuantity, setPledgeQuantity] = useState<number>(1);
  const [isPledged, setIsPledged] = useState<boolean>(false);

  const needsList: NeedItem[] = [
    {
      id: 'need-1',
      title: 'Class 8 Mathematics Books',
      category: 'Curriculum Textbooks',
      institution: 'Asha Kiran Children Home',
      location: 'New Delhi',
      required: 15,
      fulfilled: 9,
      unit: 'Books',
      urgency: 'URGENT',
      icon: BookOpen,
      description: 'Standard NCERT Mathematics textbooks for incoming Class 8 batch. Enables homework and chapter exercises.',
    },
    {
      id: 'need-2',
      title: 'School Bags & Stationery Kits',
      category: 'Essential School Kits',
      institution: 'Prerna Bal Sadan',
      location: 'Jaipur, Rajasthan',
      required: 30,
      fulfilled: 18,
      unit: 'Bags',
      urgency: 'HIGH',
      icon: Briefcase,
      description: 'Durable water-resistant school bags containing notebooks, geometry sets, and pens for primary & middle schoolers.',
    },
    {
      id: 'need-3',
      title: 'Digital Learning Devices',
      category: 'Educational Hardware',
      institution: 'Snehalaya Care Society',
      location: 'Pune, Maharashtra',
      required: 3,
      fulfilled: 1,
      unit: 'Tablets',
      urgency: 'HIGH',
      icon: Tablet,
      description: 'Android tablets for group digital literacy, coding sessions, and accessing curated video lessons.',
    },
  ];

  const handleOpenPledge = (need: NeedItem) => {
    setSelectedNeed(need);
    setPledgeQuantity(1);
    setIsPledged(false);
  };

  const handleConfirmPledge = () => {
    setIsPledged(true);
    setTimeout(() => {
      // Auto close after celebrating
      setTimeout(() => {
        setSelectedNeed(null);
        setIsPledged(false);
      }, 1600);
    }, 400);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {needsList.map((need) => {
          const Icon = need.icon;
          const percentage = Math.round((need.fulfilled / need.required) * 100);
          const remaining = need.required - need.fulfilled;

          return (
            <div
              key={need.id}
              className="bg-white rounded-2xl border border-[#E2E8E0] shadow-xs p-6 space-y-5 card-interactive flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header with icon & badge */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5EE] text-[#2E7D4E] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      need.urgency === 'URGENT'
                        ? 'bg-[#FEF9ED] text-[#966F1C] border-[#FDE5A9]'
                        : 'bg-[#EEF3F8] text-[#2E4864] border-[#C9DCF5]'
                    }`}
                  >
                    {need.urgency === 'URGENT' ? 'Urgent Need' : 'Active Requirement'}
                  </span>
                </div>

                {/* Need Title & Description */}
                <div>
                  <h4 className="text-base font-bold text-[#18261E] group-hover:text-[#2E7D4E] transition-colors">
                    {need.title}
                  </h4>
                  <p className="text-xs text-[#4E5C53] leading-relaxed mt-1">
                    {need.description}
                  </p>
                </div>

                {/* Fulfilment Progress */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#18261E]">
                      {need.fulfilled} / {need.required} {need.unit}
                    </span>
                    <span className="font-bold text-[#2E7D4E]">{percentage}% Fulfilled</span>
                  </div>
                  <ProgressBar
                    value={need.fulfilled}
                    max={need.required}
                    label={`${need.fulfilled} of ${need.required}`}
                    color={percentage >= 100 ? 'bg-[#2E7D4E]' : 'bg-[#2E7D4E]'}
                  />
                  <div className="text-[11px] text-[#7E8C82] text-right">
                    {remaining} {need.unit.toLowerCase()} still needed
                  </div>
                </div>
              </div>

              {/* Institution attribution and action */}
              <div className="pt-4 border-t border-[#E2E8E0] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#4E5C53] truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#7E8C82] shrink-0" />
                    <span className="font-medium text-[#18261E] truncate">{need.institution}</span>
                  </div>
                  <span className="text-[11px] text-[#7E8C82] flex items-center gap-1 shrink-0">
                    <MapPin className="w-3 h-3" /> {need.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPledge(need)}
                    className="flex-1 bg-[#2E7D4E] hover:bg-[#24663F] text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs hover:-translate-y-0.5 active:scale-[0.975] flex items-center justify-center gap-1.5"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Support This Need</span>
                  </button>
                  <Link
                    href={`/needs`}
                    className="p-2 border border-[#E2E8E0] hover:border-[#2E7D4E] hover:bg-[#EBF5EE] text-[#4E5C53] hover:text-[#1B4D2F] rounded-xl text-xs font-semibold transition-colors"
                    title="View details on Needs Board"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Support Modal */}
      {selectedNeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs modal-backdrop-anim">
          <div className="bg-white rounded-2xl border border-[#E2E8E0] max-w-md w-full p-6 shadow-xl space-y-5 modal-dialog-anim relative">
            <button
              onClick={() => setSelectedNeed(null)}
              className="absolute top-4 right-4 text-[#7E8C82] hover:text-[#18261E] p-1 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!isPledged ? (
              <>
                <div className="space-y-1 pr-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D4E]">
                    Verified Support Pledge
                  </span>
                  <h3 className="text-lg font-bold text-[#18261E]">{selectedNeed.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#4E5C53]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4E]" />
                    <span>{selectedNeed.institution} ({selectedNeed.location})</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2E8E0] space-y-2 text-xs">
                  <div className="flex justify-between text-[#4E5C53]">
                    <span>Current Status:</span>
                    <strong className="text-[#18261E]">
                      {selectedNeed.fulfilled} of {selectedNeed.required} fulfilled
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#4E5C53]">
                    <span>Requirement Type:</span>
                    <span className="text-[#2E7D4E] font-semibold">{selectedNeed.category}</span>
                  </div>
                  <div className="flex justify-between text-[#4E5C53]">
                    <span>Superintendent KYC:</span>
                    <span className="text-[#1B4D2F] font-semibold">Government Verified</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#18261E] block">
                    Select quantity you would like to contribute:
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPledgeQuantity(Math.max(1, pledgeQuantity - 1))}
                      className="w-9 h-9 rounded-lg border border-[#E2E8E0] hover:bg-[#F8FAF8] font-bold text-[#18261E] flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-base font-bold text-[#18261E] w-12 text-center">
                      {pledgeQuantity}
                    </span>
                    <button
                      onClick={() =>
                        setPledgeQuantity(Math.min(selectedNeed.required - selectedNeed.fulfilled, pledgeQuantity + 1))
                      }
                      className="w-9 h-9 rounded-lg border border-[#E2E8E0] hover:bg-[#F8FAF8] font-bold text-[#18261E] flex items-center justify-center"
                    >
                      +
                    </button>
                    <span className="text-xs text-[#4E5C53] ml-2">
                      {selectedNeed.unit} (Direct delivery or sponsor)
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#EBF5EE] border border-[#C6E6CD] rounded-xl text-[11px] text-[#1B4D2F] leading-relaxed">
                  <strong>Zero Platform Fees:</strong> 100% of your contribution reaches the verified institution. A digitally signed receipt and photo audit will be issued upon arrival.
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedNeed(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#E2E8E0] text-xs font-semibold text-[#4E5C53] hover:bg-[#F8FAF8]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPledge}
                    className="flex-1 py-2.5 rounded-xl bg-[#2E7D4E] hover:bg-[#24663F] text-white text-xs font-bold shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Confirm Pledge</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#EBF5EE] text-[#2E7D4E] mx-auto flex items-center justify-center animate-check-pop">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#18261E]">Thank You for Supporting!</h4>
                <p className="text-xs text-[#4E5C53] max-w-xs mx-auto leading-relaxed">
                  Your pledge of {pledgeQuantity} {selectedNeed.unit} has been noted. Connecting you to the dispatch instructions...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
