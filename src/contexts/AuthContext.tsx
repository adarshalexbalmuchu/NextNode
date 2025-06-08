
import React, { useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { AuthContext, AuthContextType, AuthResult } from './AuthContextProvider';

type UserRole = Database['public']['Enums']['app_role'];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureUserProfile = async (userId: string) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: userData.user.email || '',
              first_name: userData.user.user_metadata?.first_name || '',
              last_name: userData.user.user_metadata?.last_name || '',
            });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          } else {
            console.log('User profile created successfully');
          }
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const fetchUserRole = React.useCallback(async (userId: string): Promise<UserRole | null> => {
    try {
      // First, ensure the user profile exists
      await ensureUserProfile(userId);

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .order('assigned_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no role exists, create a default 'user' role
        if (error.code === 'PGRST116') { // No rows returned
          console.log('No role found for user, creating default role...');
          
          // Try to create a default role
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: 'user' as UserRole,
            });

          if (insertError) {
            console.error('Error creating default role:', insertError);
            return 'user'; // Default fallback
          }

          return 'user';
        }
        
        console.error('Error fetching user role:', error);
        return 'user'; // Default fallback
      }

      return data?.role || 'user';
    } catch (error) {
      console.error('Unexpected error fetching user role:', error);
      return 'user'; // Default fallback
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role when user logs in
          setTimeout(async () => {
            const role = await fetchUserRole(session.user.id);
            setUserRole(role);
            setLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id).then(role => {
          setUserRole(role);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      // Validate inputs
      if (!email || !email.trim()) {
        return { error: { message: 'Email is required', name: 'ValidationError', status: 400 } as AuthError };
      }
      if (!password || !password.trim()) {
        return { error: { message: 'Password is required', name: 'ValidationError', status: 400 } as AuthError };
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { error: { message: 'Please enter a valid email address', name: 'ValidationError', status: 400 } as AuthError };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error, success: false };
      }

      return { error: null, user: data.user, success: true };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      return { error: { message: 'An unexpected error occurred. Please try again.', name: 'UnexpectedError', status: 500 } as AuthError };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string): Promise<AuthResult> => {
    try {
      // Validate inputs
      if (!email || !email.trim()) {
        return { error: { message: 'Email is required', name: 'ValidationError', status: 400 } as AuthError };
      }
      if (!password || !password.trim()) {
        return { error: { message: 'Password is required', name: 'ValidationError', status: 400 } as AuthError };
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { error: { message: 'Please enter a valid email address', name: 'ValidationError', status: 400 } as AuthError };
      }

      // Password validation
      if (password.length < 6) {
        return { error: { message: 'Password must be at least 6 characters long', name: 'ValidationError', status: 400 } as AuthError };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName?.trim() || '',
            last_name: lastName?.trim() || '',
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error, success: false };
      }

      if (data.user) {
        // Attempt to create profile if not created automatically
        await ensureUserProfile(data.user.id);
      }

      return { error: null, user: data.user, success: true };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      return { error: { message: 'An unexpected error occurred. Please try again.', name: 'UnexpectedError', status: 500 } as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasRole = (role: UserRole): boolean => {
    if (!userRole) return false;
    
    // Admin has all permissions
    if (userRole === 'admin') return true;
    
    // Author has author and user permissions
    if (userRole === 'author' && (role === 'author' || role === 'user')) return true;
    
    // User only has user permissions
    if (userRole === 'user' && role === 'user') return true;
    
    return false;
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
