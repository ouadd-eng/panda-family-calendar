/**
 * Google Calendar repository - handles Google account and sync operations
 */

import { supabase } from '@/integrations/supabase/client';
import { GoogleAccount } from '../domain/types';

/**
 * Fetches user's Google account connection
 */
export async function fetchGoogleAccount(): Promise<GoogleAccount | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('google_account')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching Google account:', error);
    throw error;
  }

  return data as GoogleAccount | null;
}

/**
 * Creates or updates Google account connection
 */
export async function upsertGoogleAccount(
  googleEmail: string,
  refreshToken: string,
  accessToken: string,
  expiresIn: number
): Promise<GoogleAccount> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  const { data, error } = await supabase
    .from('google_account')
    .upsert([{
      user_id: user.id,
      google_email: googleEmail,
      refresh_token: refreshToken,
      access_token: accessToken,
      token_expires_at: expiresAt,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error upserting Google account:', error);
    throw error;
  }

  return data as GoogleAccount;
}

/**
 * Updates sync settings
 */
export async function updateSyncSettings(
  calendarIds: string[],
  importMode: 'details' | 'busy'
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('google_account')
    .update({
      sync_calendars: calendarIds,
      import_mode: importMode,
    })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating sync settings:', error);
    throw error;
  }
}

/**
 * Updates last sync timestamp
 */
export async function updateSyncTimestamp(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('google_account')
    .update({ synced_at: new Date().toISOString() })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating sync timestamp:', error);
    throw error;
  }
}

/**
 * Disconnects Google account
 */
export async function disconnectGoogleAccount(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('google_account')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error disconnecting Google account:', error);
    throw error;
  }

  // Also delete synced Google events
  await supabase
    .from('calendar_event')
    .delete()
    .eq('creator_id', user.id)
    .eq('source', 'google');
}
