-- ============================
-- Campus Skill Connect - Complete Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================

-- ============================
-- 1. DROP EXISTING OBJECTS
-- ============================

-- Drop triggers first
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS calculate_skill_rating(UUID);

-- Drop policies
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

DROP POLICY IF EXISTS "Anyone can view skills" ON skills;
DROP POLICY IF EXISTS "Users can create skills" ON skills;
DROP POLICY IF EXISTS "Users can update own skills" ON skills;
DROP POLICY IF EXISTS "Users can delete own skills" ON skills;

DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

DROP POLICY IF EXISTS "Users can view own chats" ON chats;
DROP POLICY IF EXISTS "Users can create chats" ON chats;
DROP POLICY IF EXISTS "Authenticated can update chats" ON chats;
DROP POLICY IF EXISTS "Authenticated can view chats" ON chats;

DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Authenticated can insert messages" ON messages;
DROP POLICY IF EXISTS "Authenticated can view messages" ON messages;

-- Drop storage policies
DROP POLICY IF EXISTS "Anyone can view skill images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload skill images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own skill images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own skill images" ON storage.objects;

-- Drop tables in dependency order
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop storage bucket
DELETE FROM storage.buckets WHERE id = 'skill-images';

-- ============================
-- 2. EXTENSIONS
-- ============================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- 3. USERS TABLE
-- ============================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department TEXT,
  year TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ============================
-- 4. SKILLS TABLE
-- ============================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  availability TEXT DEFAULT 'Available',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX skills_provider_id_idx ON skills(provider_id);
CREATE INDEX skills_category_idx ON skills(category);
CREATE INDEX skills_created_at_idx ON skills(created_at DESC);

-- Text search optimization indexes
CREATE INDEX skills_title_idx ON skills USING gin(to_tsvector('english', title));
CREATE INDEX skills_description_idx ON skills USING gin(to_tsvector('english', description));

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Users can create skills"
  ON skills FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Users can update own skills"
  ON skills FOR UPDATE
  USING (auth.uid() = provider_id);

CREATE POLICY "Users can delete own skills"
  ON skills FOR DELETE
  USING (auth.uid() = provider_id);

-- ============================
-- 5. REVIEWS TABLE
-- ============================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (skill_id, reviewer_id)
);

CREATE INDEX reviews_skill_id_idx ON reviews(skill_id);
CREATE INDEX reviews_reviewer_id_idx ON reviews(reviewer_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

-- ============================
-- 6. CHATS TABLE
-- ============================

CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user1_id, user2_id, skill_id)
);

CREATE INDEX chats_user1_id_idx ON chats(user1_id);
CREATE INDEX chats_user2_id_idx ON chats(user2_id);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chats"
  ON chats FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create chats"
  ON chats FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update own chats"
  ON chats FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ============================
-- 7. MESSAGES TABLE
-- ============================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX messages_chat_id_idx ON messages(chat_id);
CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their chats"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

-- ============================
-- 8. FUNCTIONS & TRIGGERS
-- ============================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON skills
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION calculate_skill_rating(skill_uuid UUID)
RETURNS DECIMAL AS $$
BEGIN
  RETURN COALESCE(
    (SELECT AVG(rating) FROM reviews WHERE skill_id = skill_uuid),
    0
  );
END;
$$ LANGUAGE plpgsql;

-- ============================
-- 9. STORAGE BUCKET
-- ============================

INSERT INTO storage.buckets (id, name, public)
VALUES ('skill-images', 'skill-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view skill images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'skill-images');

CREATE POLICY "Authenticated users can upload skill images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'skill-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own skill images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'skill-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own skill images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'skill-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================
-- 10. PERMISSIONS
-- ============================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================
-- SETUP COMPLETE
-- ============================
-- Your database is now ready to use!
-- All tables, policies, triggers, and storage buckets have been created.
