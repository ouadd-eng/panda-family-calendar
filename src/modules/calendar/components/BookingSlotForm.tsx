
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatTime } from '@/utils/calendarUtils';
import { X, CalendarIcon, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingSlotFormProps {
  day: Date;
  initialStartTime: string;
  initialEndTime: string;
  familyMembers: string[];
  selectedMember?: string;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: string;
    startTime: string;
    endTime: string;
    familyMember: string;
    notes?: string;
    recurrenceType?: string;
    recurrenceByDay?: number[];
    recurrenceInterval?: number;
    recurrenceEnd?: 'never' | 'on' | 'after';
    recurrenceEndDate?: Date;
    recurrenceCount?: number;
  }) => void;
}

// Helper function to generate time options in 30-minute increments
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 6; hour < 21; hour++) {
    for (let minute of ['00', '30']) {
      const formattedHour = hour.toString().padStart(2, '0');
      options.push(`${formattedHour}:${minute}`);
    }
  }
  return options;
};

const BookingSlotForm: React.FC<BookingSlotFormProps> = ({
  day,
  initialStartTime,
  initialEndTime,
  familyMembers,
  selectedMember = "",
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = React.useState({
    title: '',
    type: 'Activity',
    startTime: initialStartTime,
    endTime: initialEndTime,
    familyMember: selectedMember || familyMembers[0] || 'Lisa',
    notes: '',
    recurrenceType: 'none',
    recurrenceByDay: [] as number[],
    recurrenceInterval: 1,
    recurrenceEnd: 'never' as 'never' | 'on' | 'after',
    recurrenceEndDate: undefined as Date | undefined,
    recurrenceCount: 1,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleWeekday = (dayIndex: number) => {
    setFormData(prev => {
      const byDay = prev.recurrenceByDay || [];
      if (byDay.includes(dayIndex)) {
        return { ...prev, recurrenceByDay: byDay.filter(d => d !== dayIndex) };
      } else {
        return { ...prev, recurrenceByDay: [...byDay, dayIndex] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const timeOptions = generateTimeOptions();
  const formattedDay = day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const eventTypes = ['Activity', 'Appointment', 'School', 'Work', 'Sport', 'Meeting', 'Personal'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-foreground">New Event</h2>
        <button 
          className="rounded-full p-1.5 hover:bg-muted transition-colors"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="text-sm text-muted-foreground mb-6 font-medium">
        {formattedDay}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Title</Label>
          <Input 
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Event title"
            className="h-10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id="type" className="h-10">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyMember" className="text-sm font-medium">Family Member</Label>
          <Select 
            value={formData.familyMember} 
            onValueChange={(value) => handleChange('familyMember', value)}
          >
            <SelectTrigger id="familyMember" className="h-10">
              <SelectValue placeholder="Select family member" />
            </SelectTrigger>
            <SelectContent>
              {familyMembers.map(member => (
                <SelectItem key={member} value={member}>{member}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
            <Select
              value={formData.startTime}
              onValueChange={(value) => handleChange('startTime', value)}
            >
              <SelectTrigger id="startTime" className="h-10">
                <SelectValue placeholder="Start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(time => (
                  <SelectItem key={`start-${time}`} value={time}>{formatTime(time)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime" className="text-sm font-medium">End Time</Label>
            <Select
              value={formData.endTime}
              onValueChange={(value) => handleChange('endTime', value)}
            >
              <SelectTrigger id="endTime" className="h-10">
                <SelectValue placeholder="End time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions
                  .filter(time => time > formData.startTime)
                  .map(time => (
                    <SelectItem key={`end-${time}`} value={time}>{formatTime(time)}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
          <Input 
            id="notes" 
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional details..."
            className="h-10"
          />
        </div>

        {/* Recurrence Section */}
        <div className="space-y-2 pt-2 border-t border-border">
          <Label htmlFor="recurrence" className="text-sm font-medium flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            Repeat
          </Label>
          <Select 
            value={formData.recurrenceType} 
            onValueChange={(value) => handleChange('recurrenceType', value)}
          >
            <SelectTrigger id="recurrence" className="h-10">
              <SelectValue placeholder="Does not repeat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Does not repeat</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weekly recurrence options */}
        {formData.recurrenceType === 'weekly' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Repeat on</Label>
            <div className="flex gap-2">
              {weekDays.map((day, index) => (
                <Button
                  key={day}
                  type="button"
                  variant={formData.recurrenceByDay?.includes(index) ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => toggleWeekday(index)}
                >
                  {day[0]}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Recurrence interval */}
        {formData.recurrenceType !== 'none' && (
          <div className="space-y-2">
            <Label htmlFor="interval" className="text-sm font-medium">
              Repeat every
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="interval"
                type="number"
                min="1"
                max="365"
                value={formData.recurrenceInterval}
                onChange={(e) => handleChange('recurrenceInterval', parseInt(e.target.value) || 1)}
                className="h-10 w-20"
              />
              <span className="text-sm text-muted-foreground">
                {formData.recurrenceType === 'daily' && 'day(s)'}
                {formData.recurrenceType === 'weekly' && 'week(s)'}
                {formData.recurrenceType === 'monthly' && 'month(s)'}
                {formData.recurrenceType === 'yearly' && 'year(s)'}
              </span>
            </div>
          </div>
        )}

        {/* Recurrence end */}
        {formData.recurrenceType !== 'none' && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ends</Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="never"
                  checked={formData.recurrenceEnd === 'never'}
                  onCheckedChange={() => handleChange('recurrenceEnd', 'never')}
                />
                <label htmlFor="never" className="text-sm cursor-pointer">Never</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on-date"
                  checked={formData.recurrenceEnd === 'on'}
                  onCheckedChange={() => handleChange('recurrenceEnd', 'on')}
                />
                <label htmlFor="on-date" className="text-sm cursor-pointer">On</label>
                {formData.recurrenceEnd === 'on' && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 text-xs justify-start text-left font-normal",
                          !formData.recurrenceEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {formData.recurrenceEndDate ? format(formData.recurrenceEndDate, 'PP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.recurrenceEndDate}
                        onSelect={(date) => handleChange('recurrenceEndDate', date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="after-count"
                  checked={formData.recurrenceEnd === 'after'}
                  onCheckedChange={() => handleChange('recurrenceEnd', 'after')}
                />
                <label htmlFor="after-count" className="text-sm cursor-pointer">After</label>
                {formData.recurrenceEnd === 'after' && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="730"
                      value={formData.recurrenceCount}
                      onChange={(e) => handleChange('recurrenceCount', parseInt(e.target.value) || 1)}
                      className="h-9 w-20 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">occurrences</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose} className="h-10 px-6">
            Cancel
          </Button>
          <Button type="submit" className="h-10 px-6">
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingSlotForm;
