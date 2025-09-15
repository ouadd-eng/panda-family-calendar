import React, { useRef, useEffect } from 'react';
import { X, MapPin, Clock, Calendar, User, ExternalLink, CalendarClock } from 'lucide-react';
import { formatTime } from '@/utils/calendarUtils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import type { TimeSlot } from '@/utils/calendarUtils';
import { format, isSameDay, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimeSlotOverlayProps {
  slot: TimeSlot | null;
  isOpen: boolean;
  onClose: () => void;
  allTimeSlots?: TimeSlot[];
}

const TimeSlotOverlay: React.FC<TimeSlotOverlayProps> = ({ 
  slot, 
  isOpen, 
  onClose, 
  allTimeSlots = [] 
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !slot) return null;

  const today = new Date();
  const mockDate = today;
  const zipcode = "10001";

  const mockTimeSlots = [
    { time: '2:30 to 2:50', slot1: 'John Snow', slot2: 'Regula Jansen' },
    { time: '2:55 to 3:15', slot1: 'Arya Stark', slot2: 'Mark Zukerberg' },
    { time: '3:20 to 3:40', slot1: 'Tyrion Lannister', slot2: 'Tim Cook' },
    { time: '3:45 to 4:05', slot1: 'Daenerys Targaryen', slot2: 'Bill Gates' },
    { time: '4:10 to 4:30', slot1: 'Jon Snow', slot2: 'Steve Jobs' },
  ];

  const timeSlots = slot.parties && slot.duration ? 
    generateTimeSlots(slot.startTime, slot.endTime, slot.duration, slot.parties) : 
    mockTimeSlots;

  const otherViewings = React.useMemo(() => {
    if (!allTimeSlots.length || !slot.projectName) return [];

    const currentSlotDay = slot.day;
    const currentDate = new Date();
    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1);

    const slotDate = new Date(weekStartDate);
    slotDate.setDate(slotDate.getDate() + (currentSlotDay - 1));

    return allTimeSlots
      .filter(otherSlot => 
        otherSlot.projectName === slot.projectName && 
        otherSlot.id !== slot.id && 
        !otherSlot.isBrokerEvent
      )
      .slice(0, 5)
      .map(otherSlot => {
        const otherSlotDate = new Date(weekStartDate);
        otherSlotDate.setDate(otherSlotDate.getDate() + (otherSlot.day - 1));

        const dateString = format(otherSlotDate, 'EEE, MMM d');
        const timeString = `${formatTime(otherSlot.startTime)} - ${formatTime(otherSlot.endTime)}`;

        return {
          id: otherSlot.id,
          date: dateString,
          time: timeString,
          isToday: isSameDay(otherSlotDate, currentDate),
          isFuture: isAfter(otherSlotDate, currentDate)
        };
      })
      .sort((a, b) => {
        if (a.isToday) return -1;
        if (b.isToday) return 1;
        if (a.isFuture && !b.isFuture) return -1;
        if (!a.isFuture && b.isFuture) return 1;
        return 0;
      });
  }, [allTimeSlots, slot]);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        aria-hidden="true"
        onClick={onClose}
      />
      
      <div 
        ref={panelRef}
        className="fixed top-0 right-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-50 w-full max-w-md transform border-l dark:border-gray-800"
      >
        <div className="flex flex-col h-full">
          <div className="border-b p-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold">{slot.projectName}</h2>
              </div>
              <button 
                className="rounded-full p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm ml-[52px]">
              {slot.location || "No description provided"}
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-5">
              <div className="flex items-center gap-6 ml-[52px]">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium">{formatTime(slot.startTime)}</span>
                    <span className="mx-1">-</span>
                    <span className="font-medium">{formatTime(slot.endTime)}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <div className="text-sm font-medium">
                    {format(mockDate, 'dd MMM yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center ml-[52px]">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <div className="text-sm font-medium">{zipcode}</div>
              </div>
              
              <div className="ml-[52px] mt-2">
                <Button 
                  className="bg-black hover:bg-black/90 text-white"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Project
                </Button>
              </div>
              
              {otherViewings.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="font-medium flex items-center">
                      <CalendarClock className="h-4 w-4 mr-1.5 text-gray-500" />
                      Other Scheduled Viewings
                    </div>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                      {otherViewings.map((viewing) => (
                        <div 
                          key={viewing.id} 
                          className={cn(
                            "text-sm py-1.5 px-2 rounded border-l-2",
                            viewing.isToday 
                              ? "border-blue-500 bg-blue-50" 
                              : viewing.isFuture 
                                ? "border-emerald-500 bg-emerald-50" 
                                : "border-gray-300"
                          )}
                        >
                          <div className="font-medium">{viewing.date}</div>
                          <div className="text-gray-600">{viewing.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="font-medium">Time Slots</div>
                <div className="space-y-2">
                  {timeSlots.map((timeSlot, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm font-medium text-gray-700 mb-2">{timeSlot.time}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs flex items-center">
                          <User className="h-3 w-3 mr-1 text-gray-500" />
                          <span>Slot 1: {timeSlot.slot1}</span>
                        </div>
                        <div className="text-xs flex items-center">
                          <User className="h-3 w-3 mr-1 text-gray-500" />
                          <span>Slot 2: {timeSlot.slot2}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function generateTimeSlots(startTime: string, endTime: string, duration: number, parties: number) {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  const totalTime = endMinutes - startMinutes;
  
  const numSlots = Math.floor(totalTime / duration);
  
  const names = [
    'John Snow', 'Arya Stark', 'Tyrion Lannister', 'Daenerys Targaryen',
    'Jon Snow', 'Sansa Stark', 'Cersei Lannister', 'Jaime Lannister',
    'Regula Jansen', 'Mark Zukerberg', 'Tim Cook', 'Bill Gates', 'Steve Jobs'
  ];
  
  const slots = [];
  for (let i = 0; i < numSlots; i++) {
    const slotStartMinutes = startMinutes + i * duration;
    const slotEndMinutes = slotStartMinutes + duration - 5;
    
    const startTimeFormatted = `${Math.floor(slotStartMinutes / 60)}:${(slotStartMinutes % 60).toString().padStart(2, '0')}`;
    const endTimeFormatted = `${Math.floor(slotEndMinutes / 60)}:${(slotEndMinutes % 60).toString().padStart(2, '0')}`;
    
    const timeString = `${formatTime(startTimeFormatted)} to ${formatTime(endTimeFormatted)}`;
    
    const slot1Index = Math.floor(Math.random() * names.length);
    let slot2Index = Math.floor(Math.random() * names.length);
    while (slot2Index === slot1Index) {
      slot2Index = Math.floor(Math.random() * names.length);
    }
    
    slots.push({
      time: timeString,
      slot1: names[slot1Index],
      slot2: names[slot2Index]
    });
  }
  
  return slots;
}

export default TimeSlotOverlay;
