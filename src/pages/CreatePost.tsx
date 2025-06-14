
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/usePosts';
import ImageUpload from '@/components/ImageUpload';

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  read_time: number;
  published: boolean;
  featured: boolean;
  featured_image: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    difficulty_level: 'Beginner',
    read_time: 5,
    published: false,
    featured: false,
    featured_image: '',
  });

  const [previewMode, setPreviewMode] = useState(false);

  // Only authors and admins can create posts
  if (!hasRole('author')) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-6 py-20 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need author privileges to create posts.</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('posts').insert({
        ...data,
        author: `${user.email}`,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
      navigate('/admin?tab=posts');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category_id) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    createPostMutation.mutate(formData);
  };

  const estimateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const handleContentChange = (content: string) => {
    handleInputChange('content', content);
    const readTime = estimateReadTime(content);
    handleInputChange('read_time', readTime);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin?tab=posts')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Post</h1>
              <p className="text-muted-foreground">Share your knowledge with the community</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Write your article content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder="Enter a compelling title"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => handleInputChange('slug', e.target.value)}
                    placeholder="url-friendly-slug"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={e => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief description that appears in previews"
                    className="min-h-[80px]"
                  />
                </div>

                <ImageUpload
                  onImageUploaded={(imageUrl) => handleInputChange('featured_image', imageUrl)}
                  onImageRemoved={() => handleInputChange('featured_image', '')}
                  currentImage={formData.featured_image}
                  label="Featured Image"
                />

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  {previewMode ? (
                    <Card className="min-h-[400px] p-4">
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        {formData.content ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formData.content.replace(/\n/g, '<br>'),
                            }}
                          />
                        ) : (
                          <p className="text-muted-foreground">Start writing to see preview...</p>
                        )}
                      </div>
                    </Card>
                  ) : (
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={e => handleContentChange(e.target.value)}
                      placeholder="Write your article content here..."
                      className="min-h-[400px] font-mono"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Publish immediately</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={checked => handleInputChange('published', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured post</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={checked => handleInputChange('featured', checked)}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createPostMutation.isPending}
                  className="w-full flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                </Button>
              </CardContent>
            </Card>

            {/* Post Settings */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={value => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value: 'Beginner' | 'Intermediate' | 'Advanced') =>
                      handleInputChange('difficulty_level', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="read_time">Read Time (minutes)</Label>
                  <Input
                    id="read_time"
                    type="number"
                    value={formData.read_time}
                    onChange={e => handleInputChange('read_time', parseInt(e.target.value))}
                    min="1"
                    max="60"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Post Stats */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Post Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Characters:</span>
                  <Badge variant="outline">{formData.content.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Words:</span>
                  <Badge variant="outline">
                    {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Est. Read Time:</span>
                  <Badge variant="outline">{formData.read_time} min</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
