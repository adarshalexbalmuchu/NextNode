
import React, { FC, useMemo } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import BlogCard from './BlogCard';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  created_at: string;
  read_time: number | null;
  difficulty_level: string | null;
  featured: boolean | null;
  categories?: {
    name: string;
    color: string;
  } | null;
}

interface VirtualizedBlogListProps {
  posts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
}

interface ListItemData {
  posts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
}

type ListItemProps = ListChildComponentProps<ListItemData>;

const ListItem: FC<ListItemProps> = ({ index, style, data }) => {
  const { posts, onPostClick } = data;
  const post = posts[index];

  if (!post) return null;

  return (
    <div style={style} className="px-2 py-2">
      <BlogCard
        key={post.id}
        title={post.title}
        excerpt={post.excerpt}
        author={post.author}
        date={post.created_at}
        readTime={post.read_time?.toString() || "5"}
        difficulty={post.difficulty_level as "Beginner" | "Intermediate" | "Advanced" || "Intermediate"}
        featured={post.featured}
        category={post.categories}
        slug={post.slug}
        onClick={() => onPostClick?.(post)}
      />
    </div>
  );
};

const VirtualizedBlogList: FC<VirtualizedBlogListProps> = ({ 
  posts, 
  onPostClick = () => {} 
}) => {
  const itemData: ListItemData = useMemo(() => ({
    posts,
    onPostClick,
  }), [posts, onPostClick]);

  if (!posts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <List
        width="100%"
        height={600}
        itemCount={posts.length}
        itemSize={300}
        itemData={itemData}
        overscanCount={5}
      >
        {ListItem}
      </List>
    </div>
  );
};

export default VirtualizedBlogList;
