
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { calculateTimeSlotPosition, formatTime, getProjectColor, getTextColor, type TimeSlot } from '@/utils/calendarUtils';
import TimeSlotOverlay from './TimeSlotOverlay';

interface TimeSlotProps {
  slot: TimeSlot;
  allTimeSlots?: TimeSlot[];
}

const TimeSlotComponent: React.FC<TimeSlotProps> = ({ slot, allTimeSlots = [] }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  const { top, height } = calculateTimeSlotPosition(slot.startTime, slot.endTime);
  
  // Get color based on project and event type, taking into account the associated project for broker events
  const projectName = slot.isBrokerEvent ? slot.associatedProject || slot.projectName : slot.projectName;
  const bgColor = getProjectColor(projectName, slot.isBrokerEvent);
  const textColor = getTextColor(bgColor);
  
  // Calculate width based on column information (for overlapping events)
  const width = slot.columnCount ? `${100 / slot.columnCount}%` : '100%';
  const left = slot.column ? `${(slot.column * 100) / slot.columnCount!}%` : '0';
  
  const handleOpen = () => setShowDetails(true);
  const handleClose = () => setShowDetails(false);
  
  return (
    <>
      <div
        className={cn(
          "absolute rounded-md px-2 py-1 text-xs font-medium flex flex-col justify-start overflow-hidden cursor-pointer hover:brightness-95 transition-all",
          slot.isBooked ? "border" : ""
        )}
        style={{
          top: `${top}px`,
          height: `${height}px`,
          width,
          left,
          backgroundColor: bgColor,
          color: textColor,
          borderColor: slot.isBooked ? (slot.isBrokerEvent ? 'transparent' : 'rgba(0,0,0,0.1)') : 'transparent',
        }}
        onClick={handleOpen}
      >
        <div className="font-semibold truncate">{slot.projectName}</div>
        <div className="truncate">
          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
        </div>
        {slot.isBrokerEvent && slot.broker && (
          <div className="text-[10px] mt-0.5 opacity-80 truncate">
            {slot.broker}
          </div>
        )}
      </div>
      
      {/* Only render overlay when shown */}
      {showDetails && (
        <TimeSlotOverlay 
          slot={slot} 
          isOpen={showDetails}
          onClose={handleClose}
          allTimeSlots={allTimeSlots}
        />
      )}
    </>
  );
};

export default TimeSlotComponent;
