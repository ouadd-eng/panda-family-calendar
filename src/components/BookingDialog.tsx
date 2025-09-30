
import React from 'react';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import BookingSlotForm from './BookingSlotForm';
import { format } from 'date-fns';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  day: Date;
  startTime: string;
  endTime: string;
  familyMembers: string[];
  selectedMember?: string;
  onCreateEvent: (eventData: any) => void;
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
    const eventData = {
      title: data.title,
      type: data.type,
      family_member: data.familyMember,
      start_time: data.startTime,
      end_time: data.endTime,
      date: format(day, 'yyyy-MM-dd'),
      notes: data.notes,
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
