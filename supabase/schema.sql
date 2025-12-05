-- Blogs table for portfolio
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published blogs
CREATE POLICY "Anyone can read published blogs" ON blogs
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can manage all blogs (for admin)
CREATE POLICY "Authenticated users can manage blogs" ON blogs
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS blogs_published_idx ON blogs(published);
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);
CREATE INDEX IF NOT EXISTS blogs_created_at_idx ON blogs(created_at DESC);

-- Optional: Insert a sample blog post
INSERT INTO blogs (title, slug, excerpt, content, published) VALUES (
  'Welcome to My Blog',
  'welcome-to-my-blog',
  'This is my first blog post on my new portfolio website.',
  '# Welcome!\n\nThis is my first blog post. I will be sharing my thoughts on software engineering, AI/ML, and technology here.\n\nStay tuned for more content!',
  true
);

-- =====================================================
-- STORAGE SETUP FOR BLOG IMAGES
-- =====================================================
-- Run these commands in Supabase Dashboard > SQL Editor

-- Create the images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );

-- Policy: Users can update their own images
CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );
