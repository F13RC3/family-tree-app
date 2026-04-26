-- Family Tree App Schema
-- Run in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family members
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dob DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationships (parent-child, spouse-spouse)
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  to_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('parent', 'spouse')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_id, to_id, type)
);

-- Indexes for performance
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_relationships_user_id ON relationships(user_id);
CREATE INDEX idx_relationships_from_id ON relationships(from_id);
CREATE INDEX idx_relationships_to_id ON relationships(to_id);

-- Trigger: updated_at auto-update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (Row Level Security)
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_select_own_members ON family_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY users_insert_own_members ON family_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY users_update_own_members ON family_members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY users_delete_own_members ON family_members
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY users_select_own_relationships ON relationships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY users_insert_own_relationships ON relationships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY users_delete_own_relationships ON relationships
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger: Sync new auth.users to public.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
