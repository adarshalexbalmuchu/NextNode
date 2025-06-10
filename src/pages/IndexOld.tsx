
import Background from '@/components/Background';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import Footer from '@/components/Footer';
import SearchWithFilters from '@/components/SearchWithFilters';
import BlogCard from '@/components/BlogCard';
import ContentSkeleton from '@/components/ContentSkeleton';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { usePostsWithErrorHandling } from '@/hooks/usePostsWithErrorHandling';
import { useSearchPosts, type SearchFilters } from '@/hooks/useSearchPosts';
import { useCategories } from '@/hooks/usePosts';
import { useAccessibility } from '@/hooks/useAccessibility';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorFallback from '@/components/ErrorFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';

const Index = () => {
  const { data: posts, isLoading, error, refetch } = usePostsWithErrorHandling();
  const { data: categories = [] } = useCategories();
  const { announce, AnnouncementRegion } = useAccessibility();
  
  // Search and filter state for the preview section
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    difficulty: 'all',
    sortBy: 'newest',
    readTime: 'all'
  });

  // Use search hook for filtered results, but fall back to all posts if no search/filters
  const { data: searchResults, isLoading: searchLoading } = useSearchPosts(searchTerm, filters);
  
  // Transform categories for SearchWithFilters component
  const transformedCategories = useMemo(() => 
    categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color || '#00ffff'
    })), 
    [categories]
  );

  // Determine which posts to show - search results if there's a search/filter, otherwise all posts
  const displayPosts = useMemo(() => {
    const hasActiveSearch = searchTerm.trim().length > 0;
    const hasActiveFilters = Object.values(filters).some(value => value && value !== 'all');
    
    if (hasActiveSearch || hasActiveFilters) {
      return searchResults || [];
    }
    
    return posts || [];
  }, [searchTerm, filters, searchResults, posts]);

  // Announce search results to screen readers
  useEffect(() => {
    if (searchResults && searchTerm.trim()) {
      const count = searchResults.length;
      announce(`Found ${count} result${count !== 1 ? 's' : ''} for "${searchTerm}"`);
    }
  }, [searchResults, searchTerm, announce]);
    }
    return posts || [];
  }, [searchTerm, filters, searchResults, posts]);

  const displayLoading = useMemo(() => {
    const hasActiveSearch = searchTerm.trim().length > 0;
    const hasActiveFilters = Object.values(filters).some(value => value && value !== 'all');
    
    if (hasActiveSearch || hasActiveFilters) {
      return searchLoading;
    }
    return isLoading;
  }, [searchTerm, filters, searchLoading, isLoading]);

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      <main id="main-content">
        <Hero />
        <FeaturedPosts />
        
        {/* Main Blog List */}
        <section className="container mx-auto px-6 py-16" aria-labelledby="latest-articles">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 id="latest-articles" className="section-title">
                Discover <span className="text-primary text-glow">Articles</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Search through our collection of cutting-edge research and insights, or explore all articles.
              </p>
            </div>

            {/* Search and Filters - Preview */}
            <div className="mb-8">
              <SearchWithFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFiltersChange={setFilters}
                categories={transformedCategories}
                searchLoading={searchLoading}
                resultCount={displayPosts.length}
                className="max-w-4xl mx-auto"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center mb-8">
              <Link to="/blog">
                <Button size="lg" className="btn-primary group">
                  <span>Explore All Articles</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          
          {displayLoading ? (
            <div className="py-12">
              <LoadingSpinner 
                size="lg" 
                text="Loading articles..." 
                variant="gradient"
                showProgress={true}
                progress={33}
              />
            </div>
          ) : error ? (
            <ErrorFallback 
              error={error as Error}
              resetError={() => refetch()}
              title="Failed to load articles"
              description="We couldn't load the latest articles. Please try again."
            />
          ) : displayPosts && displayPosts.length > 0 ? (
            <div className="space-y-6">
              {/* Results summary */}
              {(searchTerm || Object.values(filters).some(v => v && v !== 'all')) && (
                <div className="text-center text-sm text-muted-foreground">
                  Found {displayPosts.length} {displayPosts.length === 1 ? 'article' : 'articles'}
                  {searchTerm && ` for "${searchTerm}"`}
                </div>
              )}
              
              {/* Show limited results on home page */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPosts.slice(0, 6).map((post, index) => (
                  <div 
                    key={post.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <BlogCard 
                      title={post.title}
                      excerpt={post.excerpt || ''}
                      readTime={`${post.read_time || 5} min`}
                      difficulty={post.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced' || 'Beginner'}
                      tags={post.categories ? [post.categories.name] : []}
                      date={new Date(post.created_at).toLocaleDateString()}
                      isRead={false}
                      progress={0}
                      slug={post.slug}
                    />
                  </div>
                ))}
              </div>
              
              {/* Show more link if there are more articles */}
              {displayPosts.length > 6 && (
                <div className="text-center pt-8">
                  <Link to="/blog">
                    <Button variant="outline" size="lg" className="btn-glass group">
                      View {displayPosts.length - 6} More Articles
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm || Object.values(filters).some(v => v && v !== 'all') 
                    ? 'No matching articles' 
                    : 'No articles found'
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || Object.values(filters).some(v => v && v !== 'all')
                    ? "Try different search terms or adjust your filters."
                    : "No articles have been published yet. Check back soon!"
                  }
                </p>
                {(searchTerm || Object.values(filters).some(v => v && v !== 'all')) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        category: 'all',
                        difficulty: 'all',
                        sortBy: 'newest',
                        readTime: 'all'
                      });
                    }}
                  >
                    Clear search and filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
