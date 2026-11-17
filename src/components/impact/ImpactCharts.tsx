'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ImpactChartsProps {
  monthlyTrend: { month: string; sessions: number; hours: number }[];
  subjectDistribution: { subject: string; count: number }[];
  resourceDistribution: { category: string; count: number }[];
}

// Strictly follow leaf green, soft blue, and warm highlight
const PALETTE = ['#2E7D4E', '#4B749F', '#78B98A', '#A3C2EC', '#D8A94D'];

/**
 * Requirement 39: Impact Chart Progressive Load
 * Animations tuned under 1000ms with smooth easing. Does not animate continuously.
 */
export function ImpactCharts({
  monthlyTrend,
  subjectDistribution,
  resourceDistribution,
}: ImpactChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Monthly Teaching Support Trend */}
      <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4 card-interactive">
        <div>
          <h3 className="text-sm font-bold text-[#18261E]">Teaching Sessions & Volunteer Hours</h3>
          <p className="text-xs text-[#4E5C53]">Verified teaching hours and conducted classes over time</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8E0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#4E5C53' }} />
              <YAxis tick={{ fontSize: 11, fill: '#4E5C53' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  color: '#18261E',
                  border: '1px solid #E2E8E0',
                  borderRadius: '10px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(37, 53, 43, 0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#4E5C53' }} />
              <Bar
                dataKey="hours"
                name="Volunteer Hours"
                fill="#4B749F"
                radius={[4, 4, 0, 0]}
                animationDuration={900}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="sessions"
                name="Sessions"
                fill="#2E7D4E"
                radius={[4, 4, 0, 0]}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Resource Distribution Breakdown */}
      <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4 card-interactive">
        <div>
          <h3 className="text-sm font-bold text-[#18261E]">Resource Distribution</h3>
          <p className="text-xs text-[#4E5C53]">Breakdown of verified books, devices, and kits</p>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resourceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="count"
                nameKey="category"
                animationDuration={900}
                animationEasing="ease-out"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {resourceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  color: '#18261E',
                  border: '1px solid #E2E8E0',
                  borderRadius: '10px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(37, 53, 43, 0.08)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
