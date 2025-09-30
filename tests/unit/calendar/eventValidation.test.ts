/**
 * Unit tests for event validation logic
 */

import { describe, it, expect } from 'vitest';
import { validateEventData, hasTimeOverlap } from '../../../src/modules/calendar/domain/validators';
import type { EventFormData } from '../../../src/modules/calendar/domain/types';

describe('Event Validation', () => {
  describe('validateEventData', () => {
    it('should validate a correct event', () => {
      const validEvent: EventFormData = {
        title: 'Team Meeting',
        type: 'Meeting',
        familyMember: 'Ahmed',
        startTime: '09:00',
        endTime: '10:00',
        notes: 'Discuss project updates',
      };

      const result = validateEventData(validEvent);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should reject empty title', () => {
      const invalidEvent: EventFormData = {
        title: '',
        type: 'Meeting',
        familyMember: 'Ahmed',
        startTime: '09:00',
        endTime: '10:00',
      };

      const result = validateEventData(invalidEvent);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it('should reject title longer than 100 characters', () => {
      const invalidEvent: EventFormData = {
        title: 'a'.repeat(101),
        type: 'Meeting',
        familyMember: 'Ahmed',
        startTime: '09:00',
        endTime: '10:00',
      };

      const result = validateEventData(invalidEvent);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it('should reject when end time is before start time', () => {
      const invalidEvent: EventFormData = {
        title: 'Meeting',
        type: 'Meeting',
        familyMember: 'Ahmed',
        startTime: '10:00',
        endTime: '09:00',
      };

      const result = validateEventData(invalidEvent);
      expect(result.isValid).toBe(false);
      expect(result.errors.time).toBeDefined();
    });

    it('should reject when end time equals start time', () => {
      const invalidEvent: EventFormData = {
        title: 'Meeting',
        type: 'Meeting',
        familyMember: 'Ahmed',
        startTime: '09:00',
        endTime: '09:00',
      };

      const result = validateEventData(invalidEvent);
      expect(result.isValid).toBe(false);
      expect(result.errors.time).toBeDefined();
    });

    it('should reject notes longer than 500 characters', () => {
      const invalidEvent: EventFormData = {
        title: 'Meeting',
        type: 'Meeting',
        familyMember: 'Ahmed',
        startTime: '09:00',
        endTime: '10:00',
        notes: 'a'.repeat(501),
      };

      const result = validateEventData(invalidEvent);
      expect(result.isValid).toBe(false);
      expect(result.errors.notes).toBeDefined();
    });
  });

  describe('hasTimeOverlap', () => {
    it('should detect overlapping events', () => {
      const overlap = hasTimeOverlap('09:00', '11:00', '10:00', '12:00');
      expect(overlap).toBe(true);
    });

    it('should detect when first event contains second event', () => {
      const overlap = hasTimeOverlap('09:00', '12:00', '10:00', '11:00');
      expect(overlap).toBe(true);
    });

    it('should not detect overlap when events are adjacent', () => {
      const overlap = hasTimeOverlap('09:00', '10:00', '10:00', '11:00');
      expect(overlap).toBe(false);
    });

    it('should not detect overlap when events are separate', () => {
      const overlap = hasTimeOverlap('09:00', '10:00', '11:00', '12:00');
      expect(overlap).toBe(false);
    });
  });
});
