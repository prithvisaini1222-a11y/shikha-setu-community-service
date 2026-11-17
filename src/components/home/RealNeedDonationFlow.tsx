'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';

export function RealNeedDonationFlow() {
  const [selectedUnits, setSelectedUnits] = useState<number>(3);
  const costPerUnit = 450; // ₹450 per NCERT book set

  const pipelineSteps = [
    { name: 'Need', label: '1. Need Audited', desc: '15 Class 8 Math Sets requested by CCI Superintendent.' },
    { name: 'Donation', label: '2. Direct Sponsorship', desc: 'Donors contribute direct item sets (No cash diversion).' },
    { name: 'Verified', label: '3. Physical Delivery', desc: 'Vendor delivers books; verified photo receipt generated.' },
    { name: 'Fulfilled', label: '4. 80G Impact Record', desc: 'Students receive books; 80G tax receipt issued to donor.' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E4E7E1] p-6 sm:p-10 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E7E1]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
            100% Item-Level Transparency
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#25352B] tracking-tight">
            Support a Real Need: Class 8 Mathematics Books
          </h3>
          <p className="text-xs sm:text-sm text-[#647067] max-w-xl">
            Sponsor essential learning tools directly. Every physical textbook is cryptographically tracked from requirement to classroom delivery.
          </p>
        </div>

        <Link
          href="/needs"
          className="px-4 py-2 rounded-xl bg-[#EEF7F0] text-[#4F9D69] hover:bg-[#4F9D69] hover:text-white transition-all text-xs font-bold border border-[#78B98A] flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>View All 18 Needs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Need Card & Fulfillment Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Active Need Progress Box (7 cols) */}
        <div className="lg:col-span-7 bg-[#F8F7F2] rounded-2xl p-6 sm:p-7 border border-[#E4E7E1] space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E7E1] flex items-center justify-center text-[#4F9D69] shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#4F9D69] uppercase tracking-wider">
                  Educational Supplies Need
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#25352B]">
                  Class 8 Mathematics NCERT Book Sets
                </h4>
                <div className="text-xs text-[#647067]">
                  Asha Kiran Child Care Institution • Bangalore Rural
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold border border-[#78B98A]">
              Urgent Need
            </span>
          </div>

          {/* Progress Metrics */}
          <div className="space-y-2 bg-white p-4 rounded-xl border border-[#E4E7E1]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#647067]">
                Progress: <strong className="text-[#25352B]">9 of 15 Sets Sponsored</strong>
              </span>
              <span className="font-bold text-[#4F9D69]">60% Fulfilled</span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#E4E7E1] overflow-hidden">
              <div className="w-[60%] h-full bg-[#4F9D69] rounded-full transition-all duration-500" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#647067] pt-1">
              <span>Remaining to fulfill: <strong>6 sets</strong></span>
              <span>₹450 per set (Standardized NCERT)</span>
            </div>
          </div>

          {/* 4-Stage Visual Fulfillment Flow */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-[#647067] uppercase tracking-wider block">
              Fulfilment Flow Architecture
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {pipelineSteps.map((step, idx) => (
                <div
                  key={step.name}
                  className={`p-3 rounded-xl border text-left space-y-1 ${
                    idx < 2
                      ? 'bg-white border-[#4F9D69] shadow-2xs'
                      : 'bg-white/60 border-[#E4E7E1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#4F9D69]">{step.name}</span>
                    {idx < 2 && <CheckCircle2 className="w-3 h-3 text-[#4F9D69]" />}
                  </div>
                  <div className="text-[11px] font-bold text-[#25352B]">{step.label}</div>
                  <p className="text-[10px] text-[#647067] line-clamp-2">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Instant Direct Sponsorship Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-[#4F9D69] p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-[#25352B] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#4F9D69]" />
              <span>Sponsor This Need</span>
            </h4>
            <span className="text-[10px] font-bold text-[#4F9D69] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]">
              Tax Deductible
            </span>
          </div>

          {/* Unit selector buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#647067]">Select Book Sets to Sponsor</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 6].map((units) => (
                <button
                  key={units}
                  type="button"
                  onClick={() => setSelectedUnits(units)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    selectedUnits === units
                      ? 'bg-[#4F9D69] text-white shadow-xs'
                      : 'bg-[#F8F7F2] text-[#25352B] border border-[#E4E7E1] hover:border-[#78B98A]'
                  }`}
                >
                  {units} {units === 1 ? 'Set' : 'Sets'}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Price */}
          <div className="p-3.5 rounded-xl bg-[#EEF7F0] border border-[#78B98A] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#647067] block">Total Sponsorship</span>
              <span className="text-lg font-black text-[#25352B]">
                ₹{(selectedUnits * costPerUnit).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#4F9D69] block">80G Benefit</span>
              <span className="text-xs font-semibold text-[#647067]">50% Tax Exemption</span>
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-[#647067]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4F9D69]" />
              <span>Direct delivery with verifiable photo voucher</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F9D69]" />
              <span>Government-audited Child Care Institution</span>
            </div>
          </div>

          <Link
            href={`/needs?sponsor=math-books-8&units=${selectedUnits}`}
            className="w-full py-3 px-4 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>Complete Sponsorship (₹{(selectedUnits * costPerUnit).toLocaleString('en-IN')})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
