-- Fix RLS policy for family_member INSERT to allow self-assignment as owner
DROP POLICY IF EXISTS "Users can create family with self as owner or owners can invite" ON public.family_member;

-- Allow users to insert themselves as owner when creating a family
-- OR allow existing family owners to invite new members
CREATE POLICY "Users can create family with self as owner or owners can invite"
ON public.family_member
FOR INSERT
WITH CHECK (
  -- User can add themselves as owner when creating a new family
  (user_id = auth.uid() AND role = 'owner' AND status = 'active')
  OR
  -- Existing family owners can invite new members (for pending invites)
  (status = 'pending' AND is_family_owner(family_id, auth.uid()))
);