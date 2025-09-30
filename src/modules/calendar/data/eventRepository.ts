/**
 * Calendar event repository - handles all Supabase queries for calendar events
 */

import { supabase } from '@/integrations/supabase/client';
import { CreateEventData, UpdateEventData, CalendarEvent } from '../domain/types';
import { startOfWeek, endOfWeek } from 'date-fns';

/**
 * Fetches events for a given week and family
 */
export async function fetchWeekEvents(
  currentDate: Date,
  familyId: string
): Promise<CalendarEvent[]> {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  const { data, error } = await supabase
    .from('calendar_event')
    .select('*')
    .eq('family_id', familyId)
    .gte('start_ts', weekStart.toISOString())
    .lte('start_ts', weekEnd.toISOString())
    .order('start_ts', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return (data || []) as CalendarEvent[];
}

/**
 * Fetches all events for a family (for recurrence expansion)
 */
export async function fetchAllFamilyEvents(familyId: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_event')
    .select('*')
    .eq('family_id', familyId)
    .order('start_ts', { ascending: true });

  if (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }

  return (data || []) as CalendarEvent[];
}

/**
 * Creates a new event
 */
export async function createEvent(
  eventData: CreateEventData
): Promise<CalendarEvent> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('calendar_event')
    .insert([
      {
        ...eventData,
        creator_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return data as CalendarEvent;
}

/**
 * Updates an existing event
 */
export async function updateEvent(
  id: string,
  eventData: UpdateEventData
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('calendar_event')
    .update(eventData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return data as CalendarEvent;
}

/**
 * Deletes an event
 */
export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('calendar_event')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}
