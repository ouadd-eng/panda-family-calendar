-- Fix infinite recursion in family_member RLS policies
-- by using security definer functions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own memberships and family members" ON family_member;
DROP POLICY IF EXISTS "Family owners can invite members" ON family_member;
DROP POLICY IF EXISTS "Family owners can remove members" ON family_member;
DROP POLICY IF EXISTS "Users can activate their own pending invites" ON family_member;

-- Create security definer function to check if user is family owner
CREATE OR REPLACE FUNCTION public.is_family_owner(target_family_id uuid, target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM family_member
    WHERE family_id = target_family_id
      AND user_id = target_user_id
      AND role = 'owner'
      AND status = 'active'
  );
$$;

-- Create security definer function to check if user is active member
CREATE OR REPLACE FUNCTION public.is_family_member(target_family_id uuid, target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM family_member
    WHERE family_id = target_family_id
      AND user_id = target_user_id
      AND status = 'active'
  );
$$;

-- Recreate policies using security definer functions
CREATE POLICY "Users can view their own memberships"
ON family_member
FOR SELECT
USING (user_id = auth.uid() OR invited_email = auth.email());

CREATE POLICY "Users can view members of their families"
ON family_member
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM family f
    WHERE f.id = family_member.family_id
      AND public.is_family_member(f.id, auth.uid())
  )
);

CREATE POLICY "Family owners can invite members"
ON family_member
FOR INSERT
WITH CHECK (public.is_family_owner(family_id, auth.uid()));

CREATE POLICY "Family owners can remove members"
ON family_member
FOR DELETE
USING (public.is_family_owner(family_id, auth.uid()));

CREATE POLICY "Users can activate their own pending invites"
ON family_member
FOR UPDATE
USING (user_id = auth.uid() OR invited_email = auth.email());