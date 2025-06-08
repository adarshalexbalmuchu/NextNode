
import Background from '@/components/Background';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import Footer from '@/components/Footer';
import { usePostsWithErrorHandling } from '@/hooks/usePostsWithErrorHandling';
import VirtualizedBlogList from '@/components/VirtualizedBlogList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorFallback from '@/components/ErrorFallback';

const Index = () => {
  const { data: posts, isLoading, error, refetch } = usePostsWithErrorHandling();

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      <Hero />
      <FeaturedPosts />
      
      {/* Main Blog List */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Articles</h2>
          
          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" text="Loading articles..." />
            </div>
          ) : error ? (
            <ErrorFallback 
              error={error as Error}
              resetError={() => refetch()}
              title="Failed to load articles"
              description="We couldn't load the latest articles. Please try again."
            />
          ) : posts && posts.length > 0 ? (
            <VirtualizedBlogList posts={posts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found</p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
