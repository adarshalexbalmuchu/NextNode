-- Sample data for testing the dashboard
-- Run this after the initial setup

-- Insert sample categories
INSERT INTO categories (id, name, description, color) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'AI Tools for Students', 'Essential AI tools and guides for college students and learners', '#3B82F6'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Career & Professional Growth', 'Career strategies, interview prep, and professional development', '#8B5CF6'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Productivity & Automation', 'AI-powered productivity hacks and workflow automation', '#10B981'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Resume & Job Search', 'Resume building, job search strategies, and application tips', '#F59E0B'),
  ('550e8400-e29b-41d4-a716-446655440005', 'ChatGPT & AI Writing', 'Mastering ChatGPT, prompt engineering, and AI writing tools', '#EF4444'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Student Resources', 'Study guides, academic tools, and student-specific AI applications', '#06B6D4')
ON CONFLICT (id) DO NOTHING;

-- Insert sample posts (only if there's an authenticated user)
-- Note: These will need to be inserted by an authenticated user with author/admin role
