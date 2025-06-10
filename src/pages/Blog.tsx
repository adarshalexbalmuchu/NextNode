import { useState, useMemo } from 'react';
import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchWithFilters from '@/components/SearchWithFilters';
import BlogCard from '@/components/BlogCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorFallback from '@/components/ErrorFallback';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { useSearchPosts, type SearchFilters } from '@/hooks/useSearchPosts';
import { useCategories } from '@/hooks/usePosts';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    difficulty: 'all',
    sortBy: 'newest',
    readTime: 'all'
  });

  const { data: categories = [] } = useCategories();
  const { data: posts, isLoading, error, refetch } = useSearchPosts(searchTerm, filters);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' }
  ];

  // Transform categories for SearchWithFilters component
  const transformedCategories = useMemo(() => 
    categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color || '#00ffff'
    })), 
    [categories]
  );

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      
      <main id="main-content" className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="btn-glass flex items-center gap-2"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Explore <span className="text-primary text-glow">Articles</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover cutting-edge AI research, emerging technologies, and the innovations shaping our future. 
                Search and filter to find exactly what interests you.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <SearchWithFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFiltersChange={setFilters}
              categories={transformedCategories}
              isLoading={isLoading}
              resultCount={posts?.length}
              className="max-w-5xl mx-auto"
            />
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner 
                  size="lg" 
                  text="Searching articles..." 
                  variant="gradient"
                  showProgress={true}
                  progress={50}
                />
              </div>
            ) : error ? (
              <ErrorFallback 
                error={error as Error}
                resetError={() => refetch()}
                title="Failed to load articles"
                description="We couldn't load the articles. Please try again."
              />
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {/* Results header */}
                <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border pb-4">
                  <div>
                    Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                    {searchTerm && ` for "${searchTerm}"`}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Sort:</span>
                    <span className="font-medium">
                      {filters.sortBy === 'newest' ? 'Newest First' :
                       filters.sortBy === 'oldest' ? 'Oldest First' :
                       filters.sortBy === 'popular' ? 'Most Popular' : 'Alphabetical'}
                    </span>
                  </div>
                </div>
                
                {/* Blog grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post, index) => (
                    <div 
                      key={post.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
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
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || Object.values(filters).some(v => v && v !== 'all') 
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "No articles have been published yet. Check back soon for new content!"
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
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
