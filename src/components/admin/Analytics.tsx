import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useMemo } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorFallback from '@/components/ErrorFallback';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const { data: postsAnalytics, isLoading: postsLoading, error: postsError, refetch: refetchPosts } = useQuery({
    queryKey: ['posts-analytics', timeRange],
    queryFn: async () => {
      // Check admin access first using the correct function
      const { data: { user } } = await supabase.auth.getUser();
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
        .select(`
          view_count, 
          created_at, 
          title,
          categories(name)
        `)
        .gte('created_at', startDate)
        .eq('published', true)
        .order('view_count', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    retry: 1,
  });

  const { data: userGrowth, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['user-growth', timeRange],
    queryFn: async () => {
      // Check admin access first using the correct function
      const { data: { user } } = await supabase.auth.getUser();
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
    },
    retry: 1,
  });

  // Process data for charts
  const processedViewsData = useMemo(() => {
    if (!postsAnalytics) return [];
    
    const viewsByDate = postsAnalytics.reduce((acc, post) => {
      const date = format(parseISO(post.created_at), 'MMM dd');
      acc[date] = (acc[date] || 0) + (post.view_count || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(viewsByDate).map(([date, views]) => ({
      date,
      views,
    }));
  }, [postsAnalytics]);

  const categoryData = useMemo(() => {
    if (!postsAnalytics) return [];
    
    const categoryStats = postsAnalytics.reduce((acc, post) => {
      const category = post.categories?.name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + (post.view_count || 0);
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#00ffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    return Object.entries(categoryStats)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [postsAnalytics]);

  const topPosts = useMemo(() => {
    if (!postsAnalytics) return [];
    return postsAnalytics
      .slice(0, 5)
      .map(post => ({
        title: post.title,
        views: post.view_count || 0,
        category: post.categories?.name || 'Uncategorized',
      }));
  }, [postsAnalytics]);

  // Show loading state
  if (postsLoading || usersLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  // Show error state
  if (postsError || (!postsAnalytics && !postsLoading)) {
    return (
      <ErrorFallback 
        error={postsError as Error}
        resetError={() => {
          refetchPosts();
          refetchUsers();
        }}
        title="Failed to load analytics"
        description="Unable to load analytics data. You may need admin permissions."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Post Views Over Time</CardTitle>
            <CardDescription>Views from published posts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#00ffff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Content by Category</CardTitle>
            <CardDescription>Distribution of views across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Posts with the most views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPosts.length > 0 ? (
              topPosts.map((post, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
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
    </div>
  );
};

export default Analytics;
