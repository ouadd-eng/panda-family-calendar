import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTime } from '@/utils/calendarUtils';
import { X, Trash2 } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventDetailsDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Event>) => void;
  onDelete: (id: string) => void;
}

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

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  event,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [formData, setFormData] = React.useState({
    title: '',
    type: 'Activity',
    start_time: '09:00',
    end_time: '10:00',
    family_member: 'Lisa',
    notes: '',
  });
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  React.useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        type: event.type,
        start_time: event.start_time,
        end_time: event.end_time,
        family_member: event.family_member,
        notes: event.notes || '',
      });
    }
  }, [event]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      onUpdate(event.id, formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      setShowDeleteDialog(false);
      onClose();
    }
  };

  const timeOptions = generateTimeOptions();
  const eventTypes = ['Activity', 'Appointment', 'School', 'Work', 'Sport', 'Meeting', 'Personal'];
  const familyMembers = ['Lisa', 'Ahmed', 'Selma', 'Youssef', 'Sofia'];

  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-medium text-foreground">Edit Event</DialogTitle>
              </DialogHeader>
              <button 
                className="rounded-full p-1.5 hover:bg-muted transition-colors"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-sm text-muted-foreground mb-6 font-medium">
              {formattedDate}
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
                  value={formData.family_member} 
                  onValueChange={(value) => handleChange('family_member', value)}
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
                    value={formData.start_time}
                    onValueChange={(value) => handleChange('start_time', value)}
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
                    value={formData.end_time}
                    onValueChange={(value) => handleChange('end_time', value)}
                  >
                    <SelectTrigger id="endTime" className="h-10">
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions
                        .filter(time => time > formData.start_time)
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
              
              <div className="pt-4 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-10 px-4 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={onClose} className="h-10 px-6">
                    Cancel
                  </Button>
                  <Button type="submit" className="h-10 px-6">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventDetailsDialog;