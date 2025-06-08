
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  created_at: string;
  read_time: number | null;
  difficulty_level: string | null;
  featured: boolean | null;
  categories?: {
    name: string;
    color: string;
  } | null;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const { data: posts, isLoading } = useQuery({
    queryKey: ['search-results', query],
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(name, color)
        `)
        .eq('published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: !!query.trim(),
  });

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Search Results Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold">Search Results</h1>
            </div>
            <p className="text-muted-foreground">
              {query ? `Results for "${query}"` : 'Enter a search term to find articles'}
            </p>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass p-6 rounded-lg animate-pulse">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Found {posts.length} result{posts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    author={post.author}
                    date={post.created_at}
                    readTime={post.read_time?.toString() || "5"}
                    difficulty={post.difficulty_level as "Beginner" | "Intermediate" | "Advanced" || "Intermediate"}
                    featured={post.featured}
                    category={post.categories}
                    slug={post.slug}
                  />
                ))}
              </div>
            </>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any articles matching "{query}". Try different keywords or browse our categories.
              </p>
              <Button onClick={() => navigate('/')}>
                Browse All Articles
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Start your search</h2>
              <p className="text-muted-foreground">
                Enter a search term to find articles on topics you're interested in.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
