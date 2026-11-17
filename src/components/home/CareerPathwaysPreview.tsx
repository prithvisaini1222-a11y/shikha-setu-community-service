'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Laptop,
  MessageSquare,
  Code2,
  Wallet,
  Mic2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  focus: string;
  milestones: string[];
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

export function CareerPathwaysPreview() {
  const [activePathway, setActivePathway] = useState<string>('digital');

  const pathways: Pathway[] = [
    {
      id: 'career',
      title: 'Career Explorer',
      subtitle: 'Mapping vocational, polytechnic & higher secondary roadmaps',
      focus: 'Discover 50+ career paths mapped to Class 10 graduates, including ITI diplomas, technical certificates, and civil services.',
      milestones: [
        'Aptitude & Interest Self-Discovery Assessment',
        'Vocational vs Academic Track Comparison',
        'Government Scholarship & Polytechnic Navigation',
      ],
      icon: Compass,
      tag: 'Future Readiness',
    },
    {
      id: 'digital',
      title: 'Digital Skills',
      subtitle: 'Computer literacy, productivity tools & cyber wellness',
      focus: 'Practical hands-on fluency in document creation, spreadsheets, professional email communication, and safe web navigation.',
      milestones: [
        'Operating Systems & Cloud Drive Management',
        'Docs, Spreadsheets & Professional Presentation',
        'Cyber Safety, Privacy & Digital Footprint Hygiene',
      ],
      icon: Laptop,
      tag: 'Essential Tech',
    },
    {
      id: 'english',
      title: 'Spoken English',
      subtitle: 'Conversational fluency & workplace communication',
      focus: 'Eliminate hesitation through roleplay, daily conversational scenarios, pronunciation coaching, and sentence structures.',
      milestones: [
        'Overcoming Speaking Hesitation in Groups',
        'Practical Workplace & Customer Interactions',
        'Storytelling, Presentation & Interview Etiquette',
      ],
      icon: MessageSquare,
      tag: 'Confidence',
    },
    {
      id: 'coding',
      title: 'Coding & Logic',
      subtitle: 'Computational thinking, Python & web fundamentals',
      focus: 'Develop structured problem-solving through visual algorithms, web development (HTML/CSS), and intro to Python programming.',
      milestones: [
        'Algorithmic Thinking & Logic Games',
        'Building First Responsive Web Pages',
        'Python Basics: Loops, Functions & Simple Data Apps',
      ],
      icon: Code2,
      tag: 'Innovation',
    },
    {
      id: 'finance',
      title: 'Financial Literacy',
      subtitle: 'Banking, budgeting, savings & fraud prevention',
      focus: 'Empower youth with practical financial independence: opening savings accounts, understanding interest, budgeting, and avoiding scams.',
      milestones: [
        'Personal Budgeting & Expense Tracking',
        'Formal Banking, UPI & Safe Transactions',
        'Identifying Fraud, Fake Job Schemes & Debt Traps',
      ],
      icon: Wallet,
      tag: 'Life Mastery',
    },
    {
      id: 'speaking',
      title: 'Public Speaking',
      subtitle: 'Articulation, rhetoric, debate & leadership presence',
      focus: 'Instill confidence to stand before an audience, present structured arguments, listen actively, and advocate for one’s ideas.',
      milestones: [
        'Body Language, Eye Contact & Voice Modulation',
        'Structuring 3-Minute Elevator Talks & Pitches',
        'Constructive Debating & Empathetic Active Listening',
      ],
      icon: Mic2,
      tag: 'Leadership',
    },
  ];

  const current = pathways.find((p) => p.id === activePathway) || pathways[1];

  return (
    <div className="space-y-8">
      {/* Visual Pathway Selector: Horizontal Journey Track */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {pathways.map((p) => {
          const Icon = p.icon;
          const isActive = activePathway === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePathway(p.id)}
              className={`p-4 rounded-xl text-left transition-all relative flex flex-col justify-between space-y-3 border ${
                isActive
                  ? 'bg-white border-[#2E7D4E] shadow-sm ring-1 ring-[#2E7D4E]/30 -translate-y-0.5'
                  : 'bg-white/80 border-[#E2E8E0] hover:border-[#D0D7CF] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#EBF5EE] text-[#1B4D2F]' : 'bg-[#F8FAF8] text-[#4E5C53]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#2E7D4E]" />
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#7E8C82] uppercase tracking-wider block">
                  {p.tag}
                </span>
                <span className={`text-xs font-bold block mt-0.5 ${isActive ? 'text-[#18261E]' : 'text-[#4E5C53]'}`}>
                  {p.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pathway Deep Dive Showcase Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs card-interactive">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5EE] text-[#1B4D2F] text-xs font-bold border border-[#C6E6CD]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.tag} Track</span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#18261E] tracking-tight">{current.title}</h3>
              <p className="text-xs sm:text-sm text-[#4E5C53] font-medium mt-1">{current.subtitle}</p>
            </div>

            <p className="text-xs sm:text-sm text-[#4E5C53] leading-relaxed">
              {current.focus}
            </p>

            {/* Milestones Flow */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-[#18261E] uppercase tracking-wider block">
                Structured Learning Milestones:
              </span>
              <div className="space-y-2 text-xs">
                {current.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F8FAF8] border border-[#E2E8E0]">
                    <span className="w-5 h-5 rounded-full bg-[#EBF5EE] text-[#1B4D2F] flex items-center justify-center font-bold text-[11px] shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="font-semibold text-[#18261E]">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Outcomes Box */}
          <div className="lg:col-span-5 bg-[#F8FAF8] rounded-xl border border-[#E2E8E0] p-6 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2E7D4E] uppercase tracking-wider">
                Holistic Growth
              </span>
              <h4 className="text-base font-bold text-[#18261E]">
                Equipping Youth for Independence
              </h4>
              <p className="text-xs text-[#4E5C53] leading-relaxed">
                Volunteers and corporate mentors lead targeted weekend sessions, providing personalized feedback and digital certification.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#E2E8E0] pt-4 text-xs text-[#4E5C53]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D4E] shrink-0" />
                <span>Verified Attendance & Mastery Badges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D4E] shrink-0" />
                <span>Zero Cost for Child Care Institutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D4E] shrink-0" />
                <span>Industry-Aligned Mentorship</span>
              </div>
            </div>

            <Link
              href="/career"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2E7D4E] hover:bg-[#24663F] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs hover:-translate-y-0.5"
            >
              <span>Explore All Career Pathways</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
