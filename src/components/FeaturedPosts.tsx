
import BlogCard from "./BlogCard";
import { usePosts } from "@/hooks/usePosts";
import { format } from "date-fns";

const FeaturedPosts = () => {
  const { data: posts, isLoading, error } = usePosts(true);

  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Latest <span className="text-primary text-glow">Research</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dive deep into cutting-edge AI research, emerging technologies, and the innovations shaping our future.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="glass p-6 rounded-xl animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-muted rounded-full"></div>
                  <div className="h-6 w-12 bg-muted rounded-full"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-red-400">Error loading posts. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Latest <span className="text-primary text-glow">Research</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive deep into cutting-edge AI research, emerging technologies, and the innovations shaping our future.
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post, index) => (
            <div 
              key={post.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BlogCard 
                title={post.title}
                excerpt={post.excerpt || ''}
                readTime={`${post.read_time} min`}
                difficulty={post.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced'}
                tags={post.categories ? [post.categories.name] : []}
                date={format(new Date(post.created_at), 'MMM d, yyyy')}
                isRead={false}
                progress={0}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="glass px-8 py-4 rounded-xl hover:glow-hover transition-all duration-300 font-medium">
            Explore All Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
