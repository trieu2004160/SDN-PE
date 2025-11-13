-- Create books table in Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Copy and paste the entire content below, then click "Run"

-- Drop table if it exists (optional - only use if you want to start fresh)
-- DROP TABLE IF EXISTS books CASCADE;

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT[],
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_tags ON books USING GIN(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on books" ON books;

-- Create policy to allow all operations for all users
CREATE POLICY "Allow all operations on books" ON books
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify the table was created
SELECT * FROM books LIMIT 1;
