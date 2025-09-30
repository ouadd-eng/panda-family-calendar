-- Phase 1: Family Multi-Tenancy Tables

-- Create family table
CREATE TABLE public.family (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family_member table with roles
CREATE TYPE public.family_role AS ENUM ('owner', 'member');
CREATE TYPE public.member_status AS ENUM ('pending', 'active');

CREATE TABLE public.family_member (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.family(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email TEXT,
  role public.family_role NOT NULL DEFAULT 'member',
  status public.member_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_or_email CHECK (user_id IS NOT NULL OR invited_email IS NOT NULL)
);

-- Create indexes for family_member
CREATE INDEX idx_family_member_user_id ON public.family_member(user_id);
CREATE INDEX idx_family_member_family_status ON public.family_member(family_id, status);
CREATE INDEX idx_family_member_email ON public.family_member(invited_email) WHERE invited_email IS NOT NULL;

-- Phase 2 & 3: Enhanced calendar_event table (replaces events)
CREATE TYPE public.event_visibility AS ENUM ('public', 'family', 'busy');
CREATE TYPE public.event_source AS ENUM ('local', 'google');

CREATE TABLE public.calendar_event (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.family(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  end_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN NOT NULL DEFAULT false,
  
  -- Phase 2: Recurrence fields (RFC5545)
  rrule TEXT,
  exdates JSONB DEFAULT '[]'::jsonb,
  
  -- Phase 3: Google Calendar integration
  visibility public.event_visibility NOT NULL DEFAULT 'family',
  source public.event_source NOT NULL DEFAULT 'local',
  google_event_id TEXT,
  google_calendar_id TEXT,
  
  -- Legacy fields for backward compatibility
  type TEXT NOT NULL DEFAULT 'Activity',
  family_member TEXT NOT NULL,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for calendar_event
CREATE INDEX idx_calendar_event_family_start ON public.calendar_event(family_id, start_ts);
CREATE INDEX idx_calendar_event_family_visibility ON public.calendar_event(family_id, visibility);
CREATE INDEX idx_calendar_event_google_id ON public.calendar_event(google_event_id) WHERE google_event_id IS NOT NULL;
CREATE INDEX idx_calendar_event_creator ON public.calendar_event(creator_id);

-- Phase 3: Google account integration
CREATE TABLE public.google_account (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  google_email TEXT NOT NULL,
  refresh_token TEXT NOT NULL, -- Encrypted by application layer
  access_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  synced_at TIMESTAMP WITH TIME ZONE,
  sync_calendars JSONB DEFAULT '[]'::jsonb, -- Array of calendar IDs to sync
  import_mode TEXT NOT NULL DEFAULT 'details', -- 'details' or 'busy'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_google_account_user ON public.google_account(user_id);

-- Enable RLS on all tables
ALTER TABLE public.family ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_account ENABLE ROW LEVEL SECURITY;

-- RLS Policies for family table
CREATE POLICY "Users can view families they belong to"
  ON public.family FOR SELECT
  USING (
    id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Authenticated users can create families"
  ON public.family FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Family owners can update their family"
  ON public.family FOR UPDATE
  USING (
    id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
    )
  );

CREATE POLICY "Family owners can delete their family"
  ON public.family FOR DELETE
  USING (
    id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
    )
  );

-- RLS Policies for family_member table
CREATE POLICY "Users can view their own memberships and family members"
  ON public.family_member FOR SELECT
  USING (
    user_id = auth.uid() 
    OR family_id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Family owners can invite members"
  ON public.family_member FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
    )
  );

CREATE POLICY "Users can activate their own pending invites"
  ON public.family_member FOR UPDATE
  USING (
    (user_id = auth.uid() OR invited_email = auth.email())
  );

CREATE POLICY "Family owners can remove members"
  ON public.family_member FOR DELETE
  USING (
    family_id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
    )
  );

-- RLS Policies for calendar_event table
CREATE POLICY "Users can view events in their families"
  ON public.calendar_event FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Family members can create events"
  ON public.calendar_event FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id
    AND family_id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Event creators and family owners can update events"
  ON public.calendar_event FOR UPDATE
  USING (
    creator_id = auth.uid()
    OR family_id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
    )
  );

CREATE POLICY "Event creators and family owners can delete events"
  ON public.calendar_event FOR DELETE
  USING (
    creator_id = auth.uid()
    OR family_id IN (
      SELECT family_id FROM public.family_member 
      WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
    )
  );

-- RLS Policies for google_account table
CREATE POLICY "Users can view their own google account"
  ON public.google_account FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own google account"
  ON public.google_account FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own google account"
  ON public.google_account FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own google account"
  ON public.google_account FOR DELETE
  USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_family_updated_at
  BEFORE UPDATE ON public.family
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_member_updated_at
  BEFORE UPDATE ON public.family_member
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_event_updated_at
  BEFORE UPDATE ON public.calendar_event
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_google_account_updated_at
  BEFORE UPDATE ON public.google_account
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper function to get user's families
CREATE OR REPLACE FUNCTION public.get_user_families(target_user_id UUID)
RETURNS TABLE (
  family_id UUID,
  family_name TEXT,
  user_role family_role,
  member_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    f.id as family_id,
    f.name as family_name,
    fm.role as user_role,
    (SELECT COUNT(*) FROM family_member WHERE family_id = f.id AND status = 'active') as member_count
  FROM family f
  JOIN family_member fm ON f.id = fm.family_id
  WHERE fm.user_id = target_user_id AND fm.status = 'active'
  ORDER BY f.created_at DESC;
$$;

-- Function to activate pending invite
CREATE OR REPLACE FUNCTION public.activate_pending_invite()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a user signs up, check for pending invites with their email
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

-- Trigger to auto-activate invites on user signup
CREATE TRIGGER on_auth_user_created_activate_invites
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.activate_pending_invite();

-- Drop old events table (user approved deleting existing events)
DROP TABLE IF EXISTS public.events CASCADE;