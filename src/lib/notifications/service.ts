import { prisma } from '@/lib/db/prisma';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

export async function sendNotification({ userId, title, message, link }: NotificationPayload) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        link,
      },
    });

    // In production, trigger email or SMS/WhatsApp here via provider abstraction
    if (process.env.EMAIL_PROVIDER === 'resend' && process.env.EMAIL_API_KEY) {
      console.log(`[Email Mock] Sent email to user ${userId}: ${title}`);
    }

    return notification;
  } catch (err) {
    console.error('Failed to dispatch notification:', err);
    return null;
  }
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}
