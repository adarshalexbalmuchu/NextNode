
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, BarChart3, Settings, Shield } from 'lucide-react';
import Background from '@/components/Background';
import Header from '@/components/Header';
import UserManagement from '@/components/admin/UserManagement';
import PostManagement from '@/components/admin/PostManagement';
import Analytics from '@/components/admin/Analytics';

const AdminDashboard = () => {
  const { user, userRole, hasRole } = useAuth();
  const { stats, recentActivities, refetch } = useDashboardStats();
  const [activeTab, setActiveTab] = useState('overview');

  if (!hasRole('admin')) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (stats.loading) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">Loading Dashboard...</h1>
          <p className="text-muted-foreground">Fetching the latest data</p>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="text-red-500 w-16 h-16 mx-auto mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Error Loading Dashboard</h1>
          <p className="text-muted-foreground mb-4">{stats.error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      <div className="container mx-auto px-6 py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, content, and platform analytics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Platform users
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.publishedPosts}</div>
                  <p className="text-xs text-muted-foreground">
                    Total content
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    Content engagement
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Authors</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAuthors}</div>
                  <p className="text-xs text-muted-foreground">
                    Content creators
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                          </div>
                          <Badge variant="secondary">
                            {new Date(activity.timestamp).toLocaleString()}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">No recent activities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Platform health overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-green-500">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Response Time</span>
                      <Badge className="bg-green-500">Fast (120ms)</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage Usage</span>
                      <Badge variant="outline">45% of 1TB</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Sessions</span>
                      <Badge variant="outline">234 users</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="posts">
            <PostManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
