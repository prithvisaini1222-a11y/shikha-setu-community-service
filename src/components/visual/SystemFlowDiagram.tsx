'use client';

import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  SearchCheck,
  HeartHandshake,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface SystemFlowDiagramProps {
  className?: string;
}

export function SystemFlowDiagram({ className = '' }: SystemFlowDiagramProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: 'Institution Need',
      label: '1. Need Posted',
      desc: 'Verified CCI posts verified textbook, kit, or subject teaching requirements.',
      icon: Building2,
      badge: 'CCI Verified',
      color: 'text-[#4F9D69]',
      bgColor: 'bg-[#EEF7F0]',
      borderColor: 'border-[#4F9D69]',
    },
    {
      id: 2,
      title: 'ShikshaSetu Core',
      label: '2. Audit & Validation',
      desc: 'Platform verifies syllabus level, child-safety compliance, and logistics routing.',
      icon: ShieldCheck,
      badge: 'POCSO Safe',
      color: 'text-[#4F9D69]',
      bgColor: 'bg-[#EEF7F0]',
      borderColor: 'border-[#4F9D69]',
    },
    {
      id: 3,
      title: 'Smart Match',
      label: '3. Precision Match',
      desc: 'Algorithm matches volunteers by subject/timing and donors by item tier.',
      icon: SearchCheck,
      badge: '92%+ Precision',
      color: 'text-[#6E9AD6]',
      bgColor: 'bg-[#EEF4FB]',
      borderColor: 'border-[#6E9AD6]',
    },
    {
      id: 4,
      title: 'Volunteer / Donor',
      label: '4. Dedicated Action',
      desc: 'Volunteers conduct live interactive sessions; donors sponsor books directly.',
      icon: HeartHandshake,
      badge: 'Direct Action',
      color: 'text-[#78B98A]',
      bgColor: 'bg-[#EEF7F0]',
      borderColor: 'border-[#78B98A]',
    },
    {
      id: 5,
      title: 'Support Delivered',
      label: '5. Direct Delivery',
      desc: 'Classroom smart devices sync whiteboards; physical kits delivered to CCI.',
      icon: Sparkles,
      badge: 'Zero Intermediate',
      color: 'text-[#4F9D69]',
      bgColor: 'bg-[#EEF7F0]',
      borderColor: 'border-[#4F9D69]',
    },
    {
      id: 6,
      title: 'Verification',
      label: '6. Cryptographic Audit',
      desc: 'Superintendent signs digital receipt; photos and test scores recorded.',
      icon: CheckCircle2,
      badge: 'Audited Receipt',
      color: 'text-[#6E9AD6]',
      bgColor: 'bg-[#EEF4FB]',
      borderColor: 'border-[#6E9AD6]',
    },
    {
      id: 7,
      title: 'Measurable Impact',
      label: '7. Outcomes Unlocked',
      desc: 'Students advance grade benchmarks; 80G tax certificates generated.',
      icon: Award,
      badge: '80G & Verified',
      color: 'text-[#4F9D69]',
      bgColor: 'bg-[#EEF7F0]',
      borderColor: 'border-[#4F9D69]',
    },
  ];

  return (
    <div className={`w-full bg-white rounded-3xl border border-[#E4E7E1] p-6 sm:p-8 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E7E1]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
            End-to-End System Pipeline
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#25352B] tracking-tight">
            How ShikshaSetu Delivers Verified Education
          </h3>
          <p className="text-xs sm:text-sm text-[#647067] max-w-xl mt-1">
            Every step is transparent, audit-ready, and regulated under strict child-safety compliance.
          </p>
        </div>

        {/* Live Step Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8F7F2] border border-[#E4E7E1] self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#647067]">Active Stage:</span>
          <span className="text-xs font-bold text-[#4F9D69]">{steps[activeStep - 1].title}</span>
        </div>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="py-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-[780px] justify-between relative">
          {/* Background connecting track */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-[#EEF7F0] -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.id;
            const isPassed = activeStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className="group relative z-10 flex flex-col items-center cursor-pointer text-center focus:outline-none"
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xs ${
                      isCurrent
                        ? `${step.bgColor} ${step.borderColor} border-2 ring-4 ring-[#EEF7F0] scale-110`
                        : isPassed
                        ? 'bg-[#EEF7F0] border border-[#78B98A] text-[#4F9D69]'
                        : 'bg-white border border-[#E4E7E1] text-[#8E9990] hover:border-[#78B98A]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isCurrent ? step.color : ''}`} />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[11px] font-bold mt-2.5 transition-colors whitespace-nowrap ${
                      isCurrent ? 'text-[#25352B]' : 'text-[#647067]'
                    }`}
                  >
                    {step.title}
                  </span>

                  <span className="text-[9px] font-semibold text-[#8E9990] uppercase tracking-wider">
                    Stage {step.id}
                  </span>
                </button>

                {/* Connecting arrow separator */}
                {idx < steps.length - 1 && (
                  <div className="flex-1 px-1 flex items-center justify-center -z-0">
                    <ArrowRight className="w-3.5 h-3.5 text-[#D5DCD3]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Stage Callout Card */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#F8F7F2] border border-[#E4E7E1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${steps[activeStep - 1].bgColor}`}>
            {React.createElement(steps[activeStep - 1].icon, {
              className: `w-5 h-5 ${steps[activeStep - 1].color}`,
            })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#25352B]">
                {steps[activeStep - 1].label}: {steps[activeStep - 1].title}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#E4E7E1] text-[#4F9D69]">
                {steps[activeStep - 1].badge}
              </span>
            </div>
            <p className="text-xs text-[#647067] mt-0.5 max-w-2xl">
              {steps[activeStep - 1].desc}
            </p>
          </div>
        </div>

        {/* Action button to explore */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveStep((prev) => (prev % steps.length) + 1)}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold border border-[#E4E7E1] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
