-- Database functions for the authentication system

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(_user_id UUID)
RETURNS app_role AS $$
BEGIN
  RETURN (
    SELECT role
    FROM user_roles
    WHERE user_id = _user_id
    ORDER BY assigned_at DESC
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Get the user's current role
  user_role := get_user_role(_user_id);
  
  -- Admin has all permissions
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Author has author and user permissions
  IF user_role = 'author' AND (_role = 'author' OR _role = 'user') THEN
    RETURN TRUE;
  END IF;
  
  -- User only has user permissions
  IF user_role = 'user' AND _role = 'user' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  _user_id UUID,
  _first_name TEXT DEFAULT NULL,
  _last_name TEXT DEFAULT NULL,
  _avatar_url TEXT DEFAULT NULL
)
RETURNS profiles AS $$
DECLARE
  updated_profile profiles;
BEGIN
  UPDATE profiles
  SET
    first_name = COALESCE(_first_name, first_name),
    last_name = COALESCE(_last_name, last_name),
    avatar_url = COALESCE(_avatar_url, avatar_url),
    updated_at = NOW()
  WHERE id = _user_id
  RETURNING * INTO updated_profile;
  
  RETURN updated_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create new post with proper permissions
CREATE OR REPLACE FUNCTION create_post(
  _title TEXT,
  _slug TEXT,
  _content TEXT,
  _excerpt TEXT DEFAULT NULL,
  _category_id UUID DEFAULT NULL,
  _difficulty_level TEXT DEFAULT 'Beginner',
  _read_time INTEGER DEFAULT 5,
  _published BOOLEAN DEFAULT FALSE,
  _featured BOOLEAN DEFAULT FALSE
)
RETURNS posts AS $$
DECLARE
  new_post posts;
  user_role app_role;
BEGIN
  -- Check if user has author or admin role
  user_role := get_user_role(auth.uid());
  
  IF user_role NOT IN ('author', 'admin') THEN
    RAISE EXCEPTION 'Access denied: Only authors and admins can create posts';
  END IF;
  
  INSERT INTO posts (
    title,
    slug,
    content,
    excerpt,
    category_id,
    difficulty_level,
    read_time,
    published,
    featured,
    author
  ) VALUES (
    _title,
    _slug,
    _content,
    _excerpt,
    _category_id,
    _difficulty_level,
    _read_time,
    _published,
    _featured,
    auth.uid()
  )
  RETURNING * INTO new_post;
  
  RETURN new_post;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
