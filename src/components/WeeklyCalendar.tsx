
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
      <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b">
        <div className="time-column"></div>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={cn(
              "day-column p-2 text-center border-l",
              checkIsToday(day) && "bg-calendar-today-highlight"
            )}
          >
            <div className="text-sm uppercase font-medium text-gray-500">{formatDay(day)}</div>
            <div className={cn(
              "text-2xl font-medium mt-1",
              checkIsToday(day) ? "text-blue-500" : "text-gray-700"
            )}>
              {formatDayNumber(day)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="calendar-grid-container relative grid grid-cols-[60px_repeat(5,1fr)] overflow-y-auto no-scrollbar">
        {/* Time labels */}
        <div className="time-column">
          {HOURS.map((hour) => (
            <div key={hour} className="h-[60px] text-right pr-2 text-xs text-gray-500 font-medium relative">
              <span className="absolute top-[-9px] right-2">
                {hour === 12 ? '12:00 PM' : hour < 12 ? `${hour}:00 AM` : `${hour-12}:00 PM`}
              </span>
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {weekDays.map((day, dayIndex) => (
          <div 
            key={dayIndex} 
            className={cn(
              "day-column relative border-l",
              checkIsToday(day) && "bg-calendar-today-highlight"
            )}
          >
            {/* Hour grid lines with click handler */}
            {HOURS.map((hour) => (
              <div 
                key={hour} 
                className="h-[60px] border-b border-gray-100 cursor-pointer hover:bg-gray-50"
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
