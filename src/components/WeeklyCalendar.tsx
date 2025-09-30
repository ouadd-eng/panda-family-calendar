import React, { useMemo, useState } from 'react';
import { HOURS, getWeekDays, formatDay, formatDayNumber, checkIsToday } from '@/utils/calendarUtils';
import { cn } from '@/lib/utils';
import BookingDialog from './BookingDialog';
import EventDetailsDialog from './EventDetailsDialog';
import { Event } from '@/hooks/useEvents';
import { format, isSameDay } from 'date-fns';
import { getProjectColor } from '@/utils/calendarUtils';

interface WeeklyCalendarProps {
  currentDate: Date;
  events: Event[];
  familyMembers: string[];
  selectedMember?: string;
  onCreateEvent: (eventData: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onUpdateEvent: (id: string, eventData: Partial<Event>) => void;
  onDeleteEvent: (id: string) => void;
}

interface PositionedEvent extends Event {
  top: number;
  height: number;
  column: number;
  columnCount: number;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
  currentDate, 
  events,
  familyMembers = [],
  selectedMember = "ALL",
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const weekDays = getWeekDays(currentDate);
  const [bookingDialogInfo, setBookingDialogInfo] = useState<{
    isOpen: boolean;
    day: Date;
    startTime: string;
    endTime: string;
  }>({
    isOpen: false,
    day: new Date(),
    startTime: "09:00",
    endTime: "10:00"
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Convert events to positioned events for each day
  const positionedEventsByDay = useMemo(() => {
    const eventsByDay: Record<number, PositionedEvent[]> = {};
    
    weekDays.forEach((day, dayIndex) => {
      const dayEvents = events.filter(event => 
        isSameDay(new Date(event.date), day)
      );
      
      // Sort events by start time
      dayEvents.sort((a, b) => {
        const aMinutes = parseInt(a.start_time.split(':')[0]) * 60 + parseInt(a.start_time.split(':')[1]);
        const bMinutes = parseInt(b.start_time.split(':')[0]) * 60 + parseInt(b.start_time.split(':')[1]);
        return aMinutes - bMinutes;
      });
      
      // Calculate positions
      const positioned: PositionedEvent[] = dayEvents.map(event => {
        const [startHour, startMinute] = event.start_time.split(':').map(Number);
        const [endHour, endMinute] = event.end_time.split(':').map(Number);
        
        const startMinutesSince6am = (startHour - 6) * 60 + startMinute;
        const endMinutesSince6am = (endHour - 6) * 60 + endMinute;
        
        const top = (startMinutesSince6am / 60) * 60;
        const height = ((endMinutesSince6am - startMinutesSince6am) / 60) * 60;
        
        return {
          ...event,
          top,
          height,
          column: 0,
          columnCount: 1,
        };
      });
      
      // Calculate overlaps and assign columns
      for (let i = 0; i < positioned.length; i++) {
        const current = positioned[i];
        let maxColumn = 0;
        
        for (let j = 0; j < i; j++) {
          const other = positioned[j];
          // Check if they overlap
          if (current.top < other.top + other.height && current.top + current.height > other.top) {
            maxColumn = Math.max(maxColumn, other.column + 1);
          }
        }
        
        current.column = maxColumn;
        
        // Update column count for overlapping events
        for (let j = 0; j <= i; j++) {
          const other = positioned[j];
          if (current.top < other.top + other.height && current.top + current.height > other.top) {
            other.columnCount = Math.max(other.columnCount, maxColumn + 1);
          }
        }
        current.columnCount = Math.max(current.columnCount, maxColumn + 1);
      }
      
      eventsByDay[dayIndex] = positioned;
    });
    
    return eventsByDay;
  }, [events, weekDays]);
  
  const handleCellClick = (day: Date, hour: number) => {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    setBookingDialogInfo({
      isOpen: true,
      day,
      startTime,
      endTime
    });
  };
  
  const closeBookingDialog = () => {
    setBookingDialogInfo(prev => ({ ...prev, isOpen: false }));
  };
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };
  
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  return (
    <div className="w-full overflow-hidden">
      {/* Day headers - Desktop */}
      <div className="hidden md:grid grid-cols-[60px_repeat(5,1fr)] border-b border-border">
        <div className="time-column"></div>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={cn(
              "day-column p-3 text-center border-l border-border",
              checkIsToday(day) && "bg-calendar-today-highlight"
            )}
          >
            <div className="text-xs uppercase font-medium text-muted-foreground tracking-wide">{formatDay(day)}</div>
            <div className={cn(
              "text-xl font-medium mt-1",
              checkIsToday(day) ? "text-primary" : "text-foreground"
            )}>
              {formatDayNumber(day)}
            </div>
          </div>
        ))}
      </div>

      {/* Day headers - Mobile */}
      <div className="md:hidden border-b border-border p-4">
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={cn(
                "flex-shrink-0 text-center p-3 rounded-lg min-w-[80px]",
                checkIsToday(day) ? "bg-primary text-primary-foreground" : "bg-card border border-border"
              )}
            >
              <div className="text-xs uppercase font-medium tracking-wide opacity-80">{formatDay(day)}</div>
              <div className="text-lg font-medium mt-1">{formatDayNumber(day)}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="calendar-grid-container relative grid grid-cols-[60px_repeat(5,1fr)] overflow-y-auto no-scrollbar">
        {/* Time labels - Desktop */}
        <div className="time-column hidden md:block">
          {HOURS.map((hour) => (
            <div key={hour} className="h-[60px] text-right pr-3 text-xs text-muted-foreground font-medium relative">
              <span className="absolute top-[-9px] right-3">
                {hour === 12 ? '12:00 PM' : hour < 12 ? `${hour}:00 AM` : `${hour-12}:00 PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Time labels - Mobile */}
        <div className="time-column md:hidden">
          {HOURS.map((hour) => (
            <div key={hour} className="h-[50px] text-right pr-2 text-xs text-muted-foreground font-medium relative">
              <span className="absolute top-[-7px] right-2">
                {hour === 12 ? '12PM' : hour < 12 ? `${hour}AM` : `${hour-12}PM`}
              </span>
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {weekDays.map((day, dayIndex) => (
          <div 
            key={dayIndex} 
            className={cn(
              "day-column relative border-l border-border",
              checkIsToday(day) && "bg-calendar-today-highlight"
            )}
          >
            {/* Hour grid lines with click handler */}
            {HOURS.map((hour) => (
              <div 
                key={hour} 
                className={cn(
                  "border-b border-border cursor-pointer hover:bg-muted/30 transition-colors",
                  "h-[60px] md:h-[60px]"
                )}
                onClick={() => handleCellClick(day, hour)}
              ></div>
            ))}
            
            {/* Events for this day */}
            {positionedEventsByDay[dayIndex]?.map(event => {
              const width = `${100 / event.columnCount}%`;
              const left = `${(event.column * 100) / event.columnCount}%`;
              const bgColor = getProjectColor(event.family_member);
              
              return (
                <div
                  key={event.id}
                  className="absolute rounded-md px-2 py-1 text-xs font-medium flex flex-col justify-start overflow-hidden cursor-pointer hover:brightness-95 transition-all border"
                  style={{
                    top: `${event.top}px`,
                    height: `${event.height}px`,
                    width,
                    left,
                    backgroundColor: bgColor,
                    color: 'white',
                    borderColor: 'rgba(0,0,0,0.1)',
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="font-semibold truncate">{event.title}</div>
                  <div className="truncate text-[10px] opacity-90">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </div>
                  <div className="text-[10px] mt-0.5 opacity-80 truncate">
                    {event.family_member}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Booking Dialog */}
      <BookingDialog 
        isOpen={bookingDialogInfo.isOpen}
        onClose={closeBookingDialog}
        day={bookingDialogInfo.day}
        startTime={bookingDialogInfo.startTime}
        endTime={bookingDialogInfo.endTime}
        familyMembers={familyMembers}
        selectedMember={selectedMember}
        onCreateEvent={onCreateEvent}
      />
      
      {/* Event Details Dialog */}
      <EventDetailsDialog
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdate={onUpdateEvent}
        onDelete={onDeleteEvent}
      />
    </div>
  );
};

export default WeeklyCalendar;