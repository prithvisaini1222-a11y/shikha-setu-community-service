import { z } from 'zod';
import { NeedCategory, UrgencyLevel, UserRole } from '@prisma/client';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole, {
    message: 'Please select a valid role',
  }),
  // Optional institution fields
  orgName: z.string().optional(),
  registrationNumber: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  // Optional volunteer fields
  skills: z.string().optional(),
  subjects: z.string().optional(),
  classes: z.string().optional(),
  // Optional learner fields
  classLevel: z.number().min(6).max(10).optional(),
});

export const createNeedSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.nativeEnum(NeedCategory),
  classLevel: z.coerce.number().min(6).max(10).optional(),
  subject: z.string().optional(),
  urgency: z.nativeEnum(UrgencyLevel).default(UrgencyLevel.NEEDED),
  requiredQuantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  mode: z.string().default('offline'),
  location: z.string().min(3, 'Location is required'),
  description: z.string().min(10, 'Please provide a detailed description'),
});

export const volunteerRequestSchema = z.object({
  needId: z.string().min(1, 'Need ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  classLevel: z.coerce.number().min(6).max(10),
  topic: z.string().min(3, 'Topic title is required'),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a preferred time slot'),
  durationHours: z.coerce.number().min(0.5).max(8).default(2.0),
  mode: z.string().default('online'),
  recurringType: z.string().default('one_time'),
});

export const createDonationSchema = z.object({
  needId: z.string().min(1, 'Need ID is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  itemDescription: z.string().min(3, 'Please describe the items being donated'),
  notes: z.string().optional(),
});

export const doubtSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  chapterId: z.string().min(1, 'Chapter is required'),
  question: z.string().min(10, 'Question must be at least 10 characters long'),
  imageUrl: z.string().optional(),
});

export const doubtAnswerSchema = z.object({
  doubtId: z.string().min(1),
  answer: z.string().min(5, 'Answer must be at least 5 characters long'),
});
