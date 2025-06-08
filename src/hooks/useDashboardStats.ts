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

      // Fetch total views (sum of all post view counts)
      const { data: viewsData, error: viewsError } = await supabase
        .from('posts')
        .select('view_count')
        .not('view_count', 'is', null);

      if (viewsError) {
        console.error('Error fetching views data:', viewsError);
        throw viewsError;
      }

      const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

      // Fetch active authors (users with author or admin role who have published posts)
      const { data: authorsData, error: authorsError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles!inner(*)
        `)
        .in('role', ['author', 'admin']);

      if (authorsError) throw authorsError;

      // Count unique authors who have published posts
      const { data: postsWithAuthors, error: postsWithAuthorsError } = await supabase
        .from('posts')
        .select('author')
        .eq('published', true);

      if (postsWithAuthorsError) throw postsWithAuthorsError;

      const uniqueAuthors = new Set(postsWithAuthors?.map(post => post.author) || []);
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
      // Fetch recent user registrations
      const { data: recentUsers, error: usersError } = await supabase
        .from('profiles')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (usersError) throw usersError;

      // Fetch recent published posts
      const { data: recentPosts, error: postsError } = await supabase
        .from('posts')
        .select('title, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (postsError) throw postsError;

      // Fetch recent comments
      const { data: recentComments, error: commentsError } = await supabase
        .from('comments')
        .select(`
          content,
          created_at,
          posts!inner(title)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (commentsError) throw commentsError;

      // Combine and sort all activities
      const activities: RecentActivity[] = [
        ...(recentUsers?.map(user => ({
          id: `user-${user.email}`,
          type: 'user_registration' as const,
          title: 'New user registered',
          description: user.email,
          timestamp: user.created_at,
        })) || []),
        ...(recentPosts?.map(post => ({
          id: `post-${post.title}`,
          type: 'post_published' as const,
          title: 'Post published',
          description: post.title,
          timestamp: post.created_at,
        })) || []),
        ...(recentComments?.map(comment => ({
          id: `comment-${comment.content.substring(0, 20)}`,
          type: 'comment_created' as const,
          title: 'New comment',
          description: `Comment on "${comment.posts?.title || 'Unknown post'}"`,
          timestamp: comment.created_at,
        })) || []),
      ];

      // Sort by timestamp and take the 5 most recent
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      setRecentActivities(sortedActivities);

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
