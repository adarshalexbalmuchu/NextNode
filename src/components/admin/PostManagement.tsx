
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
};

const PostManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (
            name,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ postId, published }: { postId: string; published: boolean }) => {
      const { error } = await supabase
        .from('posts')
        .update({ published: !published })
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: "Success",
        description: "Post status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Post Management</CardTitle>
        <CardDescription>
          Manage blog posts and content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="ml-4" onClick={() => navigate('/create-post')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {post.read_time} min read
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    {post.categories && (
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: post.categories.color,
                          color: post.categories.color 
                        }}
                      >
                        {post.categories.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{post.view_count || 0}</TableCell>
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublishMutation.mutate({
                          postId: post.id,
                          published: post.published || false
                        })}
                      >
                        {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deletePostMutation.mutate(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredPosts?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No posts found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostManagement;
