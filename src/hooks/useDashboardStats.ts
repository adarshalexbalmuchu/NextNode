
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  publishedPosts: number;
  totalViews: number;
  activeAuthors: number;
  loading: boolean;
  error: string | null;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'post_published' | 'comment_created';
  title: string;
  description: string;
  timestamp: string;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    publishedPosts: 0,
    totalViews: 0,
    activeAuthors: 0,
    loading: true,
    error: null,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  const fetchDashboardStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Check if user is admin first
      const { data: userRole, error: roleError } = await supabase.rpc('get_current_user_role');
      
      if (roleError || userRole !== 'admin') {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Admin access required to view dashboard stats',
        }));
        return;
      }

      // Fetch total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('Error fetching users count:', usersError);
        throw usersError;
      }

      // Fetch published posts count
      const { count: publishedPosts, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);

      if (postsError) {
        console.error('Error fetching posts count:', postsError);
        throw postsError;
      }

      // Fetch total views
      const { data: viewsData, error: viewsError } = await supabase
        .from('posts')
        .select('view_count')
        .not('view_count', 'is', null);

      if (viewsError) {
        console.error('Error fetching views data:', viewsError);
        throw viewsError;
      }

      const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

      // Fetch active authors count
      const { data: authorsData, error: authorsError } = await supabase
        .from('posts')
        .select('author')
        .eq('published', true);

      if (authorsError) {
        console.error('Error fetching authors data:', authorsError);
        throw authorsError;
      }

      const uniqueAuthors = new Set(authorsData?.map(post => post.author) || []);
      const activeAuthors = uniqueAuthors.size;

      setStats({
        totalUsers: totalUsers || 0,
        publishedPosts: publishedPosts || 0,
        totalViews,
        activeAuthors,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
      }));
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Check if user is admin
      const { data: userRole, error: roleError } = await supabase.rpc('get_current_user_role');
      
      if (roleError || userRole !== 'admin') {
        return;
      }

      // Fetch recent posts (simplified for now)
      const { data: recentPosts, error: postsError } = await supabase
        .from('posts')
        .select('title, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (postsError) {
        console.error('Error fetching recent posts:', postsError);
        return;
      }

      const activities: RecentActivity[] = recentPosts?.map(post => ({
        id: `post-${post.title}`,
        type: 'post_published' as const,
        title: 'Post published',
        description: post.title,
        timestamp: post.created_at,
      })) || [];

      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivities();
  }, []);

  const refetch = () => {
    fetchDashboardStats();
    fetchRecentActivities();
  };

  return {
    stats,
    recentActivities,
    refetch,
  };
};
