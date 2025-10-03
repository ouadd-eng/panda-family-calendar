-- Drop the duplicate recursive RLS policy that causes infinite recursion
-- This policy was incorrectly added in migration 20251002171010
DROP POLICY IF EXISTS "Users can view members of families they belong to" ON public.family_member;

-- The existing policies from migration 20251002170831 already provide the necessary access:
-- 1. "Users can view their own membership records" - allows viewing own records
-- 2. "Family members can view other members" - allows viewing other family members
-- These policies use direct auth.uid() checks to avoid recursion