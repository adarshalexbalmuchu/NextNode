
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, Users, Eye, MessageSquare, Heart } from 'lucide-react';
import { useState, useMemo } from 'react';
import { format, subDays, parseISO } from 'date-fns';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const { data: postsAnalytics, refetch: refetchPosts } = useQuery({
    queryKey: ['posts-analytics', timeRange],
    queryFn: async () => {
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = subDays(new Date(), daysAgo).toISOString();
      
      const { data, error } = await supabase
        .from('posts')
        .select('view_count, created_at, categories(name), title')
        .gte('created_at', startDate)
        .order('view_count', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: userGrowth, refetch: refetchUsers } = useQuery({
    queryKey: ['user-growth', timeRange],
    queryFn: async () => {
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = subDays(new Date(), daysAgo).toISOString();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: engagementStats } = useQuery({
    queryKey: ['engagement-stats', timeRange],
    queryFn: async () => {
      // This would be real engagement data from your analytics
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = subDays(new Date(), daysAgo).toISOString();
      
      // Mock data - replace with real queries when you have engagement tracking
      return {
        totalViews: 45678,
        totalUsers: 1234,
        totalComments: 567,
        totalLikes: 2345,
        averageSessionTime: '4:23',
        bounceRate: 32.5,
        conversionRate: 8.2,
      };
    },
  });

  // Process data for charts
  const processedViewsData = useMemo(() => {
    if (!postsAnalytics) return [];
    
    // Group posts by date and sum views
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

  const processedUserGrowth = useMemo(() => {
    if (!userGrowth) return [];
    
    // Group users by date
    const usersByDate = userGrowth.reduce((acc, user) => {
      const date = format(parseISO(user.created_at), 'MMM dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to cumulative growth
    let cumulative = 0;
    return Object.entries(usersByDate).map(([date, count]) => {
      cumulative += count;
      return { date, users: cumulative, newUsers: count };
    });
  }, [userGrowth]);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPosts(), refetchUsers()]);
    setRefreshing(false);
  };

  // Mock data for demonstration - will be replaced with real data
  const viewsData = useMemo(() => {
    if (!userGrowth) return [
      { name: 'Jan', views: 4000 },
      { name: 'Feb', views: 3000 },
      { name: 'Mar', views: 5000 },
      { name: 'Apr', views: 4500 },
      { name: 'May', views: 6000 },
      { name: 'Jun', views: 5500 },
    ];

    // Group user registrations by month for the chart
    const monthlyData = userGrowth.reduce((acc, user) => {
      const month = format(parseISO(user.created_at), 'MMM');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData).map(([name, views]) => ({
      name,
      views,
    }));
  }, [userGrowth]);

  const engagementData = [
    { name: 'Mon', comments: 12, views: 2400 },
    { name: 'Tue', comments: 19, views: 1398 },
    { name: 'Wed', comments: 8, views: 9800 },
    { name: 'Thu', comments: 27, views: 3908 },
    { name: 'Fri', comments: 18, views: 4800 },
    { name: 'Sat', comments: 23, views: 3800 },
    { name: 'Sun', comments: 15, views: 4300 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Monthly Views</CardTitle>
            <CardDescription>Page views over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#00ffff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Content by Category</CardTitle>
            <CardDescription>Distribution of posts across categories</CardDescription>
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

      <Card className="glass">
        <CardHeader>
          <CardTitle>Weekly Engagement</CardTitle>
          <CardDescription>Comments and views throughout the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="views" fill="#00ffff" />
              <Line yAxisId="right" type="monotone" dataKey="comments" stroke="#ff6b6b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Multimodal AI Revolution</span>
                <span className="text-sm font-medium">1,234 views</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Quantum Supremacy</span>
                <span className="text-sm font-medium">987 views</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Neural Networks Explained</span>
                <span className="text-sm font-medium">756 views</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Daily Active Users</span>
                <span className="text-sm font-medium">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">New Signups Today</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Comments This Week</span>
                <span className="text-sm font-medium">156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Content Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Published Posts</span>
                <span className="text-sm font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Draft Posts</span>
                <span className="text-sm font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Featured Posts</span>
                <span className="text-sm font-medium">12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
