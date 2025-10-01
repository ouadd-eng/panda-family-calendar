/**
 * Custom hook for managing families
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  fetchUserFamilies,
  createFamily as createFamilyRepo,
  inviteFamilyMember,
  fetchFamilyMembers,
  removeFamilyMember,
} from '../data/familyRepository';

export const useFamilies = () => {
  const queryClient = useQueryClient();

  // Fetch user's families
  const { data: families = [], isLoading } = useQuery({
    queryKey: ['families'],
    queryFn: fetchUserFamilies,
  });

  // Create family mutation
  const createFamily = useMutation({
    mutationFn: (name: string) => createFamilyRepo(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast({
        title: 'Success',
        description: 'Family created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating family:', error);
      toast({
        title: 'Error',
        description: 'Failed to create family',
        variant: 'destructive',
      });
    },
  });

  // Invite member mutation
  const inviteMember = useMutation({
    mutationFn: ({ familyId, email, role }: { familyId: string; email: string; role: 'owner' | 'member' }) =>
      inviteFamilyMember(familyId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
      toast({
        title: 'Success',
        description: 'Invitation sent successfully',
      });
    },
    onError: (error) => {
      console.error('Error inviting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    },
  });

  return {
    families,
    isLoading,
    createFamily,
    inviteMember,
  };
};

export const useFamilyMembers = (familyId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['family-members', familyId],
    queryFn: () => familyId ? fetchFamilyMembers(familyId) : Promise.resolve([]),
    enabled: !!familyId,
  });

  const removeMember = useMutation({
    mutationFn: (memberId: string) => removeFamilyMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    },
    onError: (error) => {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    },
  });

  return {
    members,
    isLoading,
    removeMember,
  };
};
