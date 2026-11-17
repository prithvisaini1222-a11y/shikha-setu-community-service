'use server';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { createNeedSchema } from '@/lib/validations';
import { sendNotification } from '@/lib/notifications/service';
import { issueVolunteerCertificate } from '@/lib/certificates/generator';
import { NeedCategory, RequestStatus, SessionStatus, UrgencyLevel } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createNeedAction(formData: FormData) {
  const user = await getCurrentUser();
  let institutionId = user?.institutionId;
  if (!institutionId && user?.id) {
    const inst = await prisma.institution.findFirst({ where: { userId: user.id } });
    institutionId = inst?.id;
  }

  if (!user || !institutionId) {
    return { error: 'You must be logged in as an institution.' };
  }

  const rawData = {
    title: formData.get('title') as string,
    category: formData.get('category') as NeedCategory,
    classLevel: formData.get('classLevel') ? Number(formData.get('classLevel')) : undefined,
    subject: (formData.get('subject') as string) || undefined,
    urgency: (formData.get('urgency') as UrgencyLevel) || UrgencyLevel.NEEDED,
    requiredQuantity: Number(formData.get('requiredQuantity')) || 1,
    mode: (formData.get('mode') as string) || 'offline',
    location: (formData.get('location') as string) || 'Institution Premises',
    description: formData.get('description') as string,
  };

  const parsed = createNeedSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Invalid need parameters' };
  }

  const need = await prisma.institutionNeed.create({
    data: {
      institutionId,
      ...parsed.data,
    },
  });

  revalidatePath('/needs');
  revalidatePath('/dashboard/institution');
  return { success: true, needId: need.id };
}

export async function approveVolunteerRequestAction({
  requestId,
  scheduledStartStr,
  durationMinutes = 120,
  meetingLinkOrRoom = 'https://meet.shikshasetu.org/live-room',
}: {
  requestId: string;
  scheduledStartStr?: string;
  durationMinutes?: number;
  meetingLinkOrRoom?: string;
}) {
  const user = await getCurrentUser();
  let institutionId = user?.institutionId;
  if (!institutionId && user?.id) {
    const inst = await prisma.institution.findFirst({ where: { userId: user.id } });
    institutionId = inst?.id;
  }

  if (!user || !institutionId) return { error: 'Unauthorized' };

  const request = await prisma.volunteerRequest.findUnique({
    where: { id: requestId },
    include: {
      volunteer: true,
      need: true,
    },
  });

  if (!request) return { error: 'Request not found' };

  await prisma.volunteerRequest.update({
    where: { id: requestId },
    data: { status: RequestStatus.APPROVED },
  });

  const scheduledStart = scheduledStartStr ? new Date(scheduledStartStr) : request.preferredDate;

  const session = await prisma.session.create({
    data: {
      institutionId,
      volunteerId: request.volunteerId,
      requestId: request.id,
      needId: request.needId,
      title: `${request.subject} (Class ${request.classLevel}): ${request.topic}`,
      subject: request.subject,
      classLevel: request.classLevel,
      scheduledStart,
      durationMinutes,
      mode: request.mode,
      meetingLinkOrRoom,
      status: SessionStatus.SCHEDULED,
      attendanceCount: 15,
    },
  });

  await sendNotification({
    userId: request.volunteer.userId,
    title: 'Your Teaching Request Was Approved',
    message: `Your class for ${request.subject} on ${scheduledStart.toDateString()} has been scheduled.`,
    link: '/teach/sessions',
  });

  revalidatePath('/dashboard/institution');
  revalidatePath('/dashboard/volunteer');
  revalidatePath('/teach/sessions');

  return { success: true, sessionId: session.id };
}

export async function rejectVolunteerRequestAction(requestId: string) {
  const user = await getCurrentUser();
  if (!user || !user.institutionId) return { error: 'Unauthorized' };

  await prisma.volunteerRequest.update({
    where: { id: requestId },
    data: { status: RequestStatus.REJECTED },
  });

  revalidatePath('/dashboard/institution');
  return { success: true };
}

export async function verifySessionAndIssueCertificateAction({
  sessionId,
  attendanceCount,
  institutionFeedback,
}: {
  sessionId: string;
  attendanceCount: number;
  institutionFeedback: string;
}) {
  const user = await getCurrentUser();
  let institutionId = user?.institutionId;
  if (!institutionId && user?.id) {
    const inst = await prisma.institution.findFirst({ where: { userId: user.id } });
    institutionId = inst?.id;
  }

  if (!user || !institutionId) return { error: 'Unauthorized' };

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      volunteer: true,
      institution: true,
    },
  });

  if (!session) return { error: 'Session not found' };

  const hours = session.durationMinutes / 60;

  // Mark session completed and verified
  await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: SessionStatus.COMPLETED,
      verifiedByInstitution: true,
      attendanceCount,
      institutionFeedback,
    },
  });

  // Update volunteer stats
  await prisma.volunteer.update({
    where: { id: session.volunteerId },
    data: {
      totalHours: { increment: hours },
      totalSessions: { increment: 1 },
      contributionScore: { increment: 5 },
    },
  });

  // Issue digital verified certificate
  const certificate = await issueVolunteerCertificate({
    volunteerId: session.volunteerId,
    institutionId: session.institutionId,
    sessionId: session.id,
    contributionType: `${session.subject} Tutoring - Class ${session.classLevel}`,
    hoursContributed: hours,
    sessionsCount: 1,
  });

  await sendNotification({
    userId: session.volunteer.userId,
    title: 'Contribution Verified & Certificate Issued',
    message: `Certificate #${certificate.certificateNumber} has been issued by ${session.institution.orgName}.`,
    link: `/certificates/verify/${certificate.certificateNumber}`,
  });

  revalidatePath('/dashboard/institution');
  revalidatePath('/dashboard/volunteer');
  revalidatePath('/teach/sessions');

  return {
    success: true,
    certificateNumber: certificate.certificateNumber,
  };
}

export async function updateInventoryAction({
  needId,
  distributedQuantity,
}: {
  needId: string;
  distributedQuantity: number;
}) {
  const user = await getCurrentUser();
  if (!user || !user.institutionId) return { error: 'Unauthorized' };

  await prisma.institutionNeed.update({
    where: { id: needId },
    data: {
      distributedQuantity,
    },
  });

  revalidatePath('/dashboard/institution');
  return { success: true };
}
