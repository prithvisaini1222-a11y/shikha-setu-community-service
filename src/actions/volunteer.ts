'use server';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { calculateVolunteerNeedMatch } from '@/lib/matching/matcher';
import { sendNotification } from '@/lib/notifications/service';
import { RequestStatus, SessionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function submitTeachForADayAction(formData: FormData) {
  const user = await getCurrentUser();
  let volunteerId = user?.volunteerId;
  if (!volunteerId && user?.id) {
    const v = await prisma.volunteer.findFirst({ where: { userId: user.id } });
    volunteerId = v?.id;
  }

  if (!user || !volunteerId) {
    return { error: 'You must be logged in as a verified volunteer.' };
  }

  const volunteer = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
  });

  if (!volunteer) {
    return { error: 'Volunteer profile not found' };
  }

  const needId = formData.get('needId') as string;
  const subject = (formData.get('subject') as string) || 'Mathematics';
  const classLevel = Number(formData.get('classLevel')) || 8;
  const topic = (formData.get('topic') as string) || 'Chapter Masterclass';
  const preferredDateStr = formData.get('preferredDate') as string;
  const preferredTime = (formData.get('preferredTime') as string) || '10:00 AM - 12:00 PM';
  const durationHours = Number(formData.get('durationHours')) || 2.0;
  const mode = (formData.get('mode') as string) || 'online';
  const recurringType = (formData.get('recurringType') as string) || 'one_time';

  const need = await prisma.institutionNeed.findUnique({
    where: { id: needId },
    include: { institution: true },
  });

  if (!need) {
    return { error: 'Target need not found' };
  }

  // Calculate 6-factor match score
  const match = calculateVolunteerNeedMatch({
    volunteerSkills: volunteer.skills,
    volunteerSubjects: volunteer.subjects,
    volunteerClasses: volunteer.classes,
    volunteerAvailability: volunteer.availability,
    volunteerMode: volunteer.mode,
    volunteerExperienceYears: volunteer.experienceYears,
    needSubject: need.subject,
    needClassLevel: need.classLevel,
    needMode: need.mode,
    needUrgency: need.urgency,
  });

  const preferredDate = preferredDateStr ? new Date(preferredDateStr) : new Date(Date.now() + 86400 * 1000 * 3);

  const request = await prisma.volunteerRequest.create({
    data: {
      volunteerId: volunteer.id,
      needId: need.id,
      subject,
      classLevel,
      topic,
      preferredDate,
      preferredTime,
      durationHours,
      mode,
      recurringType,
      status: RequestStatus.PENDING,
      matchScore: match.percentage,
      matchReasonsJson: JSON.stringify(match.reasons),
    },
  });

  // Notify institution
  await sendNotification({
    userId: need.institution.userId,
    title: `New Teach for a Day Application (${match.percentage}% Match)`,
    message: `${volunteer.fullName} applied to teach ${subject} (Class ${classLevel}) for your requirement: "${need.title}".`,
    link: '/dashboard/institution',
  });

  revalidatePath('/teach');
  revalidatePath('/dashboard/volunteer');
  revalidatePath('/dashboard/institution');

  return {
    success: true,
    requestId: request.id,
    matchScore: match.percentage,
    reasons: match.reasons,
  };
}

export async function updateSessionStatusAction({
  sessionId,
  status,
  attendanceCount,
  volunteerFeedback,
}: {
  sessionId: string;
  status: SessionStatus;
  attendanceCount?: number;
  volunteerFeedback?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      status,
      attendanceCount: attendanceCount ?? undefined,
      volunteerFeedback: volunteerFeedback ?? undefined,
    },
  });

  revalidatePath('/teach/sessions');
  revalidatePath('/dashboard/volunteer');
  revalidatePath('/dashboard/institution');
  return { success: true };
}
