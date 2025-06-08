import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { BlogCard } from './BlogCard';
import { Skeleton } from './ui/skeleton';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  created_at: string;
  image_url?: string;
  tags?: string[];
  read_time?: number;
}

interface VirtualizedBlogListProps {
  posts: BlogPost[];
  loading?: boolean;
  height?: number;
  itemHeight?: number;
  onPostClick?: (post: BlogPost) => void;
  className?: string;
}

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    posts: BlogPost[];
    onPostClick?: (post: BlogPost) => void;
  };
}

const ListItem: React.FC<ListItemProps> = ({ index, style, data }) => {
  const { posts, onPostClick } = data;
  const post = posts[index];

  if (!post) {
    return (
      <div style={style} className="p-4">
        <Skeleton className="w-full h-48 rounded-lg" />
      </div>
    );
  }

  return (
    <div style={style} className="p-4">
      <BlogCard
        post={post}
        onClick={() => onPostClick?.(post)}
      />
    </div>
  );
};

const VirtualizedBlogList: React.FC<VirtualizedBlogListProps> = ({
  posts,
  loading = false,
  height = 600,
  itemHeight = 280,
  onPostClick,
  className = '',
}) => {
  const itemData = useMemo(() => ({
    posts,
    onPostClick,
  }), [posts, onPostClick]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-lg text-muted-foreground">No posts found</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={posts.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={5}
      >
        {ListItem}
      </List>
    </div>
  );
};

export default VirtualizedBlogList;
