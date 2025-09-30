
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatMonth, formatWeek } from '../utils/calendarUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MonthSelector from './MonthSelector';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onTodayClick: () => void;
  onDateChange: (date: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPreviousWeek,
  onNextWeek,
  onTodayClick,
  onDateChange,
}) => {
  return (
    <div className="w-full flex flex-col space-y-4 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="h-9 px-4 text-sm font-medium" 
            onClick={onTodayClick}
          >
            Today
          </Button>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 hover:bg-muted" 
              onClick={onPreviousWeek}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 hover:bg-muted" 
              onClick={onNextWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <MonthSelector currentDate={currentDate} onDateChange={onDateChange} />
        </div>
        
        <div className="sm:ml-6">
          <h2 className="text-2xl sm:text-3xl font-medium text-foreground tracking-tight">{formatMonth(currentDate)}</h2>
          <div className="text-sm text-muted-foreground font-medium mt-1">{formatWeek(currentDate)}</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
