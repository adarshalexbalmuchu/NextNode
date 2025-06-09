
-- Create a storage bucket for blog post images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images', 
  'blog-images', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- Create storage policies for blog images
CREATE POLICY "Anyone can view blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authors can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-images' AND 
    public.is_author_or_admin()
  );

CREATE POLICY "Authors can update their blog images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'blog-images' AND 
    public.is_author_or_admin()
  );

CREATE POLICY "Authors can delete their blog images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images' AND 
    public.is_author_or_admin()
  );

-- Add a featured_image column to the posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS featured_image TEXT;
