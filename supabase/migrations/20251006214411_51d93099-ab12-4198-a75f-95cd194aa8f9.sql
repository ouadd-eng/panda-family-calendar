-- Create a function to handle family creation atomically
CREATE OR REPLACE FUNCTION public.create_family_with_owner(family_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_family_id uuid;
BEGIN
  -- Insert the family
  INSERT INTO family (name)
  VALUES (family_name)
  RETURNING id INTO new_family_id;
  
  -- Add the creator as owner
  INSERT INTO family_member (family_id, user_id, role, status)
  VALUES (new_family_id, auth.uid(), 'owner', 'active');
  
  RETURN new_family_id;
END;
$$;