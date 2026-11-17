'use server';

import { prisma } from '@/lib/db/prisma';
import { loginSchema, registerSchema } from '@/lib/validations';
import { setSessionUser, clearSessionUser } from '@/lib/auth/session';
import { UserRole, VerificationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.issues?.[0]?.message || 'Invalid credentials' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  const isDemoUser = email.endsWith('@shikshasetu.org');
  const isAcceptedPassword =
    user &&
    (user.passwordHash === password ||
      (isDemoUser &&
        ['demo1234', 'admin123', 'learner123', 'volunteer123', 'donor123', 'inst123'].includes(
          password
        )));

  if (!user || !isAcceptedPassword) {
    return { error: 'Invalid email or password.' };
  }

  await setSessionUser(user.id);
  revalidatePath('/');
  return { success: true, role: user.role.toLowerCase() };
}

export async function registerAction(formData: FormData) {
  const rawRole = (formData.get('role') as string)?.toUpperCase();
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    role: rawRole as UserRole,
    orgName: (formData.get('orgName') as string) || undefined,
    registrationNumber: (formData.get('registrationNumber') as string) || undefined,
    city: (formData.get('city') as string) || undefined,
    state: (formData.get('state') as string) || undefined,
    skills: (formData.get('skills') as string) || undefined,
    subjects: (formData.get('subjects') as string) || undefined,
    classes: (formData.get('classes') as string) || undefined,
    classLevel: formData.get('classLevel') ? Number(formData.get('classLevel')) : undefined,
  };

  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Invalid form input' };
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: 'An account with this email address already exists.' };
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      role: data.role,
      isVerified: data.role === UserRole.LEARNER || data.role === UserRole.DONOR, // learners & donors default verified
    },
  });

  if (data.role === UserRole.INSTITUTION) {
    await prisma.institution.create({
      data: {
        userId: user.id,
        orgName: data.orgName || data.name,
        registrationNumber: data.registrationNumber || 'PENDING-REG',
        city: data.city || 'Delhi',
        state: data.state || 'Delhi',
        address: 'Sector 14, Dwarka',
        contactPerson: data.name,
        phone: '+91 98765 43210',
        email: data.email,
        childCount: 25,
        verificationStatus: VerificationStatus.PENDING,
      },
    });
  } else if (data.role === UserRole.VOLUNTEER) {
    await prisma.volunteer.create({
      data: {
        userId: user.id,
        fullName: data.name,
        skills: data.skills || 'Mathematics, English',
        subjects: data.subjects || 'Mathematics',
        classes: data.classes || '6,7,8',
        availability: 'Weekends (Sunday 10am - 12pm)',
        mode: 'online',
        experienceYears: 1,
        verificationStatus: VerificationStatus.PENDING,
        contributionScore: 80,
      },
    });
  } else if (data.role === UserRole.LEARNER) {
    // Find first institution to assign
    const firstInst = await prisma.institution.findFirst();
    await prisma.learner.create({
      data: {
        userId: user.id,
        displayName: data.name,
        classLevel: data.classLevel || 8,
        institutionId: firstInst?.id || 'inst-default',
        rollAlias: `LRN-${Math.floor(100 + Math.random() * 900)}`,
        streakDays: 1,
      },
    });
  }

  await setSessionUser(user.id);
  revalidatePath('/');
  redirect(`/dashboard/${data.role.toLowerCase()}`);
}

export async function switchDemoRoleAction(role: 'admin' | 'institution' | 'volunteer' | 'donor' | 'learner') {
  const roleEmails: Record<string, string> = {
    admin: 'admin@shikshasetu.org',
    institution: 'ashakiran@shikshasetu.org',
    volunteer: 'priya.volunteer@shikshasetu.org',
    donor: 'rajesh.donor@shikshasetu.org',
    learner: 'aarav.learner@shikshasetu.org',
  };

  const email = roleEmails[role];
  if (!email) return { error: 'Unknown role' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: `User with email ${email} not found. Please run seed.` };
  }

  await setSessionUser(user.id);
  revalidatePath('/');
  redirect(`/dashboard/${role}`);
}

export async function logoutAction() {
  await clearSessionUser();
  revalidatePath('/');
  redirect('/auth/login');
}
