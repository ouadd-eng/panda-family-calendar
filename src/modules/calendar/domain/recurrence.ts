/**
 * Recurrence handling using RFC5545 RRULE
 */

import { RRule, RRuleSet, rrulestr } from 'rrule';
import { EventFormData, CalendarEvent, EventInstance } from './types';

/**
 * Generate RRULE string from form data
 */
export function generateRRule(formData: EventFormData): string | undefined {
  if (formData.recurrenceType === 'none') {
    return undefined;
  }

  const options: any = {
    dtstart: formData.startDate,
  };

  // Set frequency
  switch (formData.recurrenceType) {
    case 'daily':
      options.freq = RRule.DAILY;
      break;
    case 'weekly':
      options.freq = RRule.WEEKLY;
      if (formData.recurrenceByDay && formData.recurrenceByDay.length > 0) {
        options.byweekday = formData.recurrenceByDay.map(day => [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA][day]);
      }
      break;
    case 'monthly':
      options.freq = RRule.MONTHLY;
      break;
    case 'yearly':
      options.freq = RRule.YEARLY;
      break;
  }

  // Set interval
  if (formData.recurrenceInterval && formData.recurrenceInterval > 1) {
    options.interval = formData.recurrenceInterval;
  }

  // Set end condition
  if (formData.recurrenceEnd === 'on' && formData.recurrenceEndDate) {
    options.until = formData.recurrenceEndDate;
  } else if (formData.recurrenceEnd === 'after' && formData.recurrenceCount) {
    options.count = formData.recurrenceCount;
  }

  const rule = new RRule(options);
  return rule.toString();
}

/**
 * Expand recurring event into instances for a date range
 */
export function expandRecurringEvent(
  event: CalendarEvent,
  startDate: Date,
  endDate: Date
): EventInstance[] {
  if (!event.rrule) {
    // Non-recurring event
    const eventStart = new Date(event.start_ts);
    if (eventStart >= startDate && eventStart <= endDate) {
      return [{
        ...event,
        instanceDate: eventStart,
        isRecurring: false,
      }];
    }
    return [];
  }

  try {
    // Parse RRULE
    const rruleSet = new RRuleSet();
    
    // Add the RRULE
    const rule = rrulestr(event.rrule, {
      dtstart: new Date(event.start_ts),
    });
    rruleSet.rrule(rule);

    // Add exception dates (EXDATE)
    if (event.exdates && event.exdates.length > 0) {
      event.exdates.forEach(exdate => {
        rruleSet.exdate(new Date(exdate));
      });
    }

    // Get occurrences in the date range
    const occurrences = rruleSet.between(startDate, endDate, true);

    // Create event instances
    return occurrences.map(date => {
      // Calculate the duration
      const originalStart = new Date(event.start_ts);
      const originalEnd = new Date(event.end_ts);
      const duration = originalEnd.getTime() - originalStart.getTime();

      // Create new start/end times for this instance
      const instanceStart = new Date(date);
      const instanceEnd = new Date(date.getTime() + duration);

      return {
        ...event,
        start_ts: instanceStart.toISOString(),
        end_ts: instanceEnd.toISOString(),
        instanceDate: instanceStart,
        isRecurring: true,
      };
    });
  } catch (error) {
    console.error('Error expanding recurring event:', error);
    return [];
  }
}

/**
 * Parse RRULE to human-readable text
 */
export function parseRRuleToText(rruleString: string): string {
  try {
    const rule = rrulestr(rruleString);
    return rule.toText();
  } catch (error) {
    console.error('Error parsing RRULE:', error);
    return 'Invalid recurrence rule';
  }
}

/**
 * Add exception date to recurring event
 */
export function addExceptionDate(
  existingExdates: string[] | undefined,
  exceptionDate: Date
): string[] {
  const exdates = existingExdates || [];
  const isoDate = exceptionDate.toISOString();
  
  if (!exdates.includes(isoDate)) {
    return [...exdates, isoDate];
  }
  
  return exdates;
}

/**
 * Update RRULE for "this and following" edit
 */
export function updateRRuleForThisAndFollowing(
  rruleString: string,
  splitDate: Date
): string {
  try {
    const rule = rrulestr(rruleString);
    const options = rule.options;
    
    // Set until date to the day before the split
    const until = new Date(splitDate);
    until.setDate(until.getDate() - 1);
    
    const newRule = new RRule({
      ...options,
      until,
    });
    
    return newRule.toString();
  } catch (error) {
    console.error('Error updating RRULE:', error);
    return rruleString;
  }
}
