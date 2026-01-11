-- ============================
-- Campus Skill Connect - SIMPLE Schema (No RLS)
-- For prototype/development - Run in Supabase SQL Editor
-- ============================

-- ============================
-- 1. DROP EXISTING OBJECTS
-- ============================

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================
-- 2. EXTENSIONS
-- ============================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- 3. USERS TABLE (No RLS)
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

-- DISABLE RLS for prototype
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Allow all operations
GRANT ALL ON users TO anon, authenticated, service_role;

-- ============================
-- 4. SKILLS TABLE (No RLS)
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

-- DISABLE RLS for prototype
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;

GRANT ALL ON skills TO anon, authenticated, service_role;

-- ============================
-- 5. REVIEWS TABLE (No RLS)
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

-- DISABLE RLS for prototype
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

GRANT ALL ON reviews TO anon, authenticated, service_role;

-- ============================
-- 6. CHATS TABLE (No RLS)
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

-- DISABLE RLS for prototype
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;

GRANT ALL ON chats TO anon, authenticated, service_role;

-- ============================
-- 7. MESSAGES TABLE (No RLS)
-- ============================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DISABLE RLS for prototype
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

GRANT ALL ON messages TO anon, authenticated, service_role;

-- ============================
-- 8. STORAGE BUCKET
-- ============================

INSERT INTO storage.buckets (id, name, public)
VALUES ('skill-images', 'skill-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================
-- 9. GLOBAL PERMISSIONS
-- ============================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================
-- DONE!
-- ============================
-- All tables created with NO Row Level Security
-- Perfect for prototyping and development
