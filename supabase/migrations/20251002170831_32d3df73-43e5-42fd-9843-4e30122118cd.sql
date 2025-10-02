-- Complete RLS rebuild to fix infinite recursion
-- Drop all existing policies
DROP POLICY IF EXISTS "Authenticated users can create families" ON public.family;
DROP POLICY IF EXISTS "Family owners can delete their family" ON public.family;
DROP POLICY IF EXISTS "Family owners can update their family" ON public.family;
DROP POLICY IF EXISTS "Users can view families they belong to" ON public.family;

DROP POLICY IF EXISTS "Users can create family with self as owner or owners can invite" ON public.family_member;
DROP POLICY IF EXISTS "Family owners can invite members" ON public.family_member;
DROP POLICY IF EXISTS "Family owners can remove members" ON public.family_member;
DROP POLICY IF EXISTS "Users can activate their own pending invites" ON public.family_member;
DROP POLICY IF EXISTS "Users can view members of their families" ON public.family_member;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.family_member;

-- Family table policies (simple, no recursion)
CREATE POLICY "Anyone authenticated can create families"
ON public.family
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view families they are members of"
ON public.family
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT family_id 
    FROM family_member 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Owners can update their families"
ON public.family
FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT family_id 
    FROM family_member 
    WHERE user_id = auth.uid() 
    AND role = 'owner' 
    AND status = 'active'
  )
);

CREATE POLICY "Owners can delete their families"
ON public.family
FOR DELETE
TO authenticated
USING (
  id IN (
    SELECT family_id 
    FROM family_member 
    WHERE user_id = auth.uid() 
    AND role = 'owner' 
    AND status = 'active'
  )
);

-- Family member policies (avoid recursion with direct checks)
CREATE POLICY "Users can view their own membership records"
ON public.family_member
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR invited_email = auth.email()
);

CREATE POLICY "Users can insert themselves as owner"
ON public.family_member
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND role = 'owner' AND status = 'active'
);

CREATE POLICY "Owners can insert pending invites"
ON public.family_member
FOR INSERT
TO authenticated
WITH CHECK (
  status = 'pending' 
  AND user_id IS NULL 
  AND is_family_owner(family_id, auth.uid())
);

CREATE POLICY "Users can update their own pending invites"
ON public.family_member
FOR UPDATE
TO authenticated
USING (
  invited_email = auth.email() AND status = 'pending'
)
WITH CHECK (
  user_id = auth.uid() AND status = 'active'
);

CREATE POLICY "Owners can delete members"
ON public.family_member
FOR DELETE
TO authenticated
USING (
  is_family_owner(family_id, auth.uid())
);