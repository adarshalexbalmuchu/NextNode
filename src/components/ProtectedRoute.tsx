import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { user, userRole, loading, hasRole } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
