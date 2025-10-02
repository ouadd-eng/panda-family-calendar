-- Add policy to allow family members to see other members of their families
CREATE POLICY "Family members can view other members"
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

-- Add trigger to auto-activate pending invites when user signs up
CREATE OR REPLACE FUNCTION public.activate_pending_invite()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a user signs up, activate any pending invites with their email
  UPDATE family_member
  SET 
    user_id = NEW.id,
    status = 'active',
    updated_at = now()
  WHERE invited_email = NEW.email
    AND status = 'pending'
    AND user_id IS NULL;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.activate_pending_invite();