
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
    projectName: string;
    startTime: string;
    endTime: string;
    firstName: string;
    lastName: string;
    contact: string;
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
    projectName: selectedProject,
    startTime: initialStartTime,
    endTime: initialEndTime,
    firstName: '',
    lastName: '',
    contact: '',
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

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">New Booking Slot</h2>
        <button 
          className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        {formattedDay}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="property">Property</Label>
          <Select 
            value={formData.projectName} 
            onValueChange={(value) => handleChange('projectName', value)}
          >
            <SelectTrigger id="property">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {projectNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Select
              value={formData.startTime}
              onValueChange={(value) => handleChange('startTime', value)}
            >
              <SelectTrigger id="startTime">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(time => (
                  <SelectItem key={`start-${time}`} value={time}>{formatTime(time)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Select
              value={formData.endTime}
              onValueChange={(value) => handleChange('endTime', value)}
            >
              <SelectTrigger id="endTime">
                <SelectValue placeholder="Select end time" />
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="John"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact">Email or Phone</Label>
          <Input 
            id="contact" 
            value={formData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            placeholder="email@example.com or +1234567890"
          />
        </div>
        
        <div className="pt-2 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Booking
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingSlotForm;
