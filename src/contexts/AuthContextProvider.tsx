import React, { createContext, useEffect, useState } from 'react';
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
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
