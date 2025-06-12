import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
};

export const usePostsWithErrorHandling = (featured?: boolean) => {
  return useQuery({
    queryKey: ['posts', featured],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(
          `
          *,
          categories (
            name,
            color
          )
        `
        )
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (featured) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error loading posts',
          description: 'Failed to load blog posts. Please try again.',
          variant: 'destructive',
        });
        throw error;
      }

      return data as Post[];
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCategoriesWithErrorHandling = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error loading categories',
          description: 'Failed to load categories. Please try again.',
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
    retry: 3,
  });
};
