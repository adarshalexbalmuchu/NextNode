
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
};

export const usePosts = (featured?: boolean) => {
  return useQuery({
    queryKey: ['posts', featured],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          categories (
            name,
            color
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (featured) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Post[];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return data;
    },
  });
};
