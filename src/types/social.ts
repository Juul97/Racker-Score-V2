/**
 * Type definitions for Phase 2 Social Features
 * These types are prepared but not yet used in the app
 */

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  from_user: string;
  to_user: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Friendship {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface SocialMatch {
  id: string;
  user_id: string;
  sport: string;
  player1_name: string;
  player2_name: string;
  result: string;
  winner: 1 | 2;
  duration: number;
  created_at: string;
}
