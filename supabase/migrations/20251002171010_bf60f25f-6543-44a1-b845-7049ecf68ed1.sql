-- Add policy to view all members of families the user belongs to
CREATE POLICY "Users can view members of families they belong to"
ON public.family_member
FOR SELECT
TO authenticated
USING (
  family_id IN (
    SELECT family_id 
    FROM family_member 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);