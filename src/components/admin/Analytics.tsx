
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { data: postsAnalytics } = useQuery({
    queryKey: ['posts-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('view_count, created_at, categories(name)');

      if (error) throw error;
      return data;
    },
  });

  const { data: userGrowth } = useQuery({
    queryKey: ['user-growth'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at');

      if (error) throw error;
      return data;
    },
  });

  // Mock data for demonstration
  const viewsData = [
    { name: 'Jan', views: 4000 },
    { name: 'Feb', views: 3000 },
    { name: 'Mar', views: 5000 },
    { name: 'Apr', views: 4500 },
    { name: 'May', views: 6000 },
    { name: 'Jun', views: 5500 },
  ];

  const categoryData = [
    { name: 'AI Research', value: 400, color: '#00ffff' },
    { name: 'Machine Learning', value: 300, color: '#ff6b6b' },
    { name: 'Quantum Computing', value: 200, color: '#4ecdc4' },
    { name: 'Robotics', value: 150, color: '#45b7d1' },
    { name: 'Neural Networks', value: 100, color: '#96ceb4' },
  ];

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
