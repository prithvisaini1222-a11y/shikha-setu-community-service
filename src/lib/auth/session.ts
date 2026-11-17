import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE_NAME = 'shikshasetu_session_uid';

export interface AuthSessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string | null;
  isVerified: boolean;
  institutionId?: string;
  volunteerId?: string;
  learnerId?: string;
  classLevel?: number;
}

export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionUserId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      include: {
        institution: { select: { id: true } },
        volunteer: { select: { id: true } },
        learner: { select: { id: true, classLevel: true } },
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      institutionId: user.institution?.id,
      volunteerId: user.volunteer?.id,
      learnerId: user.learner?.id,
      classLevel: user.learner?.classLevel || 6,
    };
  } catch (err) {
    console.error('Error fetching current session user:', err);
    return null;
  }
}

export async function requireAuth(): Promise<AuthSessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole | UserRole[]): Promise<AuthSessionUser> {
  const user = await requireAuth();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!roles.includes(user.role)) {
    redirect(`/dashboard/${user.role.toLowerCase()}`);
  }
  return user;
}

export async function requireAdmin(): Promise<AuthSessionUser> {
  return requireRole(UserRole.ADMIN);
}

export async function setSessionUser(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
