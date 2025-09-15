import { addDays, format, startOfWeek, parse, isToday } from 'date-fns';

// Property color mapping - predefined vibrant colors
const PROJECT_COLORS = [
  { main: '#2563eb', light: '#dbeafe' }, // Blue
  { main: '#d946ef', light: '#f5d0fe' }, // Magenta
  { main: '#f97316', light: '#ffedd5' }, // Orange
  { main: '#10b981', light: '#d1fae5' }, // Emerald
  { main: '#8b5cf6', light: '#ede9fe' }, // Purple
  { main: '#f43f5e', light: '#fee2e2' }, // Rose
  { main: '#0ea5e9', light: '#e0f2fe' }, // Sky
  { main: '#84cc16', light: '#ecfccb' }, // Lime
  { main: '#eab308', light: '#fef9c3' }, // Yellow
  { main: '#14b8a6', light: '#ccfbf1' }, // Teal
];

// Map to keep track of assigned colors
const projectColorMap = new Map<string, { main: string, light: string }>();

// Get color for a project (generates a consistent color for each project name)
export const getProjectColor = (projectName: string, isBrokerEvent: boolean = false): string => {
  if (!projectColorMap.has(projectName)) {
    // Assign the next color in the list
    const colorIndex = projectColorMap.size % PROJECT_COLORS.length;
    projectColorMap.set(projectName, PROJECT_COLORS[colorIndex]);
  }
  
  const colors = projectColorMap.get(projectName);
  return isBrokerEvent ? colors!.light : colors!.main;
};

// Get text color (white for dark backgrounds, dark for light backgrounds)
export const getTextColor = (backgroundColor: string): string => {
  // Simple heuristic: if it's a light color (likely a broker event), use dark text
  return backgroundColor.includes('light') || backgroundColor.startsWith('#f') || backgroundColor.startsWith('#e') || backgroundColor.startsWith('#d') ? '#4b5563' : 'white';
};

export type TimeSlot = {
  id: string;
  startTime: string; // format: "HH:mm"
  endTime: string; // format: "HH:mm"
  day: number; // 0-6 (Sunday-Saturday)
  projectName: string;
  location?: string;
  isBooked: boolean;
  parties?: number;
  duration?: number; // in minutes
  broker?: string; // Broker name
  isBrokerEvent?: boolean; // Flag to identify broker events
  associatedProject?: string; // Adding this field to track which property a broker event is associated with
  isCrossWeek?: boolean; // Flag to indicate events that span multiple weeks
  endDay?: number; // The end day for cross-week events
  
  // Added fields for positioning
  column?: number; // For positioning when events overlap
  columnCount?: number; // Total number of columns needed
};

export const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6am to 8pm

export const formatTime = (time: string): string => {
  // Convert "HH:mm" to "h:mm a" (e.g., "9:00 AM")
  return format(parse(time, 'HH:mm', new Date()), 'h:mm a');
};

// Modified to return only Monday to Friday (5 days)
export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
  return Array.from({ length: 5 }, (_, i) => addDays(start, i)); // Only return 5 days
};

export const formatDay = (date: Date): string => {
  return format(date, 'EEE');
};

export const formatDayNumber = (date: Date): string => {
  return format(date, 'd');
};

export const formatMonth = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const formatWeek = (date: Date): string => {
  const weekNumber = Math.ceil(Number(format(date, 'w')));
  return `Week ${weekNumber}`;
};

export const checkIsToday = (date: Date): boolean => {
  return isToday(date);
};

export const calculateTimeSlotPosition = (
  startTime: string,
  endTime: string
): { top: number; height: number } => {
  // Convert time strings to minutes since 6am (our first hour)
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutesSince6am = (startHour - 6) * 60 + startMinute;
  const endMinutesSince6am = (endHour - 6) * 60 + endMinute;
  
  // Calculate position (1 hour = 60px height)
  const top = (startMinutesSince6am / 60) * 60;
  const height = ((endMinutesSince6am - startMinutesSince6am) / 60) * 60;

  return { top, height };
};

export const getUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Helper function to convert "HH:mm" time string to minutes
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Function to check if two time slots overlap
const doSlotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  const slot1Start = timeToMinutes(slot1.startTime);
  const slot1End = timeToMinutes(slot1.endTime);
  const slot2Start = timeToMinutes(slot2.startTime);
  const slot2End = timeToMinutes(slot2.endTime);
  
  // Two events overlap if one starts before the other ends and ends after the other starts
  return (slot1Start < slot2End && slot1End > slot2Start);
};

// Organize time slots by calculating overlaps
export const organizeTimeSlots = (slots: TimeSlot[]): TimeSlot[] => {
  if (!slots.length) return [];
  
  // Group slots by day
  const slotsByDay: Record<number, TimeSlot[]> = {};
  slots.forEach(slot => {
    if (!slotsByDay[slot.day]) {
      slotsByDay[slot.day] = [];
    }
    slotsByDay[slot.day].push({...slot});
  });
  
  // Process each day's slots
  Object.keys(slotsByDay).forEach(dayKey => {
    const day = Number(dayKey);
    const daySlots = slotsByDay[day];
    
    // Sort slots by start time
    daySlots.sort((a, b) => {
      // Convert times to minutes for easy comparison
      const aStart = timeToMinutes(a.startTime);
      const bStart = timeToMinutes(b.startTime);
      
      if (aStart !== bStart) {
        return aStart - bStart;
      }
      
      // If start times are equal, sort by duration (shorter first)
      const aEnd = timeToMinutes(a.endTime);
      const bEnd = timeToMinutes(b.endTime);
      
      return (aEnd - aStart) - (bEnd - bStart);
    });
    
    // Find overlapping slots and assign columns using a more robust algorithm
    assignColumnsImproved(daySlots);
  });
  
  // Flatten the grouped slots back to a single array
  return Object.values(slotsByDay).flat();
};

// Improved algorithm for assigning columns to events
const assignColumnsImproved = (slots: TimeSlot[]): void => {
  if (!slots.length) return;
  
  // Create a map to track time periods and their occupied columns
  const timeSlices: { start: number, end: number, occupiedColumns: Set<number> }[] = [];
  
  // For each slot
  for (const slot of slots) {
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    
    // Find all time slices that overlap with this slot
    const overlappingSlices = timeSlices.filter(
      slice => slotStart < slice.end && slotEnd > slice.start
    );
    
    // Find the first available column across all overlapping time slices
    let column = 0;
    let columnFound = false;
    
    while (!columnFound) {
      columnFound = true;
      
      for (const slice of overlappingSlices) {
        if (slice.occupiedColumns.has(column)) {
          columnFound = false;
          column++;
          break;
        }
      }
    }
    
    // Assign the column to this slot
    slot.column = column;
    
    // Create or update time slices for this slot
    if (overlappingSlices.length === 0) {
      // No overlap, create a new time slice
      timeSlices.push({
        start: slotStart,
        end: slotEnd,
        occupiedColumns: new Set([column])
      });
    } else {
      // Update existing time slices and create new ones if needed
      const sortedSlices = [...overlappingSlices].sort((a, b) => a.start - b.start);
      
      // Check if we need to create a slice before the first overlapping slice
      if (slotStart < sortedSlices[0].start) {
        timeSlices.push({
          start: slotStart,
          end: sortedSlices[0].start,
          occupiedColumns: new Set([column])
        });
      }
      
      // Update existing slices and create slices between them
      for (let i = 0; i < sortedSlices.length; i++) {
        // Update this slice
        sortedSlices[i].occupiedColumns.add(column);
        
        // Create a slice between this and the next if needed
        if (i < sortedSlices.length - 1 && sortedSlices[i].end < sortedSlices[i + 1].start) {
          timeSlices.push({
            start: sortedSlices[i].end,
            end: sortedSlices[i + 1].start,
            occupiedColumns: new Set([column])
          });
        }
      }
      
      // Check if we need to create a slice after the last overlapping slice
      const lastSlice = sortedSlices[sortedSlices.length - 1];
      if (slotEnd > lastSlice.end) {
        timeSlices.push({
          start: lastSlice.end,
          end: slotEnd,
          occupiedColumns: new Set([column])
        });
      }
    }
  }
  
  // Find the maximum column number used
  let maxColumn = 0;
  for (const slot of slots) {
    maxColumn = Math.max(maxColumn, slot.column || 0);
  }
  
  // Set columnCount for all slots
  const columnCount = maxColumn + 1;
  for (const slot of slots) {
    slot.columnCount = columnCount;
  }
};
