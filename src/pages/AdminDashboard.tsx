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
import AnalyticsSimple from '@/components/admin/AnalyticsSimple';
import { SkeletonDashboard } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const { user, userRole, hasRole, loading } = useAuth();
  const { stats, recentActivities, refetch } = useDashboardStats();
  const [activeTab, setActiveTab] = useState('overview');

  // Debug logging
  console.log('AdminDashboard debug:', {
    user: user?.id,
    userRole,
    hasAdminRole: hasRole('admin'),
    authLoading: loading,
    statsLoading: stats.loading,
    statsError: stats.error,
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center" role="main">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-sm sm:text-base mt-4">
            Checking authentication...
          </p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center" role="main">
          <Shield
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground"
            aria-hidden="true"
          />
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Please log in to access this page.
          </p>
        </main>
      </div>
    );
  }

  if (!hasRole('admin')) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center" role="main">
          <Shield
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground"
            aria-hidden="true"
          />
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            You don't have permission to access this page. Current role: {userRole || 'none'}
          </p>
        </main>
      </div>
    );
  }

  if (stats.loading) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20" role="main">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Loading dashboard data...</p>
          </div>

          <SkeletonDashboard />
        </main>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center" role="main">
          <div
            className="text-red-500 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-4xl sm:text-5xl"
            aria-hidden="true"
          >
            ⚠️
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Error Loading Dashboard</h1>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">{stats.error}</p>
          <Button onClick={refetch} className="min-h-[44px]">
            Try Again
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20" role="main">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage users, content, and platform analytics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8"
            role="tablist"
            aria-label="Dashboard sections"
          >
            <TabsTrigger
              value="overview"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              role="tab"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              role="tab"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              role="tab"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              role="tab"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Charts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" role="tabpanel" aria-labelledby="overview-tab">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card className="glass-panel">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Platform users</p>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stats.publishedPosts}</div>
                  <p className="text-xs text-muted-foreground">Total content</p>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">Content engagement</p>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Authors</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stats.activeAuthors}</div>
                  <p className="text-xs text-muted-foreground">Content creators</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                  <CardDescription className="text-sm">
                    Latest actions on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map(activity => (
                        <div
                          key={activity.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {activity.description}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs shrink-0 self-start sm:self-center"
                          >
                            {new Date(activity.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-6 sm:py-8">
                        <p className="text-sm text-muted-foreground">No recent activities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">System Status</CardTitle>
                  <CardDescription className="text-sm">Platform health overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge
                        className="bg-green-500 text-white"
                        aria-label="Database status: Healthy"
                      >
                        Healthy
                      </Badge>
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

          <TabsContent value="users" role="tabpanel" aria-labelledby="users-tab">
            <UserManagement />
          </TabsContent>

          <TabsContent value="posts" role="tabpanel" aria-labelledby="posts-tab">
            <PostManagement />
          </TabsContent>

          <TabsContent value="analytics" role="tabpanel" aria-labelledby="analytics-tab">
            <AnalyticsSimple />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
