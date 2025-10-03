-- Drop the recursive RLS policy that's causing infinite recursion
DROP POLICY IF EXISTS "Family members can view other members" ON public.family_member;

-- The "Users can view their own membership records" policy is sufficient
-- It already allows users to see their own records and invited records