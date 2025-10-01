/**
 * Family selector component for switching between families
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Family } from '../domain/types';

interface FamilySelectorProps {
  families: Family[];
  selectedFamilyId: string | undefined;
  onFamilyChange: (familyId: string) => void;
}

const FamilySelector: React.FC<FamilySelectorProps> = ({ 
  families, 
  selectedFamilyId, 
  onFamilyChange 
}) => {
  if (families.length === 0) return null;
  if (families.length === 1) {
    return (
      <div className="text-sm font-medium text-foreground">
        {families[0].name}
      </div>
    );
  }

  return (
    <Select value={selectedFamilyId} onValueChange={onFamilyChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select family" />
      </SelectTrigger>
      <SelectContent>
        {families.map((family) => (
          <SelectItem key={family.id} value={family.id}>
            {family.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FamilySelector;
