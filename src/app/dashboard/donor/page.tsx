import React from 'react';
import { requireRole } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { DonorDashboardClient } from '@/components/donor/DonorDashboardClient';

export const dynamic = 'force-dynamic';

export default async function DonorDashboardPage() {
  const user = await requireRole(UserRole.DONOR);

  const [donations, availableNeeds] = await Promise.all([
    prisma.donation.findMany({
      where: { donorId: user.id },
      include: {
        need: {
          include: { institution: true },
        },
      },
      orderBy: { initiatedAt: 'desc' },
    }),
    prisma.institutionNeed.findMany({
      where: {
        status: { in: ['OPEN', 'PARTIALLY_FULFILLED'] },
      },
      include: {
        institution: true,
      },
      orderBy: [{ urgency: 'asc' }, { createdAt: 'desc' }],
      take: 12,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DonorDashboardClient
        user={user}
        donations={donations}
        availableNeeds={availableNeeds}
      />
    </div>
  );
}

