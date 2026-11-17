import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/atoms';

export default function AboutPage() {
  const safetyPrinciples = [
    {
      title: 'Verified Institutions',
      desc: 'Every care home is vetted via state government registration licenses and superintendent credential checks prior to publishing needs.',
    },
    {
      title: 'Verified Volunteers',
      desc: 'All educators undergo identity screening and qualification checks prior to being scheduled for online or physical classes.',
    },
    {
      title: 'No Public Child Profiles',
      desc: 'Children are never displayed publicly or indexed on open search engines. Only anonymous internal tokens are maintained.',
    },
    {
      title: 'Controlled Communication',
      desc: 'All interaction occurs strictly through supervised institution channels: Child / Care Home → ShikshaSetu → Approved Volunteer.',
    },
    {
      title: 'Minimal Data Collection',
      desc: 'Zero personal phone numbers, home addresses, personal email addresses, or photographs of children are collected.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
        {/* Mission Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F7F4] border border-[#E2E8E0] text-xs font-semibold text-[#667085]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#72B79A]" />
            <span>Mission & Trust Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#243247] tracking-tight">
            About ShikshaSetu
          </h1>
          <p className="text-base text-[#243247] font-medium leading-relaxed">
            Connecting verified Child Care Institutions with passionate educators and donors to deliver structured learning and real-world educational resources.
          </p>
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Children in institutional care often encounter fragmented learning support and a lack of grade-aligned textbooks. ShikshaSetu provides a reliable, transparent bridge that pairs validated needs with qualified volunteers and donors while rigorously protecting child safety.
          </p>
        </div>

        {/* Core Principle Quote Card (Light, Warm, No dark backgrounds) */}
        <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs text-center space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#72B79A] block">
            Guiding Principle
          </span>
          <p className="text-lg sm:text-xl font-bold text-[#243247] tracking-tight">
            “Sirf madad nahi — sahi jagah, sahi waqt, sahi support.”
          </p>
        </div>

        {/* Safety UI — Built with child safety at the core */}
        <div id="safety" className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6">
          <div className="space-y-1 border-b border-[#E2E8E0]/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#72B79A]">
              Protection Framework
            </span>
            <h2 className="text-xl font-bold text-[#243247]">
              Built with child safety at the core.
            </h2>
            <p className="text-xs text-[#667085]">
              Engineered with strict compliance to the Juvenile Justice Act and POCSO protection protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {safetyPrinciples.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-[12px] bg-[#F4F7F4] border border-[#E2E8E0] space-y-1.5 ${
                  idx === 4 ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-2 text-[#243247] font-semibold text-sm">
                  <div className="w-5 h-5 rounded-full bg-[#EBF5EE] text-[#72B79A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.title}</span>
                </div>
                <p className="text-[#667085] leading-relaxed text-xs pl-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Child Helpline Callout in soft warm yellow */}
          <div className="p-4 rounded-[12px] bg-[#FEF9ED] border border-[#F2C96D]/40 text-[#243247] flex items-start gap-3 text-xs">
            <AlertCircle className="w-4 h-4 text-[#B58514] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#B58514]">National Child Protection Contacts:</strong>
              <p className="text-[11px] text-[#667085] mt-0.5">
                Childline: <strong className="text-[#243247]">1098</strong> (Toll-Free, 24/7) • National Cyber Crime Helpline: <strong className="text-[#243247]">1930</strong> • Ministry of Women & Child Development.
              </p>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="bg-[#F4F7F4] p-6 rounded-[16px] border border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#243247]">Join the ShikshaSetu Community</h3>
            <p className="text-xs text-[#667085]">Whether teaching for a day or donating books, your participation makes a lasting difference.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/teach">
              <Button size="sm">Volunteer to Teach</Button>
            </Link>
            <Link href="/needs">
              <Button size="sm" variant="secondary">Support a Need</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
