
import BlogCard from "./BlogCard";
import { usePosts } from "@/hooks/usePosts";
import { format } from "date-fns";
import { SkeletonCard } from "@/components/ui/skeleton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFallback from "@/components/ErrorFallback";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedPosts = () => {
  const { data: posts, isLoading, error } = usePosts(true);

  if (isLoading) {
    return (
      <section id="featured" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="text-primary text-glow">Guides</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Practical AI tools, career strategies, and step-by-step guides to accelerate your professional growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SkeletonCard showImage={true} shimmer={true} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <LoadingSpinner 
              size="md" 
              text="Loading featured guides..." 
              variant="gradient"
              timeout={10000}
            />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="featured" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="text-primary text-glow">Guides</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Practical AI tools, career strategies, and step-by-step guides to accelerate your professional growth.
            </p>
          </div>
          
          <ErrorFallback
            error={error as Error}
            resetError={() => window.location.reload()}
            title="Failed to load featured guides"
            description="We couldn't load the featured guides. Please try again."
          />
        </div>
      </section>
    );
  }

  return (
    <section id="featured" className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-primary text-glow">Guides</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical AI tools, career strategies, and step-by-step guides to accelerate your professional growth.
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
                slug={post.slug}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <Link to="/blog">
            <Button size="lg" className="btn-primary group">
              <span>Explore All Guides</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
