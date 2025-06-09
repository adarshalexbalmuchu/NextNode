import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Reply, Trash2, Edit3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';
import ErrorFallback from './ErrorFallback';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  parent_id: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}

interface CommentsProps {
  postId: string;
}

const Comments = ({ postId }: CommentsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      // First get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Then get profiles for each comment
      const commentsWithProfiles = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', comment.user_id)
            .single();

          return {
            ...comment,
            profiles: profile || null
          };
        })
      );

      return commentsWithProfiles as Comment[];
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      if (!user) throw new Error('Must be authenticated');

      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
          parent_id: parentId || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
      setReplyTo(null);
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error posting comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from('comments')
        .update({ content: content.trim() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setEditingId(null);
      setEditContent('');
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate({ content: newComment, parentId: replyTo || undefined });
  };

  const handleEditComment = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = () => {
    if (!editContent.trim() || !editingId) return;
    updateCommentMutation.mutate({ id: editingId, content: editContent });
  };

  const getDisplayName = (comment: Comment) => {
    if (comment.profiles?.first_name && comment.profiles?.last_name) {
      return `${comment.profiles.first_name} ${comment.profiles.last_name}`;
    }
    return comment.profiles?.email || 'Anonymous';
  };

  const topLevelComments = comments?.filter(c => !c.parent_id) || [];
  const getReplies = (parentId: string) => comments?.filter(c => c.parent_id === parentId) || [];

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <LoadingSpinner text="Loading comments..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorFallback 
        error={error as Error}
        title="Failed to load comments"
        description="We couldn't load the comments for this post."
      />
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments ({comments?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {user ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              {replyTo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel Reply
                </Button>
              )}
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="ml-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Please sign in to leave a comment.
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getDisplayName(comment)}</span>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(comment.created_at), 'MMM d, yyyy')}
                    </Badge>
                  </div>
                  {user?.id === comment.user_id && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditComment(comment)}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCommentMutation.mutate(comment.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdateComment}>
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{comment.content}</p>
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyTo(comment.id)}
                        className="text-xs"
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Replies */}
              {getReplies(comment.id).map((reply) => (
                <div key={reply.id} className="ml-6 bg-muted/30 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{getDisplayName(reply)}</span>
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(reply.created_at), 'MMM d, yyyy')}
                      </Badge>
                    </div>
                    {user?.id === reply.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCommentMutation.mutate(reply.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{reply.content}</p>
                </div>
              ))}
            </div>
          ))}

          {comments?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Comments;
