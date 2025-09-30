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
export type { 
  CalendarEvent,
  EventFormData, 
  CreateEventData, 
  UpdateEventData,
  Family,
  FamilyMember,
  GoogleAccount,
  EventInstance,
} from './domain/types';
export { 
  validateEventData, 
  validateFamilyData,
  validateInviteMemberData,
  hasTimeOverlap 
} from './domain/validators';

// Recurrence handling
export { 
  generateRRule,
  expandRecurringEvent,
  parseRRuleToText,
  addExceptionDate,
  updateRRuleForThisAndFollowing,
} from './domain/recurrence';

// Data layer - Events
export { 
  fetchWeekEvents, 
  fetchAllFamilyEvents,
  createEvent, 
  updateEvent, 
  deleteEvent 
} from './data/eventRepository';

// Data layer - Families
export {
  fetchUserFamilies,
  createFamily,
  updateFamily,
  deleteFamily,
  fetchFamilyMembers,
  inviteFamilyMember,
  removeFamilyMember,
  hasFamily,
} from './data/familyRepository';

// Data layer - Google Calendar
export {
  fetchGoogleAccount,
  upsertGoogleAccount,
  updateSyncSettings,
  updateSyncTimestamp,
  disconnectGoogleAccount,
} from './data/googleCalendarRepository';

// Utils
export { 
  formatMonth, 
  formatWeek, 
  getWeekDays, 
  getProjectColor 
} from './utils/calendarUtils';
