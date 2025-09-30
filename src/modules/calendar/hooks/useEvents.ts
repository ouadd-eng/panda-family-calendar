/**
 * Custom hook for managing calendar events
 * Uses React Query for caching and Supabase for persistence
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  fetchWeekEvents, 
  createEvent as createEventRepo,
  updateEvent as updateEventRepo,
  deleteEvent as deleteEventRepo 
} from '../data/eventRepository';
import { CreateEventData, UpdateEventData } from '../domain/types';

export const useEvents = (currentDate: Date) => {
  const queryClient = useQueryClient();

  // Fetch events for the current week
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', currentDate.toISOString()],
    queryFn: () => fetchWeekEvents(currentDate),
  });

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: (eventData: CreateEventData) => createEventRepo(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    },
  });

  // Update event mutation
  const updateEvent = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      updateEventRepo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
    },
  });

  // Delete event mutation
  const deleteEvent = useMutation({
    mutationFn: (id: string) => deleteEventRepo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    },
  });

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
