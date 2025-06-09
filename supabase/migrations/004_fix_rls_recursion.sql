
-- Fix infinite recursion in RLS policies by using security definer functions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own role and admins can view all" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON user_roles;
DROP POLICY IF EXISTS "Authors can create posts" ON posts;
DROP POLICY IF EXISTS "Authors can update their own posts or admins can update any" ON posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON posts;
DROP POLICY IF EXISTS "Users can view their own profile and public info" ON profiles;
DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Authors can manage sections of their posts" ON post_sections;
DROP POLICY IF EXISTS "Users can delete their own comments, admins can delete any" ON comments;

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role AS $$
DECLARE
  user_role app_role;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY assigned_at DESC
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'user'::app_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN public.get_current_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_author_or_admin()
RETURNS boolean AS $$
DECLARE
  user_role app_role;
BEGIN
  user_role := public.get_current_user_role();
  RETURN user_role IN ('admin', 'author');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate user_roles policies without recursion
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert user roles" ON user_roles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update user roles" ON user_roles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete user roles" ON user_roles
  FOR DELETE USING (public.is_admin());

-- Fix posts policies
CREATE POLICY "Authors can create posts" ON posts
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    public.is_author_or_admin()
  );

CREATE POLICY "Authors can update their own posts or admins can update any" ON posts
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (
      author = auth.uid()::text OR
      public.is_admin()
    )
  );

CREATE POLICY "Admins can delete posts" ON posts
  FOR DELETE USING (public.is_admin());

-- Fix profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

-- Fix categories policies
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (public.is_admin());

-- Fix post sections policies
CREATE POLICY "Authors can manage sections of their posts" ON post_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE id = post_id AND author = auth.uid()::text
    ) OR public.is_admin()
  );

-- Fix comments delete policy
CREATE POLICY "Users can delete their own comments, admins can delete any" ON comments
  FOR DELETE USING (
    auth.uid() = user_id OR public.is_admin()
  );

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_author_or_admin() TO authenticated, anon;
