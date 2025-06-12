import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { subDays } from 'date-fns';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorFallback from '@/components/ErrorFallback';

const AnalyticsSimple = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const {
    data: postsAnalytics,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ['posts-analytics', timeRange],
    queryFn: async () => {
      try {
        // Check admin access first using the correct function
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Authentication required');
        }

        const { data: userRole, error: roleError } = await supabase.rpc('get_current_user_role');

        if (roleError || userRole !== 'admin') {
          throw new Error('Admin access required');
        }

        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = subDays(new Date(), daysAgo).toISOString();

        const { data, error } = await supabase
          .from('posts')
          .select(
            `
            view_count, 
            created_at, 
            title,
            categories(name)
          `
          )
          .gte('created_at', startDate)
          .eq('published', true)
          .order('view_count', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Analytics error:', error);
        throw error;
      }
    },
    retry: 1,
  });

  const {
    data: userGrowth,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['user-growth', timeRange],
    queryFn: async () => {
      try {
        // Check admin access first using the correct function
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Authentication required');
        }

        const { data: userRole, error: roleError } = await supabase.rpc('get_current_user_role');

        if (roleError || userRole !== 'admin') {
          throw new Error('Admin access required');
        }

        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = subDays(new Date(), daysAgo).toISOString();

        const { data, error } = await supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', startDate)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('User growth error:', error);
        throw error;
      }
    },
    retry: 1,
  });

  // Show loading state
  if (postsLoading || usersLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (postsError) {
    return (
      <ErrorFallback
        error={postsError as Error}
        resetError={() => {
          refetchPosts();
          refetchUsers();
        }}
      />
    );
  }

  const topPosts =
    postsAnalytics?.slice(0, 5).map(post => ({
      title: post.title,
      views: post.view_count || 0,
      category: post.categories?.name || 'Uncategorized',
    })) || [];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>Platform statistics and insights</CardDescription>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
            <CardDescription>Published posts in the last {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{postsAnalytics?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Post views in the last {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {postsAnalytics?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>User registrations in the last {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userGrowth?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Posts with the most views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPosts.length > 0 ? (
              topPosts.map((post, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-muted-foreground">{post.category}</div>
                  </div>
                  <div className="text-sm font-medium">{post.views} views</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Note about charts */}
      <Card className="glass-panel">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              📊 Advanced charts are temporarily disabled due to lodash compatibility issues with
              Recharts.
              <br />
              Basic analytics are still available above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSimple;
