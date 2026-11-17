'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Calendar,
  PackageCheck,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface InstitutionImpactPreviewProps {
  sessionsCount?: number;
  volunteerHours?: number;
  resourcesFulfilled?: number;
  institutionsCount?: number;
}

export function InstitutionImpactPreview({
  sessionsCount = 128,
  volunteerHours = 340,
  resourcesFulfilled = 920,
  institutionsCount = 24,
}: InstitutionImpactPreviewProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'resources'>('sessions');

  const trendData = [
    { month: 'Apr', sessions: 28, hours: 56, resources: 120 },
    { month: 'May', sessions: 42, hours: 88, resources: 180 },
    { month: 'Jun', sessions: 58, hours: 120, resources: 240 },
    { month: 'Jul', sessions: 76, hours: 165, resources: 310 },
    { month: 'Aug', sessions: 98, hours: 220, resources: 450 },
    { month: 'Sep', sessions: 128, hours: 340, resources: 620 },
  ];

  const operationsActions = [
    { title: 'Post Need', desc: 'Request textbooks or kits', icon: PackageCheck, href: '/needs' },
    { title: 'Manage Volunteers', desc: 'Screen & schedule mentors', icon: Users, href: '/volunteer' },
    { title: 'Manage Sessions', desc: 'Live classroom calendar', icon: Calendar, href: '/teach' },
    { title: 'Track Resources', desc: 'Live shipment vouchers', icon: BookOpen, href: '/needs' },
    { title: 'Verify Support', desc: 'Superintendent signature', icon: ShieldCheck, href: '/impact' },
    { title: 'View Impact', desc: 'Outcomes & 80G reports', icon: Award, href: '/impact' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E4E7E1] p-6 sm:p-10 shadow-xs space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E7E1]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
            Verified Operations & Outcomes
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#25352B] tracking-tight">
            Institution Console & Measurable Impact
          </h3>
          <p className="text-xs sm:text-sm text-[#647067] max-w-xl">
            Child Care Institutions manage their complete academic ecosystem with real-time verification and zero administrative paperwork.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/impact"
            className="px-4 py-2 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <span>Live Audit Network</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Big Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#F8F7F2] border border-[#E4E7E1] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#EEF7F0] text-[#4F9D69] flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#25352B]">
              {sessionsCount}+
            </div>
            <div className="text-xs font-bold text-[#647067]">Teaching Sessions</div>
            <div className="text-[10px] text-[#4F9D69] font-semibold mt-0.5">100% Verified Completion</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F8F7F2] border border-[#E4E7E1] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#EEF7F0] text-[#4F9D69] flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#25352B]">
              {volunteerHours}+
            </div>
            <div className="text-xs font-bold text-[#647067]">Volunteer Hours</div>
            <div className="text-[10px] text-[#4F9D69] font-semibold mt-0.5">Direct 1-on-1 & Classroom</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F8F7F2] border border-[#E4E7E1] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#EEF4FB] text-[#6E9AD6] flex items-center justify-center font-bold">
            <PackageCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#25352B]">
              {resourcesFulfilled}+
            </div>
            <div className="text-xs font-bold text-[#647067]">Resources Fulfilled</div>
            <div className="text-[10px] text-[#6E9AD6] font-semibold mt-0.5">Books, Kits & Tablets</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F8F7F2] border border-[#E4E7E1] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#EEF7F0] text-[#78B98A] flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#25352B]">
              {institutionsCount}
            </div>
            <div className="text-xs font-bold text-[#647067]">Institutions Supported</div>
            <div className="text-[10px] text-[#4F9D69] font-semibold mt-0.5">Govt Registered CCIs</div>
          </div>
        </div>
      </div>

      {/* Modern Institution Operations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#647067] uppercase tracking-wider">
            Modern CCI Operations Suite
          </span>
          <span className="text-xs text-[#4F9D69] font-semibold">Zero Administrative Burden</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {operationsActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="p-4 rounded-2xl border border-[#E4E7E1] bg-white hover:border-[#4F9D69] hover:bg-[#EEF7F0]/40 transition-all flex flex-col justify-between h-32 group shadow-2xs hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F8F7F2] group-hover:bg-[#EEF7F0] text-[#4F9D69] flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#25352B] group-hover:text-[#4F9D69] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[#647067] line-clamp-1">
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Minimal Clean Charts: Green & Soft Blue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Chart: Monthly Teaching Sessions (Area Chart) */}
        <div className="lg:col-span-7 bg-[#F8F7F2] p-5 sm:p-6 rounded-2xl border border-[#E4E7E1] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-[#25352B]">Monthly Teaching Growth</h5>
              <p className="text-[10px] text-[#647067]">Completed Sessions & Volunteer Hours</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F0] text-[#4F9D69] border border-[#78B98A]">
              +46% This Quarter
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leafGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F9D69" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F9D69" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="softBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6E9AD6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6E9AD6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#647067' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#647067' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E4E7E1', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6E9AD6" strokeWidth={2} fillOpacity={1} fill="url(#softBlueGrad)" />
                <Area type="monotone" dataKey="sessions" stroke="#4F9D69" strokeWidth={2.5} fillOpacity={1} fill="url(#leafGreenGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Resource Fulfillment (Bar Chart) */}
        <div className="lg:col-span-5 bg-[#F8F7F2] p-5 sm:p-6 rounded-2xl border border-[#E4E7E1] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-[#25352B]">Supplies Fulfilled</h5>
              <p className="text-[10px] text-[#647067]">Cumulative kits, books & materials</p>
            </div>
            <span className="text-[10px] font-bold text-[#6E9AD6]">Verified Deliveries</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#647067' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#647067' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E4E7E1', fontSize: '11px' }}
                />
                <Bar dataKey="resources" fill="#4F9D69" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
