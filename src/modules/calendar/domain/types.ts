/**
 * Calendar domain types
 * Extracted from the events table schema
 */

export interface Event {
  id: string;
  user_id: string;
  title: string;
  type: string;
  family_member: string;
  start_time: string;
  end_time: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  title: string;
  type: string;
  familyMember: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface CreateEventData {
  title: string;
  type: string;
  family_member: string;
  start_time: string;
  end_time: string;
  date: string;
  notes?: string;
}

export interface UpdateEventData {
  title?: string;
  type?: string;
  family_member?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  notes?: string;
}
