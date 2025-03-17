import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock } from 'lucide-react';

interface TimeExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TimeExpiredModal({ isOpen, onClose }: TimeExpiredModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Time is Up!</DialogTitle>
          <DialogDescription className="text-center">
            Your exam time has expired. Your answers will be submitted automatically.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}