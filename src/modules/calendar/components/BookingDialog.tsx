import React from 'react';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import BookingSlotForm from './BookingSlotForm';
import type { CreateEventData } from '../domain/types';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  day: Date;
  startTime: string;
  endTime: string;
  familyMembers: string[];
  selectedMember?: string;
  onCreateEvent: (eventData: Omit<CreateEventData, 'family_id'>) => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  isOpen,
  onClose,
  day,
  startTime,
  endTime,
  familyMembers,
  selectedMember = "ALL",
  onCreateEvent,
}) => {
  const handleSubmit = (data: any) => {
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);
    
    const startDate = new Date(day);
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(day);
    endDate.setHours(endHour, endMinute, 0, 0);
    
    const eventData: Omit<CreateEventData, 'family_id'> = {
      title: data.title,
      type: data.type,
      family_member: data.familyMember,
      start_ts: startDate.toISOString(),
      end_ts: endDate.toISOString(),
      all_day: false,
      visibility: 'family',
      notes: data.notes || undefined,
    };
    
    onCreateEvent(eventData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0">
        <BookingSlotForm
          day={day}
          initialStartTime={startTime}
          initialEndTime={endTime}
          familyMembers={familyMembers}
          onClose={onClose}
          onSubmit={handleSubmit}
          selectedMember={selectedMember !== "ALL" ? selectedMember : ""}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
