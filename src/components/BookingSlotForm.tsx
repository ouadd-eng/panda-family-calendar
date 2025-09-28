
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTime } from '@/utils/calendarUtils';
import { X } from 'lucide-react';

interface BookingSlotFormProps {
  day: Date;
  initialStartTime: string;
  initialEndTime: string;
  projectNames: string[];
  selectedProject?: string;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: string;
    startTime: string;
    endTime: string;
    familyMember: string;
    notes?: string;
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
  projectNames,
  selectedProject = "",
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = React.useState({
    title: '',
    type: selectedProject || 'Activity',
    startTime: initialStartTime,
    endTime: initialEndTime,
    familyMember: 'Lisa',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const timeOptions = generateTimeOptions();
  const formattedDay = day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const eventTypes = ['Activity', 'Appointment', 'School', 'Work', 'Sport', 'Meeting', 'Personal'];
  const familyMembers = ['Lisa', 'Ahmed', 'Selma', 'Youssef', 'Sofia'];

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
