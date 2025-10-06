/**
 * Family repository - handles all Supabase queries for families
 */

import { supabase } from '@/integrations/supabase/client';
import { Family, FamilyMember } from '../domain/types';

/**
 * Fetches all families for the current user
 */
export async function fetchUserFamilies(): Promise<Family[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // First get the family IDs
  const { data: memberData, error: memberError } = await supabase
    .from('family_member')
    .select('family_id')
    .eq('user_id', user.id)
    .eq('status', 'active');

  if (memberError) {
    console.error('Error fetching family memberships:', memberError);
    throw memberError;
  }

  if (!memberData || memberData.length === 0) {
    return [];
  }

  const familyIds = memberData.map(m => m.family_id);

  // Then get the families
  const { data, error } = await supabase
    .from('family')
    .select('*')
    .in('id', familyIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching families:', error);
    throw error;
  }

  return (data || []) as Family[];
}

/**
 * Creates a new family and adds the creator as owner
 * Uses a database function to handle this atomically and bypass RLS issues
 */
export async function createFamily(name: string): Promise<Family> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Call the database function to create family with owner
  const { data: familyId, error: rpcError } = await supabase
    .rpc('create_family_with_owner', { family_name: name });

  if (rpcError) {
    console.error('Error creating family:', rpcError);
    throw rpcError;
  }

  // Fetch the created family
  const { data: family, error: fetchError } = await supabase
    .from('family')
    .select('*')
    .eq('id', familyId)
    .single();

  if (fetchError) {
    console.error('Error fetching created family:', fetchError);
    throw fetchError;
  }

  return family as Family;
}

/**
 * Updates a family
 */
export async function updateFamily(id: string, name: string): Promise<Family> {
  const { data, error } = await supabase
    .from('family')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating family:', error);
    throw error;
  }

  return data as Family;
}

/**
 * Deletes a family
 */
export async function deleteFamily(id: string): Promise<void> {
  const { error } = await supabase
    .from('family')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting family:', error);
    throw error;
  }
}

/**
 * Fetches family members
 */
export async function fetchFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from('family_member')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching family members:', error);
    throw error;
  }

  return (data || []) as FamilyMember[];
}

/**
 * Invites a member to a family
 */
export async function inviteFamilyMember(
  familyId: string,
  email: string,
  role: 'owner' | 'member'
): Promise<FamilyMember> {
  const { data, error } = await supabase
    .from('family_member')
    .insert([{
      family_id: familyId,
      invited_email: email,
      role,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('Error inviting family member:', error);
    throw error;
  }

  return data as FamilyMember;
}

/**
 * Removes a family member
 */
export async function removeFamilyMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('family_member')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('Error removing family member:', error);
    throw error;
  }
}

/**
 * Checks if user has a family
 */
export async function hasFamily(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('family_member')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1);

  if (error) {
    console.error('Error checking family:', error);
    return false;
  }

  return (data || []).length > 0;
}
