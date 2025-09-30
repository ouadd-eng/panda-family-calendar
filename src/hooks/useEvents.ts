import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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

export const useEvents = (currentDate: Date) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get the start and end of the week for the current date
  const weekStart = format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  // Fetch events for the current week
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', weekStart, weekEnd, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', weekStart)
        .lte('date', weekEnd)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        throw error;
      }

      return data as Event[];
    },
    enabled: !!user,
  });

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    },
  });

  // Update event mutation
  const updateEvent = useMutation({
    mutationFn: async ({ id, ...eventData }: Partial<Event> & { id: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully');
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    },
  });

  // Delete event mutation
  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    },
  });

  return {
    events,
    isLoading,
    createEvent: createEvent.mutate,
    updateEvent: updateEvent.mutate,
    deleteEvent: deleteEvent.mutate,
  };
};