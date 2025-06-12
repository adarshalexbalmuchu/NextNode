import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

export interface AuthResult {
  error: AuthError | null;
  user?: User | null;
  success?: boolean;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureUserProfile = async (userId: string) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        const { data: userData } = await supabase.auth.getUser();

        if (userData.user) {
          const { error: insertError } = await supabase.from('profiles').insert({
            id: userId,
            email: userData.user.email || '',
            first_name: userData.user.user_metadata?.first_name || '',
            last_name: userData.user.user_metadata?.last_name || '',
          });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const fetchUserRole = React.useCallback(async (userId: string): Promise<UserRole | null> => {
    try {
      await ensureUserProfile(userId);

      // Use the get_current_user_role function that now exists
      const { data, error } = await supabase.rpc('get_current_user_role');

      if (error) {
        console.error('Error fetching user role:', error);

        // Fallback: try to create default role
        const { error: insertError } = await supabase.from('user_roles').insert({
          user_id: userId,
          role: 'user' as UserRole,
        });

        if (insertError) {
          console.error('Error creating default role:', insertError);
        }

        return 'user';
      }

      return data || 'user';
    } catch (error) {
      console.error('Unexpected error fetching user role:', error);
      return 'user';
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      // Batch state updates to prevent multiple re-renders
      const updates = {
        session,
        user: session?.user ?? null,
        loading: false,
        userRole: null as string | null,
      };

      if (session?.user) {
        // Optimize: fetch user role without blocking UI
        fetchUserRole(session.user.id)
          .then(role => {
            setUserRole(role);
          })
          .catch(err => {
            console.error('Failed to fetch user role:', err);
            setUserRole('user'); // fallback
          });
      }

      // Apply batched updates
      setSession(updates.session);
      setUser(updates.user);
      setLoading(updates.loading);
      if (!session?.user) {
        setUserRole(null);
      }
    });

    // Optimize initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Non-blocking role fetch
        fetchUserRole(session.user.id)
          .then(role => {
            setUserRole(role);
          })
          .catch(() => {
            setUserRole('user'); // fallback
          })
          .finally(() => {
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
      if (!email || !email.trim()) {
        return {
          error: {
            message: 'Email is required',
            name: 'ValidationError',
            status: 400,
          } as AuthError,
        };
      }
      if (!password || !password.trim()) {
        return {
          error: {
            message: 'Password is required',
            name: 'ValidationError',
            status: 400,
          } as AuthError,
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return {
          error: {
            message: 'Please enter a valid email address',
            name: 'ValidationError',
            status: 400,
          } as AuthError,
        };
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
      return {
        error: {
          message: 'An unexpected error occurred. Please try again.',
          name: 'UnexpectedError',
          status: 500,
        } as AuthError,
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResult> => {
    try {
      if (!email || !email.trim()) {
        return {
          error: {
            message: 'Email is required',
            name: 'ValidationError',
            status: 400,
          } as AuthError,
        };
      }
      if (!password || !password.trim()) {
        return {
          error: {
            message: 'Password is required',
            name: 'ValidationError',
            status: 400,
          } as AuthError,
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return {
          error: {
            message: 'Please enter a valid email address',
            name: 'ValidationError',
            status: 400,
          } as AuthError,
        };
      }

      if (password.length < 6) {
        return {
          error: {
            message: 'Password must be at least 6 characters long',
            name: 'ValidationError',
            status: 400,
          } as AuthError,
        };
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
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error, success: false };
      }

      if (data.user) {
        await ensureUserProfile(data.user.id);
      }

      return { error: null, user: data.user, success: true };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      return {
        error: {
          message: 'An unexpected error occurred. Please try again.',
          name: 'UnexpectedError',
          status: 500,
        } as AuthError,
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasRole = (role: UserRole): boolean => {
    if (!userRole) return false;

    if (userRole === 'admin') return true;
    if (userRole === 'author' && (role === 'author' || role === 'user')) return true;
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
