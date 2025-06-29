import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Comments from '@/components/Comments';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, User, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { SkeletonBlogPost } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorFallback from '@/components/ErrorFallback';
import { useAccessibility } from '@/hooks/useAccessibility';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');

      const { data, error } = await supabase
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
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Update view count
  const updateViewCount = useQuery({
    queryKey: ['post-view', post?.id],
    queryFn: async () => {
      if (!post?.id) return null;

      const { error } = await supabase
        .from('posts')
        .update({ view_count: (post.view_count || 0) + 1 })
        .eq('id', post.id);

      if (error) throw error;
      return null;
    },
    enabled: !!post?.id,
  });

  const difficultyColors = {
    Beginner: 'bg-green-500/20 text-green-400',
    Intermediate: 'bg-yellow-500/20 text-yellow-400',
    Advanced: 'bg-red-500/20 text-red-400',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Posts
              </Button>
            </div>

            <SkeletonBlogPost showMeta={true} shimmer={true} />

            <div className="mt-12 text-center">
              <LoadingSpinner
                size="lg"
                text="Loading article..."
                variant="gradient"
                showProgress={true}
                progress={33}
                timeout={15000}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen w-full">
        <Background />
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Posts
              </Button>
            </div>

            <ErrorFallback
              error={(error as Error) || new Error('Post not found')}
              resetError={() => navigate('/')}
              title="Post Not Found"
              description="The blog post you're looking for doesn't exist or has been removed."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />

      <article className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <BreadcrumbNav
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.title, href: `/blog/${post.slug}` },
              ]}
            />
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="btn-glass flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories && (
                <Badge
                  variant="outline"
                  style={{
                    borderColor: post.categories.color,
                    color: post.categories.color,
                  }}
                >
                  {post.categories.name}
                </Badge>
              )}
              {post.difficulty_level && (
                <Badge
                  className={
                    difficultyColors[post.difficulty_level as keyof typeof difficultyColors]
                  }
                >
                  {post.difficulty_level}
                </Badge>
              )}
              {post.featured && <Badge variant="default">Featured</Badge>}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
            )}

            {/* Meta Information */}
            <Card className="glass-panel mb-8">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>By {post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{(post.view_count || 0) + 1} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </header>

          {/* Article Content */}
          <Card className="glass-panel mb-12">
            <CardContent className="p-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content.replace(/\n/g, '<br>'),
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Article Footer */}
          <Card className="glass-panel mb-12">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Last updated:{' '}
                    {format(new Date(post.updated_at || post.created_at), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">Article ID: {post.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="btn-glass">
                    Share Article
                  </Button>
                  <Button variant="outline" size="sm" className="btn-glass">
                    Bookmark
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Comments postId={post.id} />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
