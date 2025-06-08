
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Reply, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type CommentProfile = {
  first_name: string | null;
  last_name: string | null;
  email: string;
};

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profiles: CommentProfile | null;
  replies?: Comment[];
};

interface CommentsProps {
  postId: string;
}

const Comments = ({ postId }: CommentsProps) => {
  const { user, hasRole } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      // Get all comments first
      const { data: allComments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Get all unique user IDs from comments
      const userIds = [...new Set(allComments?.map(comment => comment.user_id) || [])];
      
      // Get profiles for all users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user profiles
      const profilesMap = profiles?.reduce((acc, profile) => {
        acc[profile.id] = {
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
        };
        return acc;
      }, {} as Record<string, CommentProfile>) || {};

      // Organize into parent comments and replies
      const parentComments = allComments?.filter(comment => !comment.parent_id) || [];
      const replies = allComments?.filter(comment => comment.parent_id) || [];

      // Group replies by parent
      const repliesMap = replies.reduce((acc, reply) => {
        if (!acc[reply.parent_id!]) {
          acc[reply.parent_id!] = [];
        }
        acc[reply.parent_id!].push({
          ...reply,
          profiles: profilesMap[reply.user_id] || null,
        });
        return acc;
      }, {} as Record<string, Comment[]>);

      // Attach replies to parent comments
      const commentsWithReplies = parentComments.map(comment => ({
        ...comment,
        profiles: profilesMap[comment.user_id] || null,
        replies: repliesMap[comment.id] || [],
      }));

      return commentsWithReplies as Comment[];
    },
    enabled: !!postId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: postId,
          user_id: user.id,
          parent_id: parentId || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
      setReplyText('');
      setReplyTo(null);
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ content: newComment });
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return;
    addCommentMutation.mutate({ content: replyText, parentId });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = (profile: CommentProfile | null) => {
    if (!profile) return 'Unknown User';
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile.email;
  };

  // Only authenticated users can comment
  if (!user) {
    return (
      <Card className="glass mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="border-dashed">
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">
                Please <a href="/auth" className="text-primary hover:underline">sign in</a> to view and leave comments
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments?.length || 0})
        </CardTitle>
        <CardDescription>
          Share your thoughts and engage with the community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new comment */}
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts on this article..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || addCommentMutation.isPending}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>

        {/* Comments list */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="glass p-4 rounded-lg animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="glass p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(comment.profiles?.first_name, comment.profiles?.last_name, comment.profiles?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {getUserDisplayName(comment.profiles)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-xs"
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>

                    {/* Reply form */}
                    {replyTo === comment.id && (
                      <div className="mt-4 space-y-2">
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyText.trim() || addCommentMutation.isPending}
                          >
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyTo(null);
                              setReplyText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-3 border-l-2 border-muted pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(reply.profiles?.first_name, reply.profiles?.last_name, reply.profiles?.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {getUserDisplayName(reply.profiles)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default Comments;
