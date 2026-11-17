import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { VirtualClassroomRoom } from '@/components/volunteer/VirtualClassroomRoom';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TeachSessionsPage() {
  const user = await getCurrentUser();

  const sessions = await prisma.session.findMany({
    include: {
      institution: true,
      volunteer: true,
      certificate: true,
    },
    orderBy: { scheduledStart: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        <div>
          <Link
            href="/teach"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4E] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Volunteer Portal</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#18261E] tracking-tight">
                Live Classes & Virtual Rooms
              </h1>
              <p className="text-xs sm:text-sm text-[#4E5C53] mt-1">
                Supervised live educational sessions scheduled between verified educators and Child Care Institutions.
              </p>
            </div>
            <div className="text-xs text-[#4E5C53] bg-white px-3.5 py-2 rounded-[10px] border border-[#E2E8E0] shadow-2xs">
              Scheduled Sessions: <strong className="text-[#18261E] font-bold">{sessions.length}</strong>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="space-y-6">
          {sessions.length === 0 ? (
            <div className="bg-white p-10 rounded-[16px] border border-[#E2E8E0] text-center text-sm text-[#667085]">
              No active scheduled sessions. Submit a Teach for a Day request to get matched!
            </div>
          ) : (
            sessions.map((session) => (
              <VirtualClassroomRoom
                key={session.id}
                session={session}
                isTeacherOrAdmin={user?.role === 'VOLUNTEER' || user?.role === 'ADMIN'}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
