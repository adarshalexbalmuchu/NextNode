import Background from '@/components/Background';
import Header from '@/components/Header';
import GamifiedHero from '@/components/GamifiedHero';
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
import { ArrowRight, BookOpen, User, FileText, Search, Settings, Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    readTime: 'all',
  });

  // Use search hook for filtered results, but fall back to all posts if no search/filters
  const { data: searchResults, isLoading: searchLoading } = useSearchPosts(searchTerm, filters);

  // Transform categories for SearchWithFilters component
  const transformedCategories = useMemo(
    () =>
      categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color || '#00ffff',
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

  const displayLoading = useMemo(() => {
    const hasActiveSearch = searchTerm.trim().length > 0;
    const hasActiveFilters = Object.values(filters).some(value => value && value !== 'all');

    if (hasActiveSearch || hasActiveFilters) {
      return searchLoading;
    }
    return isLoading;
  }, [searchTerm, filters, searchLoading, isLoading]);

  const hasActiveSearchOrFilters =
    searchTerm.trim() || Object.values(filters).some(v => v && v !== 'all');

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      <AnnouncementRegion />

      <main id="main-content">
        <GamifiedHero />
        <FeaturedPosts />

        {/* Enhanced Start Here Section with Gamification */}
        <section
          className="container mx-auto px-4 sm:px-6 py-16 bg-gradient-to-br from-background/50 to-muted/30"
          aria-labelledby="start-here"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <motion.h2 
                id="start-here" 
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Choose Your <span className="text-primary text-glow">Path</span>
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                🎯 Select your adventure and start earning XP, unlocking achievements, and leveling up your skills!
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Student Path */}
              <motion.div 
                className="glass-panel p-8 rounded-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                <div className="text-center mb-6 relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <BookOpen className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    🎓 Student Quest
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">+50 XP</span>
                  </h3>
                  <p className="text-muted-foreground">
                    Level up your academic game and unlock career achievements
                  </p>
                </div>
                
                <div className="space-y-3 mb-6 relative z-10">
                  {[
                    { text: "🧠 AI-powered study techniques", xp: "+25 XP" },
                    { text: "📝 Resume building mastery", xp: "+40 XP" },
                    { text: "🎤 Interview preparation", xp: "+35 XP" },
                    { text: "⚡ Productivity hacks", xp: "+30 XP" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <span className="text-sm">{item.text}</span>
                      <span className="text-xs text-green-400 font-medium">{item.xp}</span>
                    </motion.div>
                  ))}
                </div>
                
                <Link to="/blog?category=students">
                  <Button className="w-full btn-primary group">
                    <Trophy className="w-4 h-4 mr-2" />
                    Start Student Journey
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>

              {/* Enhanced Professional Path */}
              <motion.div 
                className="glass-panel p-8 rounded-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                <div className="text-center mb-6 relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  >
                    <User className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    💼 Pro Career Path
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">+75 XP</span>
                  </h3>
                  <p className="text-muted-foreground">
                    Master advanced AI tools and accelerate your career growth
                  </p>
                </div>
                
                <div className="space-y-3 mb-6 relative z-10">
                  {[
                    { text: "🤖 AI workflow automation", xp: "+50 XP" },
                    { text: "🎯 Advanced prompt engineering", xp: "+60 XP" },
                    { text: "🚀 Career transition strategies", xp: "+45 XP" },
                    { text: "👑 Leadership in AI era", xp: "+70 XP" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className="text-sm">{item.text}</span>
                      <span className="text-xs text-green-400 font-medium">{item.xp}</span>
                    </motion.div>
                  ))}
                </div>
                
                <Link to="/blog?category=professionals">
                  <Button className="w-full btn-primary group">
                    <Target className="w-4 h-4 mr-2" />
                    Start Pro Journey
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Toolkits & Templates Section */}
        <section className="container mx-auto px-4 sm:px-6 py-16" aria-labelledby="toolkits">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="toolkits" className="section-title">
                Featured <span className="text-primary text-glow">Toolkits</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Ready-to-use templates and comprehensive toolkits to jumpstart your success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Resume Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-optimized resume templates for various industries
                </p>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>

              <div className="glass-panel p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Interview Prep Kit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete guide with AI-generated practice questions
                </p>
                <Button variant="outline" size="sm">
                  Get Kit
                </Button>
              </div>

              <div className="glass-panel p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Productivity Automation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Step-by-step automation workflows for daily tasks
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Blog List Section */}
        <section className="container mx-auto px-4 sm:px-6 py-16" aria-labelledby="latest-articles">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 id="latest-articles" className="section-title">
                Discover <span className="text-primary text-glow">Practical Guides</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Search through our collection of AI tools, career insights, and practical guides
                tailored for students and professionals.
              </p>
            </div>

            {/* Enhanced Search and Filters */}
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
                <Button size="lg" className="btn-primary group touch-friendly">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Explore All Articles</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Content Area with Enhanced Loading States */}
            {displayLoading ? (
              <div className="py-12">
                <ContentSkeleton variant="card" count={6} />
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
                {hasActiveSearchOrFilters && (
                  <div className="text-center text-sm text-muted-foreground glass-panel p-3 rounded-lg">
                    Found <span className="font-medium text-foreground">{displayPosts.length}</span>{' '}
                    {displayPosts.length === 1 ? 'article' : 'articles'}
                    {searchTerm && <span className="text-primary"> for "{searchTerm}"</span>}
                  </div>
                )}

                {/* Enhanced Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayPosts.slice(0, 6).map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-fade-in will-change-opacity"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <BlogCard
                        title={post.title}
                        excerpt={post.excerpt || 'No preview available...'}
                        readTime={`${post.read_time || 5} min`}
                        difficulty={
                          (post.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced') ||
                          'Beginner'
                        }
                        tags={post.categories ? [post.categories.name] : ['General']}
                        date={post.created_at}
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
                    <Link to="/blog" className="inline-block">
                      <Button
                        variant="outline"
                        size="lg"
                        className="btn-glass group touch-friendly"
                      >
                        View {displayPosts.length - 6} More Articles
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              /* Enhanced Empty State */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto glass-panel p-8 rounded-xl">
                  <div className="text-6xl mb-4 opacity-50">📚</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {hasActiveSearchOrFilters ? 'No matching guides' : 'No guides found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {hasActiveSearchOrFilters
                      ? 'Try different search terms or adjust your filters.'
                      : 'No guides have been published yet. Check back soon!'}
                  </p>
                  {hasActiveSearchOrFilters && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({
                          category: 'all',
                          difficulty: 'all',
                          sortBy: 'newest',
                          readTime: 'all',
                        });
                      }}
                      className="touch-friendly"
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
