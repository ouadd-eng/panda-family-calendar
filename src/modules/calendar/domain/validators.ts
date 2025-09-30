import { EventFormData, InviteMemberFormData, FamilyFormData } from './types';
import { z } from 'zod';

/**
 * Validates family form data
 */
export const familySchema = z.object({
  name: z.string().trim().min(1, 'Family name is required').max(100, 'Family name must be less than 100 characters'),
});

export function validateFamilyData(data: FamilyFormData): string[] {
  const result = familySchema.safeParse(data);
  if (!result.success) {
    return result.error.errors.map(err => err.message);
  }
  return [];
}

/**
 * Validates invite member form data
 */
export const inviteMemberSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  role: z.enum(['owner', 'member']),
});

export function validateInviteMemberData(data: InviteMemberFormData): string[] {
  const result = inviteMemberSchema.safeParse(data);
  if (!result.success) {
    return result.error.errors.map(err => err.message);
  }
  return [];
}

/**
 * Validates event form data
 */
export const eventSchema = z.object({
  title: z.string().trim().min(1, 'Event title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  familyMember: z.string().min(1, 'Family member is required'),
  type: z.string().min(1, 'Event type is required'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  visibility: z.enum(['public', 'family', 'busy']),
  recurrenceType: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom']),
});

export function validateEventData(data: EventFormData): string[] {
  const errors: string[] = [];

  // Basic field validation
  const result = eventSchema.safeParse(data);
  if (!result.success) {
    errors.push(...result.error.errors.map(err => err.message));
  }

  // Date validation
  if (data.startDate && data.endDate) {
    if (data.endDate <= data.startDate && !data.allDay) {
      errors.push('End time must be after start time');
    }
  }

  // Recurrence validation
  if (data.recurrenceType !== 'none') {
    if (data.recurrenceEnd === 'on' && !data.recurrenceEndDate) {
      errors.push('Recurrence end date is required');
    }
    if (data.recurrenceEnd === 'after' && (!data.recurrenceCount || data.recurrenceCount < 1)) {
      errors.push('Recurrence count must be at least 1');
    }
    if (data.recurrenceInterval && data.recurrenceInterval < 1) {
      errors.push('Recurrence interval must be at least 1');
    }
  }

  return errors;
}

/**
 * Checks if two time ranges overlap
 */
export function hasTimeOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && end1 > start2;
}
