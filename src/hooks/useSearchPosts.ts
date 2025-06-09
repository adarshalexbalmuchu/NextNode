import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
};

export interface SearchFilters {
  category?: string;
  difficulty?: string;
  sortBy?: string;
  readTime?: string;
}

export const useSearchPosts = (searchTerm: string, filters: SearchFilters) => {
  return useQuery({
    queryKey: ['searchPosts', searchTerm, filters],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .eq('published', true);

      // Apply search term if provided
      if (searchTerm && searchTerm.trim().length > 0) {
        const searchTermTrimmed = searchTerm.trim();
        query = query.or(`title.ilike.%${searchTermTrimmed}%,excerpt.ilike.%${searchTermTrimmed}%,content.ilike.%${searchTermTrimmed}%`);
      }

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
      }

      // Apply difficulty filter
      if (filters.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty_level', filters.difficulty);
      }

      // Apply reading time filter
      if (filters.readTime && filters.readTime !== 'all') {
        switch (filters.readTime) {
          case 'short':
            query = query.lt('read_time', 5);
            break;
          case 'medium':
            query = query.gte('read_time', 5).lte('read_time', 15);
            break;
          case 'long':
            query = query.gt('read_time', 15);
            break;
        }
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'popular':
          query = query.order('view_count', { ascending: false, nullsFirst: false });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching posts:', error);
        throw error;
      }

      return data as Post[];
    },
    enabled: true, // Always enabled to show all posts by default
  });
};

export const useFilteredPosts = (filters: SearchFilters, searchTerm?: string) => {
  return useSearchPosts(searchTerm || '', filters);
};
