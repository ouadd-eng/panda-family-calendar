/**
 * Family onboarding component for new users
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';

interface FamilyOnboardingProps {
  isOpen: boolean;
  onCreateFamily: (name: string) => void;
}

const FamilyOnboarding: React.FC<FamilyOnboardingProps> = ({ isOpen, onCreateFamily }) => {
  const [familyName, setFamilyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyName.trim()) {
      onCreateFamily(familyName.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Welcome to Family Calendar</DialogTitle>
          <DialogDescription className="text-center">
            Let's start by creating your family calendar. You can invite members later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="familyName">Family Name</Label>
            <Input
              id="familyName"
              placeholder="e.g., The Smiths"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={!familyName.trim()}>
            Create Family Calendar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyOnboarding;
