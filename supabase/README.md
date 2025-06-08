# Database Setup and Deployment Guide

This directory contains the SQL migration files needed to set up the complete authentication system with row-level security (RLS) policies and automatic profile creation.

## Migration Files

### 001_initial_setup.sql
- Enables Row Level Security (RLS) on all tables
- Creates automatic profile creation trigger
- Sets up comprehensive RLS policies for all tables
- Configures proper permissions for authenticated users

### 002_functions.sql
- Database functions for user role management
- Post creation and management functions
- View tracking and analytics functions
- Profile update functions with proper security

## Key Features Implemented

### 1. Automatic Profile Creation
- Trigger automatically creates user profile on signup
- Assigns default 'user' role to new users
- Extracts first_name and last_name from auth metadata

### 2. Row-Level Security Policies
- **Profiles**: Users can view/edit own profile, admins see all
- **User Roles**: Users see own role, admins manage all roles
- **Posts**: Public posts visible to all, authors manage own posts
- **Comments**: All can view, users manage own comments
- **Categories**: Public read, admin write
- **Post Sections**: Tied to post ownership
- **Reading Progress**: User-specific tracking

### 3. Role-Based Access Control
- **Admin**: Full access to all resources
- **Author**: Can create/manage posts and comments
- **User**: Can comment and track reading progress

### 4. Database Functions
- `get_user_role()`: Get current user role
- `has_role()`: Check role permissions with hierarchy
- `increment_post_views()`: Track post analytics
- `update_user_profile()`: Safe profile updates
- `create_post()`: Secure post creation

## Deployment Instructions

### Option 1: Using Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g @supabase/cli

# Initialize Supabase in your project
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 2: Manual Deployment
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and execute the contents of `001_initial_setup.sql`
4. Copy and execute the contents of `002_functions.sql`

### Option 3: Using Migration Files
If you have an existing Supabase setup with migrations:
1. Copy these files to your `supabase/migrations/` directory
2. Run `supabase db push` to apply the migrations

## Verification Steps

After applying the migrations, verify the setup:

1. **Test Profile Creation**:
   - Sign up a new user through your app
   - Check that profile and user_role records are created automatically

2. **Test RLS Policies**:
   - Try accessing data with different user roles
   - Verify that permissions work as expected

3. **Test Functions**:
   ```sql
   -- Test role checking
   SELECT get_user_role('user-id-here');
   SELECT has_role('user-id-here', 'author');
   
   -- Test post view increment
   SELECT increment_post_views('some-post-slug');
   ```

## Security Considerations

- All RLS policies are properly configured to prevent unauthorized access
- Database functions use SECURITY DEFINER to ensure proper permissions
- Automatic profile creation includes proper error handling
- Role hierarchy is enforced at the database level

## Troubleshooting

### Common Issues

1. **Trigger not firing**: Ensure the trigger is created on `auth.users` table
2. **Permission denied**: Verify RLS policies are correctly applied
3. **Role not assigned**: Check that default role assignment works in trigger

### Debug Queries

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View existing policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check triggers
SELECT * FROM information_schema.triggers WHERE trigger_schema = 'public';
```

## Next Steps

1. Apply these migrations to your Supabase project
2. Test the authentication flow in your application
3. Verify that role-based access control works correctly
4. Monitor the automatic profile creation for new signups
