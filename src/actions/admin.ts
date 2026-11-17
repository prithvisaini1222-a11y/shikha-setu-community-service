'use server';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { sendNotification } from '@/lib/notifications/service';
import { VerificationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function verifyInstitutionAction(institutionId: string, status: VerificationStatus) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const institution = await prisma.institution.update({
    where: { id: institutionId },
    data: { verificationStatus: status },
    include: { user: true },
  });

  if (status === VerificationStatus.VERIFIED) {
    await prisma.user.update({
      where: { id: institution.userId },
      data: { isVerified: true },
    });
  }

  await sendNotification({
    userId: institution.userId,
    title: `Institution Verification Update: ${status}`,
    message: `Your Child Care Institution verification status is now: ${status}.`,
    link: '/dashboard/institution',
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: `INSTITUTION_${status}`,
      entityType: 'Institution',
      entityId: institutionId,
      detailsJson: JSON.stringify({ adminName: user.name, status }),
    },
  });

  revalidatePath('/dashboard/admin');
  return { success: true };
}

export async function verifyVolunteerAction(volunteerId: string, status: VerificationStatus) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const volunteer = await prisma.volunteer.update({
    where: { id: volunteerId },
    data: { verificationStatus: status },
    include: { user: true },
  });

  if (status === VerificationStatus.VERIFIED) {
    await prisma.user.update({
      where: { id: volunteer.userId },
      data: { isVerified: true },
    });
  }

  await sendNotification({
    userId: volunteer.userId,
    title: `Volunteer Verification: ${status}`,
    message: `Your educator verification has been set to ${status}.`,
    link: '/dashboard/volunteer',
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: `VOLUNTEER_${status}`,
      entityType: 'Volunteer',
      entityId: volunteerId,
      detailsJson: JSON.stringify({ adminName: user.name, status }),
    },
  });

  revalidatePath('/dashboard/admin');
  return { success: true };
}

export async function toggleUserVerificationAction(userId: string, isVerified: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized' };

  await prisma.user.update({
    where: { id: userId },
    data: { isVerified },
  });

  revalidatePath('/dashboard/admin');
  return { success: true };
}

export async function requestChangesAction({
  entityType,
  entityId,
  notes,
}: {
  entityType: 'Institution' | 'Volunteer';
  entityId: string;
  notes: string;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized' };

  let targetUserId = '';
  if (entityType === 'Institution') {
    const inst = await prisma.institution.findUnique({ where: { id: entityId } });
    if (inst) targetUserId = inst.userId;
  } else {
    const vol = await prisma.volunteer.findUnique({ where: { id: entityId } });
    if (vol) targetUserId = vol.userId;
  }

  if (targetUserId) {
    await sendNotification({
      userId: targetUserId,
      title: 'Verification Changes Requested',
      message: `Admin review note: "${notes}". Please update your verification documentation.`,
      link: entityType === 'Institution' ? '/dashboard/institution' : '/dashboard/volunteer',
    });
  }

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: `${entityType.toUpperCase()}_CHANGES_REQUESTED`,
      entityType,
      entityId,
      detailsJson: JSON.stringify({ adminName: user.name, notes }),
    },
  });

  revalidatePath('/dashboard/admin');
  return { success: true };
}

export async function updateNeedStatusByAdminAction(needId: string, status: any) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized' };

  await prisma.institutionNeed.update({
    where: { id: needId },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: `NEED_STATUS_${status}`,
      entityType: 'InstitutionNeed',
      entityId: needId,
      detailsJson: JSON.stringify({ adminName: user.name, status }),
    },
  });

  revalidatePath('/dashboard/admin');
  revalidatePath('/needs');
  return { success: true };
}

export async function updateSessionStatusByAdminAction({
  sessionId,
  status,
  attendanceCount,
}: {
  sessionId: string;
  status: any;
  attendanceCount?: number;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized' };

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      status,
      attendanceCount: attendanceCount ?? undefined,
    },
  });

  revalidatePath('/dashboard/admin');
  return { success: true };
}

export async function updateDonationStatusByAdminAction(donationId: string, status: any) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const updates: any = { status };
  if (status === 'INSTITUTION_RECEIVED') {
    updates.receivedAt = new Date();
  } else if (status === 'INSTITUTION_VERIFIED' || status === 'FULFILLED') {
    updates.verifiedAt = new Date();
  }

  await prisma.donation.update({
    where: { id: donationId },
    data: updates,
  });

  revalidatePath('/dashboard/admin');
  return { success: true };
}

