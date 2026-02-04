# Phase 2: Social Features Setup Guide

## Overview

Phase 1 (MVP) is now complete with:
- ✅ Share match result as image
- ✅ Social media share buttons (Twitter, Facebook, WhatsApp)
- ✅ Export match history (PDF/CSV)
- ✅ Win/loss streaks in statistics

Phase 2 adds optional cloud features using Supabase. The app remains fully functional without these features.

## Phase 2 Features (When Activated)

- ☁️ Optional cloud backup
- 👤 User accounts (optional, not required)
- 👥 Friend system
- 📊 View friends' matches
- 🔔 Notifications

## Setup Instructions

### 1. Install Supabase

```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 3. Add Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Activate Supabase Client

Edit `src/lib/supabase.ts` and uncomment the code. Change:

```typescript
export const isSupabaseEnabled = false;
```

to:

```typescript
export const isSupabaseEnabled = true;
```

### 5. Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friend requests table
CREATE TABLE friend_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_user, to_user)
);

-- Friendships table
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Matches table (for cloud backup)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  result TEXT NOT NULL,
  winner INTEGER CHECK (winner IN (1, 2)),
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_friend_requests_to_user ON friend_requests(to_user);
CREATE INDEX idx_friend_requests_from_user ON friend_requests(from_user);
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_created_at ON matches(created_at);
```

### 6. Row Level Security (RLS)

Enable RLS and add policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users: Public read, own write
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Friend requests: Users can see requests to/from them
CREATE POLICY "Users can view own friend requests" ON friend_requests FOR SELECT 
  USING (auth.uid() = from_user OR auth.uid() = to_user);

-- Friendships: Users can see their friendships
CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Matches: Users can see their own matches and friends' matches
CREATE POLICY "Users can view own matches" ON matches FOR SELECT 
  USING (auth.uid() = user_id);
```

## Cost Information

- **Free Tier**: Up to 500MB database, 2GB bandwidth, 50k monthly active users
- **Paid Tier**: €25/month (only needed at 1000+ users)

## Implementation Notes

- The app works **fully offline** without Supabase
- Supabase features are **optional enhancements**
- Users can use the app without creating an account
- Cloud backup is opt-in only

## Next Steps

1. Test Phase 1 features thoroughly
2. Gather user feedback
3. When ready, activate Phase 2 following this guide
4. Monitor usage and costs
5. Scale as needed
