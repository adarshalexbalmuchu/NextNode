import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, User, Crown, CheckCircle, XCircle, Coffee } from 'lucide-react';
import Background from '@/components/Background';
import Header from '@/components/Header';

const BootstrapAdmin = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [targetEmail, setTargetEmail] = useState(user?.email || '');
  const [results, setResults] = useState<
    Array<{
      action: string;
      status: 'success' | 'error' | 'info';
      message: string;
      details?: unknown;
    }>
  >([]);

  const addResult = (
    action: string,
    status: 'success' | 'error' | 'info',
    message: string,
    details?: unknown
  ) => {
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
      addResult(
        'User Lookup',
        'success',
        `User found: ${targetUser.first_name || targetUser.last_name || targetUser.email}`,
        targetUser
      );

      // Step 2: Directly insert admin role (handle constraint issues)
      addResult(
        'Admin Creation',
        'info',
        `Making ${targetEmail} an admin via direct table operations...`,
        null
      );

      // First check if user already has a role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', targetUser.id)
        .maybeSingle();

      if (checkError) {
        addResult(
          'Role Check',
          'error',
          `Error checking existing role: ${checkError.message}`,
          checkError
        );
      }

      if (existingRole) {
        // Update existing role
        addResult('Admin Creation', 'info', 'Updating existing role to admin...', null);
        const { data: updateResult, error: updateError } = await supabase
          .from('user_roles')
          .update({
            role: 'admin',
            assigned_at: new Date().toISOString(),
          })
          .eq('user_id', targetUser.id);

        if (updateError) {
          addResult(
            'Admin Creation',
            'error',
            `Error updating role: ${updateError.message}`,
            updateError
          );
          addResult(
            'Manual SQL',
            'info',
            `Run this in Supabase SQL Editor: UPDATE user_roles SET role = 'admin', assigned_at = NOW() WHERE user_id = '${targetUser.id}';`,
            null
          );
          return;
        }
      } else {
        // Insert new role
        addResult('Admin Creation', 'info', 'Creating new admin role...', null);
        const { data: insertResult, error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: targetUser.id,
            role: 'admin',
            assigned_at: new Date().toISOString(),
          });

        if (insertError) {
          addResult(
            'Admin Creation',
            'error',
            `Error creating role: ${insertError.message}`,
            insertError
          );
          addResult(
            'Manual SQL',
            'info',
            `Run this in Supabase SQL Editor: INSERT INTO user_roles (user_id, role, assigned_at) VALUES ('${targetUser.id}', 'admin', NOW());`,
            null
          );
          return;
        }
      }

      addResult('Admin Creation', 'success', `Successfully made ${targetEmail} an admin!`, null);

      // Step 3: Verify the admin role was created
      addResult('Verification', 'info', 'Verifying admin role...', null);
      const { data: roleCheck, error: verifyError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', targetUser.id)
        .single();

      if (verifyError) {
        addResult(
          'Verification',
          'error',
          `Error checking admin role: ${verifyError.message}`,
          verifyError
        );
      } else if (roleCheck?.role === 'admin') {
        addResult('Verification', 'success', '✅ Admin privileges confirmed!', roleCheck);
        addResult(
          'Next Steps',
          'info',
          'You can now access the admin dashboard. Refresh your browser if needed.',
          null
        );
        addResult('Admin Dashboard', 'info', 'Go to: /admin to access admin features', null);
      } else {
        addResult(
          'Verification',
          'error',
          'Admin verification failed - role not set correctly',
          roleCheck
        );
      }
    } catch (error) {
      addResult(
        'Unexpected Error',
        'error',
        `Unexpected error: ${(error as Error).message}`,
        error
      );
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
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Coffee className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
            <h1 className="text-3xl font-bold mb-2">Bootstrap Admin</h1>
            <p className="text-muted-foreground">
              Create your first admin user to access the full admin dashboard
            </p>
          </div>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-600" />
                Grant Admin Privileges
              </CardTitle>
              <CardDescription>
                Grant admin privileges to make yourself or another user an admin. Admin users can
                access all features including user management, analytics, and system settings.
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
                    onChange={e => setTargetEmail(e.target.value)}
                    className="flex-1"
                  />
                  {user?.email && (
                    <Button variant="outline" onClick={makeSelfAdmin} className="shrink-0">
                      <User className="h-4 w-4 mr-2" />
                      Make Me Admin
                    </Button>
                  )}
                </div>
                {user?.email && <p className="text-xs text-gray-600">Current user: {user.email}</p>}
              </div>

              <Button
                onClick={makeAdmin}
                disabled={isLoading || !targetEmail}
                className="btn-primary w-full"
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
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Results</h3>

                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${getStatusColor(result.status)} mb-2`}
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
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">After Becoming Admin:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Refresh your browser to see the changes</li>
                  <li>
                    • Navigate to <code>/admin</code> to access the full admin dashboard
                  </li>
                  <li>• Use the Migration tool to set up your database</li>
                  <li>• Use Auth Test tools to verify everything works</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BootstrapAdmin;
