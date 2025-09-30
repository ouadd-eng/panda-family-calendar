/**
 * Event repository - handles all Supabase queries for events
 */

import { supabase } from '@/integrations/supabase/client';
import { CreateEventData, UpdateEventData, Event } from '../domain/types';
import { startOfWeek, endOfWeek } from 'date-fns';

/**
 * Fetches events for a given week
 */
export async function fetchWeekEvents(currentDate: Date): Promise<Event[]> {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', weekStart.toISOString().split('T')[0])
    .lte('date', weekEnd.toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return (data || []) as Event[];
}

/**
 * Creates a new event
 */
export async function createEvent(
  eventData: CreateEventData
): Promise<Event> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        ...eventData,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return data as Event;
}

/**
 * Updates an existing event
 */
export async function updateEvent(
  id: string,
  eventData: UpdateEventData
): Promise<Event> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return data as Event;
}

/**
 * Deletes an event
 */
export async function deleteEvent(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}
