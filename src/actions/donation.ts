'use server';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { sendNotification } from '@/lib/notifications/service';
import { DonationStatus, NeedStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createDonationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Please log in to sponsor educational requirements.' };
  }

  const needId = formData.get('needId') as string;
  const quantity = Number(formData.get('quantity')) || 1;
  const itemDescription = (formData.get('itemDescription') as string) || 'Educational Resource Donation';
  const notes = (formData.get('notes') as string) || '';

  const need = await prisma.institutionNeed.findUnique({
    where: { id: needId },
    include: { institution: true },
  });

  if (!need) {
    return { error: 'Target requirement not found' };
  }

  const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;

  const donation = await prisma.donation.create({
    data: {
      donorId: user.id,
      needId: need.id,
      quantity,
      category: need.category,
      itemDescription: `${quantity}x ${itemDescription}`,
      notes,
      trackingNumber,
      status: DonationStatus.CONFIRMED,
      confirmedAt: new Date(),
    },
  });

  // Increment fulfilledQuantity on need
  const newFulfilled = need.fulfilledQuantity + quantity;
  const isComplete = newFulfilled >= need.requiredQuantity;

  await prisma.institutionNeed.update({
    where: { id: need.id },
    data: {
      fulfilledQuantity: newFulfilled,
      status: isComplete ? NeedStatus.FULFILLED : NeedStatus.PARTIALLY_FULFILLED,
    },
  });

  // Notify institution
  await sendNotification({
    userId: need.institution.userId,
    title: `New Donation Pledged: ${quantity} units`,
    message: `${user.name} has pledged to sponsor "${need.title}". Tracking ID: ${trackingNumber}.`,
    link: '/dashboard/institution',
  });

  revalidatePath('/needs');
  revalidatePath(`/needs/${need.id}`);
  revalidatePath('/dashboard/donor');
  revalidatePath('/dashboard/institution');

  return {
    success: true,
    donationId: donation.id,
    trackingNumber,
  };
}

export async function updateDonationStatusAction(donationId: string, newStatus: DonationStatus) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const updates: any = { status: newStatus };
  if (newStatus === DonationStatus.INSTITUTION_RECEIVED) {
    updates.receivedAt = new Date();
  } else if (newStatus === DonationStatus.INSTITUTION_VERIFIED) {
    updates.verifiedAt = new Date();
  }

  const donation = await prisma.donation.update({
    where: { id: donationId },
    data: updates,
    include: {
      need: {
        include: { institution: true },
      },
      donor: true,
    },
  });

  // If verified, update verifiedQuantity on need
  if (newStatus === DonationStatus.INSTITUTION_VERIFIED) {
    await prisma.institutionNeed.update({
      where: { id: donation.needId },
      data: {
        verifiedQuantity: { increment: donation.quantity },
      },
    });

    await sendNotification({
      userId: donation.donorId,
      title: 'Donation Verified by Institution',
      message: `${donation.need.institution.orgName} has verified and received your donation (${donation.itemDescription}). Thank you!`,
      link: '/dashboard/donor',
    });
  }

  revalidatePath('/dashboard/institution');
  revalidatePath('/dashboard/donor');
  return { success: true };
}
