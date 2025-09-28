
import React, { useMemo, useState } from 'react';
import { HOURS, TimeSlot, getWeekDays, formatDay, formatDayNumber, checkIsToday, organizeTimeSlots } from '@/utils/calendarUtils';
import TimeSlotComponent from './TimeSlot';
import { cn } from '@/lib/utils';
import BookingDialog from './BookingDialog';

interface WeeklyCalendarProps {
  currentDate: Date;
  timeSlots: TimeSlot[];
  projectNames?: string[];
  selectedProject?: string;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
  currentDate, 
  timeSlots,
  projectNames = [],
  selectedProject = "ALL"
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
  
  // Organize time slots to handle overlaps
  const organizedTimeSlots = useMemo(() => {
    return organizeTimeSlots(timeSlots);
  }, [timeSlots]);
  
  // Handle click on a calendar cell
  const handleCellClick = (day: Date, hour: number) => {
    // Format hours to HH:mm format
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    setBookingDialogInfo({
      isOpen: true,
      day,
      startTime,
      endTime
    });
  };
  
  // Close the booking dialog
  const closeBookingDialog = () => {
    setBookingDialogInfo(prev => ({ ...prev, isOpen: false }));
  };
  
  return (
    <div className="w-full overflow-hidden">
      {/* Day headers */}
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

      {/* Mobile day selector */}
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
      <div className="calendar-grid-container relative grid grid-cols-[60px_repeat(5,1fr)] md:grid-cols-[60px_repeat(5,1fr)] overflow-y-auto no-scrollbar">
        {/* Time labels */}
        <div className="time-column hidden md:block">
          {HOURS.map((hour) => (
            <div key={hour} className="h-[60px] text-right pr-3 text-xs text-muted-foreground font-medium relative">
              <span className="absolute top-[-9px] right-3">
                {hour === 12 ? '12:00 PM' : hour < 12 ? `${hour}:00 AM` : `${hour-12}:00 PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile time labels */}
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
                  "h-[60px] md:h-[60px]" // Responsive height
                )}
                onClick={() => handleCellClick(day, hour)}
              ></div>
            ))}
            
            {/* Time slots for this day */}
            {organizedTimeSlots
              .filter(slot => {
                // Filter by weekday (Monday=1, Tuesday=2, etc.)
                const slotDay = slot.day;
                // Only show slots for Monday-Friday (day 1-5)
                return slotDay >= 1 && slotDay <= 5;
              })
              .filter(slot => slot.day === dayIndex + 1) // Our day index is 1-based (Monday=1)
              .map(slot => (
                <TimeSlotComponent 
                  key={slot.id} 
                  slot={slot} 
                  allTimeSlots={timeSlots} // Pass all time slots to components
                />
              ))
            }
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
        projectNames={projectNames}
        selectedProject={selectedProject}
      />
    </div>
  );
};

export default WeeklyCalendar;
