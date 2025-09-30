/**
 * Calendar domain validation logic
 */

import { EventFormData } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates event form data
 */
export function validateEventData(data: EventFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Type validation
  if (!data.type) {
    errors.type = 'Event type is required';
  }

  // Family member validation
  if (!data.familyMember) {
    errors.familyMember = 'Family member is required';
  }

  // Time validation
  if (!data.startTime) {
    errors.startTime = 'Start time is required';
  }
  if (!data.endTime) {
    errors.endTime = 'End time is required';
  }

  // Start time must be before end time
  if (data.startTime && data.endTime) {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      errors.time = 'End time must be after start time';
    }
  }

  // Notes validation (optional, but limit length)
  if (data.notes && data.notes.length > 500) {
    errors.notes = 'Notes must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Checks if two time ranges overlap
 */
export function hasTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const [h1, m1] = start1.split(':').map(Number);
  const [h2, m2] = end1.split(':').map(Number);
  const [h3, m3] = start2.split(':').map(Number);
  const [h4, m4] = end2.split(':').map(Number);

  const start1Min = h1 * 60 + m1;
  const end1Min = h2 * 60 + m2;
  const start2Min = h3 * 60 + m3;
  const end2Min = h4 * 60 + m4;

  return start1Min < end2Min && start2Min < end1Min;
}
