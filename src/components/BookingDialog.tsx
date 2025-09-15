
import React from 'react';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import BookingSlotForm from './BookingSlotForm';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  day: Date;
  startTime: string;
  endTime: string;
  projectNames: string[];
  selectedProject?: string;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  isOpen,
  onClose,
  day,
  startTime,
  endTime,
  projectNames,
  selectedProject = "ALL",
}) => {
  const handleSubmit = (data: any) => {
    // This would actually create the booking in a real app
    console.log('Creating booking with data:', data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0">
        <BookingSlotForm
          day={day}
          initialStartTime={startTime}
          initialEndTime={endTime}
          projectNames={projectNames}
          onClose={onClose}
          onSubmit={handleSubmit}
          selectedProject={selectedProject !== "ALL" ? selectedProject : ""}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
