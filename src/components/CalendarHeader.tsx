
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatMonth, formatWeek } from '@/utils/calendarUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onTodayClick: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPreviousWeek,
  onNextWeek,
  onTodayClick,
}) => {
  return (
    <div className="w-full flex flex-col space-y-4 pb-4">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="rounded-full calendar-header-button" 
            onClick={onTodayClick}
          >
            Today
          </Button>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full calendar-header-button" 
              onClick={onPreviousWeek}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full calendar-header-button" 
              onClick={onNextWeek}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="ml-4">
            <h2 className="text-2xl font-medium text-gray-900">{formatMonth(currentDate)}</h2>
            <div className="text-sm text-gray-500">{formatWeek(currentDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
