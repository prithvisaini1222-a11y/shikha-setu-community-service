import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { Button } from '@/components/ui/atoms';
import {
  Compass,
  ArrowRight,
  Code,
  Stethoscope,
  Briefcase,
  Scale,
  Palette,
  Cpu,
  Microscope,
  Rocket,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CareerPage() {
  const editorialCareers = [
    {
      id: 'eng',
      title: 'Engineering',
      category: 'STEM',
      icon: Cpu,
      summary: 'Design, build, and maintain software, civil infrastructure, robotics, and electrical systems.',
      skills: ['Mathematics', 'Physics', 'Problem Solving', 'Algorithmic Logic'],
      path: ['Class 10 (Maths & Science)', 'Class 12 (PCM stream)', 'JEE / State Entrance', 'B.Tech / B.E. (4 Years)'],
    },
    {
      id: 'med',
      title: 'Medicine',
      category: 'Healthcare',
      icon: Stethoscope,
      summary: 'Diagnose patients, provide clinical treatment, prevent disease, and promote public health.',
      skills: ['Biology & Chemistry', 'Compassion', 'Diagnostics', 'Precision'],
      path: ['Class 10 (Science)', 'Class 12 (PCB stream)', 'NEET-UG Examination', 'MBBS / BDS / B.Sc Nursing'],
    },
    {
      id: 'tech',
      title: 'Technology',
      category: 'Digital Systems',
      icon: Code,
      summary: 'Develop modern software, cloud systems, cyber defense architecture, and artificial intelligence.',
      skills: ['Python / JavaScript', 'Data Structures', 'Cloud Systems', 'Cyber Hygiene'],
      path: ['Class 10 (Maths & CS)', 'Class 12 (PCM / CS)', 'CUET / Entrance', 'BCA / B.Sc CS / B.Tech CS'],
    },
    {
      id: 'com',
      title: 'Commerce',
      category: 'Finance & Business',
      icon: Briefcase,
      summary: 'Manage business finances, financial accounting, banking operations, and investment planning.',
      skills: ['Accounting', 'Financial Modeling', 'Economics', 'Business Law'],
      path: ['Class 10', 'Class 12 Commerce Stream', 'CUET / CA Foundation', 'B.Com / CA / CFA / BBA'],
    },
    {
      id: 'law',
      title: 'Law',
      category: 'Legal Studies',
      icon: Scale,
      summary: 'Advocate for human rights, provide constitutional counsel, and represent community justice.',
      skills: ['Analytical Reasoning', 'Constitutional Law', 'Public Speaking', 'Legal Research'],
      path: ['Class 10', 'Class 12 (Any stream)', 'CLAT / AILET Exam', 'B.A. LL.B / B.B.A. LL.B (5 Years)'],
    },
    {
      id: 'des',
      title: 'Design',
      category: 'Creative Media',
      icon: Palette,
      summary: 'Craft user experiences, digital interfaces, visual communication, and product architecture.',
      skills: ['Visual Communication', 'UI/UX Design', 'Illustration', 'Design Thinking'],
      path: ['Class 10', 'Class 12 (Any stream)', 'NID DAT / UCEED Exam', 'B.Des / B.Voc (4 Years)'],
    },
    {
      id: 'res',
      title: 'Research',
      category: 'Pure Sciences',
      icon: Microscope,
      summary: 'Conduct laboratory experiments, explore fundamental physics, and advance scientific discovery.',
      skills: ['Scientific Method', 'Data Analysis', 'Inquiry', 'Technical Writing'],
      path: ['Class 10 (Science)', 'Class 12 Science Stream', 'NEST / IISER IAT Exam', 'BS-MS Integrated / Ph.D.'],
    },
    {
      id: 'ent',
      title: 'Entrepreneurship',
      category: 'Leadership & Ventures',
      icon: Rocket,
      summary: 'Establish impactful social enterprises, lead innovative teams, and scale community solutions.',
      skills: ['Strategic Vision', 'Team Leadership', 'Fundraising', 'Resilience'],
      path: ['Class 10', 'Class 12 (Any stream)', 'Undergraduate Degree', 'Incubator / Direct Venture'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-2 animate-fade-in stagger-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F7F4] border border-[#E2E8E0] text-xs font-semibold text-[#4E5C53]">
            <Compass className="w-3.5 h-3.5 text-[#2E7D4E]" />
            <span>Class 9 & 10 Secondary Education</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#18261E] tracking-tight">
            Explore what comes next.
          </h1>
          <p className="text-xs sm:text-sm text-[#4E5C53] leading-relaxed">
            Curated career pathways designed to help young learners discover what each field involves, the core subjects required, and the milestone roadmaps from Class 10 to higher degrees.
          </p>
        </div>

        {/* 8 Career Cards Grid with Requirement 36 Hover State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {editorialCareers.map((career, index) => {
            const Icon = career.icon;
            return (
              <div
                key={career.id}
                className={`bg-white rounded-[16px] border border-[#E2E8E0] shadow-xs p-6 flex flex-col justify-between space-y-5 card-interactive group animate-fade-in stagger-${(index % 4) + 1}`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    {/* Requirement 36: Icon moves 2-3px on hover, border becomes soft green */}
                    <div className="w-9 h-9 rounded-[10px] bg-[#F4F7F4] border border-[#E2E8E0] flex items-center justify-center text-[#4E5C53] group-hover:text-[#2E7D4E] group-hover:-translate-y-[2.5px] group-hover:bg-[#EBF5EE] group-hover:border-[#C6E6CD] transition-all duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#4E5C53] uppercase tracking-wider">
                      {career.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#18261E] group-hover:text-[#2E7D4E] transition-colors">
                      {career.title}
                    </h3>
                    <p className="text-xs text-[#4E5C53] mt-1 line-clamp-3 leading-relaxed">
                      {career.summary}
                    </p>
                  </div>

                  {/* Core Skills */}
                  <div className="pt-3 border-t border-[#E2E8E0]/60 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E5C53] block">
                      Core Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {career.skills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-[6px] bg-[#F4F7F4] text-[#4E5C53] border border-[#E2E8E0] transition-colors group-hover:border-[#C6E6CD]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education Path */}
                  <div className="pt-2 border-t border-[#E2E8E0]/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E5C53] block">
                      Education Roadmap
                    </span>
                    <div className="space-y-1 text-xs text-[#4E5C53]">
                      {career.path.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#EBF5EE] text-[#1B4D2F] flex items-center justify-center text-[9px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate text-[11px]">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Requirement 36: CTA becomes more visible / emphasized */}
                <div className="pt-2 border-t border-[#E2E8E0]/60">
                  <Button
                    variant="secondary"
                    className="w-full text-xs font-semibold group-hover:border-[#2E7D4E] group-hover:bg-[#2E7D4E] group-hover:text-white transition-all duration-200"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
                  >
                    View Roadmap
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Life Skills & Mentoring Banner */}
        <div className="bg-white rounded-[16px] border border-[#E2E8E0] p-6 sm:p-8 space-y-4 shadow-xs card-interactive animate-fade-in stagger-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8E0]/60 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#18261E]">Digital Literacy & Life Skills</h2>
              <p className="text-xs text-[#4E5C53]">Foundation skills taught by verified volunteer mentors</p>
            </div>
            <span className="text-xs font-semibold text-[#1B4D2F] bg-[#EBF5EE] px-2.5 py-0.5 rounded-full border border-[#C6E6CD]">
              Volunteer Supported
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {[
              { title: 'Cyber Safety & Basics', desc: 'Internet hygiene, safe passwords, digital communication tools.' },
              { title: 'Communication Skills', desc: 'Confidence building, spoken English, and presentation etiquette.' },
              { title: 'Financial Literacy', desc: 'Bank accounts, saving habits, budgeting, and transaction awareness.' },
              { title: 'Critical Thinking', desc: 'Structured analysis, problem formulation, and decision logic.' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-[10px] bg-[#F4F7F4] border border-[#E2E8E0] space-y-1 transition-all hover:bg-white hover:-translate-y-px">
                <span className="font-semibold text-[#18261E] block">{item.title}</span>
                <p className="text-[11px] text-[#4E5C53] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
