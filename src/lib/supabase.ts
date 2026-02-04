/**
 * Supabase Client Setup (Phase 2 - Optional)
 * 
 * This file is prepared for Phase 2 social features but is NOT active yet.
 * To activate:
 * 1. Install: npm install @supabase/supabase-js
 * 2. Add environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * 3. Uncomment the code below
 */

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.warn('Supabase credentials not found. Social features will be disabled.');
// }

// export const supabase = supabaseUrl && supabaseAnonKey
//   ? createClient(supabaseUrl, supabaseAnonKey)
//   : null;

/**
 * Example usage (when activated):
 * 
 * // Search user by username
 * export const searchUser = async (username: string) => {
 *   if (!supabase) return null;
 *   const { data } = await supabase
 *     .from('users')
 *     .select('*')
 *     .eq('username', username)
 *     .single();
 *   return data;
 * };
 * 
 * // Send friend request
 * export const sendFriendRequest = async (fromUserId: string, toUserId: string) => {
 *   if (!supabase) return null;
 *   const { data, error } = await supabase
 *     .from('friend_requests')
 *     .insert({
 *       from_user: fromUserId,
 *       to_user: toUserId,
 *       status: 'pending'
 *     });
 *   return { data, error };
 * };
 * 
 * // Get friends' matches
 * export const getFriendsMatches = async (friendIds: string[]) => {
 *   if (!supabase) return [];
 *   const { data } = await supabase
 *     .from('matches')
 *     .select('*')
 *     .in('user_id', friendIds)
 *     .order('created_at', { ascending: false })
 *     .limit(20);
 *   return data || [];
 * };
 */

export const isSupabaseEnabled = false; // Set to true when ready for Phase 2
