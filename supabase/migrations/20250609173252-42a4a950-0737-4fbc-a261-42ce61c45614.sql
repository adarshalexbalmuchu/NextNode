
-- First, let's check if the security definer functions exist and create them
-- Drop existing problematic functions if they exist
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_author_or_admin();

-- Create the get_current_user_role function that the code is trying to call
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

-- Create helper functions for RLS policies
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

-- Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view their own role and admins can view all" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON user_roles;

-- Create new non-recursive policies for user_roles
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

-- Fix profiles policies
DROP POLICY IF EXISTS "Users can view their own profile and admins can view all" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_author_or_admin() TO authenticated, anon;

-- Ensure RLS is enabled on critical tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
