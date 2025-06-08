import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Shield, User, Crown, CheckCircle, XCircle } from 'lucide-react';

const AdminMaker = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [targetEmail, setTargetEmail] = useState(user?.email || '');
  const [results, setResults] = useState<Array<{
    action: string;
    status: 'success' | 'error' | 'info';
    message: string;
    details?: unknown;
  }>>([]);

  const addResult = (action: string, status: 'success' | 'error' | 'info', message: string, details?: unknown) => {
    setResults(prev => [...prev, { action, status, message, details }]);
  };

  const makeAdmin = async () => {
    if (!targetEmail) {
      addResult('Validation', 'error', 'Please enter an email address', null);
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      // Step 1: Find the user
      addResult('User Lookup', 'info', `Looking up user: ${targetEmail}`, null);
      
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('email', targetEmail);

      if (userError) {
        addResult('User Lookup', 'error', `Error finding user: ${userError.message}`, userError);
        return;
      }

      if (!users || users.length === 0) {
        addResult('User Lookup', 'error', `User not found: ${targetEmail}`, null);
        addResult('Suggestion', 'info', 'Make sure the user has signed up first', null);
        return;
      }

      const targetUser = users[0];
      addResult('User Lookup', 'success', `User found: ${targetUser.first_name || targetUser.last_name || targetUser.email}`, targetUser);

      // Step 2: Use the new safe admin creation function (bypasses RLS recursion)
      addResult('Admin Creation', 'info', `Making ${targetEmail} an admin using safe function...`, null);
      
      const { data: result, error: functionError } = await supabase
        .rpc('safe_make_admin', { user_email: targetEmail });

      if (functionError) {
        addResult('Admin Creation', 'error', `Error making user admin: ${functionError.message}`, functionError);
        return;
      }

      // Check the result from the function
      if (result && result.success) {
        addResult('Admin Creation', 'success', result.message || `Successfully made ${targetEmail} an admin!`, result);
        addResult('Next Steps', 'info', 'The user may need to refresh their browser to see admin features', null);
      } else {
        addResult('Admin Creation', 'error', result?.message || `Failed to make ${targetEmail} an admin`, result);
        return;
      }

      // Admin creation completed successfully - no need for additional verification

    } catch (error) {
      addResult('Unexpected Error', 'error', `Unexpected error: ${(error as Error).message}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeSelfAdmin = () => {
    if (user?.email) {
      setTargetEmail(user.email);
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'info') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'info':
        return <Shield className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: 'success' | 'error' | 'info') => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            Admin User Management
          </CardTitle>
          <CardDescription>
            Grant admin privileges to users. Admin users can access all features including user management, analytics, and system settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Only grant admin privileges to trusted users
            </span>
          </div>

          <div className="space-y-3">
            <Label htmlFor="email">User Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="flex-1"
              />
              {user?.email && (
                <Button
                  variant="outline"
                  onClick={makeSelfAdmin}
                  className="shrink-0"
                >
                  <User className="h-4 w-4 mr-2" />
                  Make Me Admin
                </Button>
              )}
            </div>
            {user?.email && (
              <p className="text-xs text-gray-600">
                Current user: {user.email}
              </p>
            )}
          </div>

          <Button 
            onClick={makeAdmin} 
            disabled={isLoading || !targetEmail}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Shield className="mr-2 h-4 w-4 animate-spin" />
                Granting Admin Privileges...
              </>
            ) : (
              <>
                <Crown className="mr-2 h-4 w-4" />
                Grant Admin Privileges
              </>
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <h3 className="font-semibold">Results</h3>
              
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-2">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{result.action}</div>
                      <div className="text-sm mt-1">{result.message}</div>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer hover:underline">
                            View Details
                          </summary>
                          <pre className="text-xs mt-1 p-2 bg-black/10 rounded overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Manual SQL Method</CardTitle>
          <CardDescription>
            Alternative method: Execute SQL directly in Supabase dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              If the web method doesn't work, you can manually run this SQL in your Supabase SQL Editor:
            </p>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm overflow-auto">
              <pre>{`-- Replace 'your-email@example.com' with your actual email
UPDATE public.user_roles 
SET role = 'admin', updated_at = NOW()
WHERE user_id = (
    SELECT id FROM auth.users 
    WHERE email = 'your-email@example.com'
);

-- If no role exists, insert admin role
INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
SELECT id, 'admin', NOW(), NOW()
FROM auth.users 
WHERE email = 'your-email@example.com'
    AND id NOT IN (SELECT user_id FROM public.user_roles);`}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMaker;
