-- Create recipes table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  tags TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on title for faster searches
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title);

-- Create an index on tags for faster filtering
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);

-- Enable Row Level Security (RLS) - optional, adjust based on your needs
-- For a public app, you might want to allow all operations
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Allow all operations for all users (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on recipes" ON recipes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Or if you want to make it read-only for unauthenticated users:
-- CREATE POLICY "Allow read access" ON recipes FOR SELECT USING (true);
-- CREATE POLICY "Allow insert access" ON recipes FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow update access" ON recipes FOR UPDATE USING (true);
-- CREATE POLICY "Allow delete access" ON recipes FOR DELETE USING (true);

