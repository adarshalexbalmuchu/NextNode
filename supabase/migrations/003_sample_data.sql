-- Sample data for testing the dashboard
-- Run this after the initial setup

-- Insert sample categories
INSERT INTO categories (id, name, description, color) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'AI & Machine Learning', 'Articles about artificial intelligence and machine learning', '#3B82F6'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Quantum Computing', 'Quantum computing concepts and applications', '#8B5CF6'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Web Development', 'Frontend and backend web development', '#10B981'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Data Science', 'Data analysis and visualization', '#F59E0B')
ON CONFLICT (id) DO NOTHING;

-- Insert sample posts (only if there's an authenticated user)
-- Note: These will need to be inserted by an authenticated user with author/admin role
