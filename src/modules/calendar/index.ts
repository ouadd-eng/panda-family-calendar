/**
 * Calendar module exports
 * Provides a clean API for the calendar feature
 */

// Main page component
export { default as CalendarPage } from './pages/CalendarPage';

// Components
export { default as WeeklyCalendar } from './components/WeeklyCalendar';
export { default as CalendarHeader } from './components/CalendarHeader';
export { default as BookingDialog } from './components/BookingDialog';
export { default as EventDetailsDialog } from './components/EventDetailsDialog';
export { default as MonthSelector } from './components/MonthSelector';

// Hooks
export { useEvents } from './hooks/useEvents';

// Domain types and validators
export type { Event, EventFormData, CreateEventData, UpdateEventData } from './domain/types';
export { validateEventData, hasTimeOverlap } from './domain/validators';

// Data layer
export { 
  fetchWeekEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from './data/eventRepository';

// Utils
export { 
  formatMonth, 
  formatWeek, 
  getWeekDays, 
  getProjectColor 
} from './utils/calendarUtils';
