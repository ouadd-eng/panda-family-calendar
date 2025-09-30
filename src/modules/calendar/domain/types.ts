/**
 * Calendar domain types for multi-tenant family calendar
 * with recurrence and Google Calendar integration
 */

// Family and Member types
export type FamilyRole = 'owner' | 'member';
export type MemberStatus = 'pending' | 'active';
export type EventVisibility = 'public' | 'family' | 'busy';
export type EventSource = 'local' | 'google';

export interface Family {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id?: string;
  invited_email?: string;
  role: FamilyRole;
  status: MemberStatus;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  family_id: string;
  creator_id: string;
  title: string;
  description?: string;
  location?: string;
  start_ts: string;
  end_ts: string;
  all_day: boolean;
  
  // Recurrence (RFC5545)
  rrule?: string;
  exdates?: string[]; // ISO date strings
  
  // Google Calendar
  visibility: EventVisibility;
  source: EventSource;
  google_event_id?: string;
  google_calendar_id?: string;
  
  // Legacy fields
  type: string;
  family_member: string;
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface GoogleAccount {
  id: string;
  user_id: string;
  google_email: string;
  refresh_token: string;
  access_token?: string;
  token_expires_at?: string;
  synced_at?: string;
  sync_calendars: string[]; // Calendar IDs
  import_mode: 'details' | 'busy';
  created_at: string;
  updated_at: string;
}

// Form data types
export interface FamilyFormData {
  name: string;
}

export interface InviteMemberFormData {
  email: string;
  role: FamilyRole;
}

export interface EventFormData {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  familyMember: string;
  type: string;
  notes?: string;
  visibility: EventVisibility;
  
  // Recurrence
  recurrenceType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  recurrenceInterval?: number;
  recurrenceEnd?: 'never' | 'on' | 'after';
  recurrenceEndDate?: Date;
  recurrenceCount?: number;
  recurrenceByDay?: number[]; // 0-6 for Sunday-Saturday
}

export interface CreateEventData {
  family_id: string;
  title: string;
  description?: string;
  location?: string;
  start_ts: string;
  end_ts: string;
  all_day: boolean;
  rrule?: string;
  exdates?: string[];
  visibility: EventVisibility;
  type: string;
  family_member: string;
  notes?: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: string;
  start_ts?: string;
  end_ts?: string;
  all_day?: boolean;
  rrule?: string;
  exdates?: string[];
  visibility?: EventVisibility;
  type?: string;
  family_member?: string;
  notes?: string;
}

// Expanded event instance (for calendar display)
export interface EventInstance extends CalendarEvent {
  instanceDate: Date; // Specific occurrence date
  isRecurring: boolean;
}

// Edit scope for recurring events
export type EditScope = 'this' | 'thisAndFollowing' | 'all';

// Google Calendar types
export interface GoogleCalendar {
  id: string;
  summary: string;
  primary?: boolean;
  backgroundColor?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  recurrence?: string[];
  transparency?: 'opaque' | 'transparent';
}
