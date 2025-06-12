import { useState, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface BlogCardProps {
  title: string;
  excerpt: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  date: string;
  isRead?: boolean;
  progress?: number;
  slug?: string;
}

// Memoize difficulty colors to prevent recreation on each render
const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-400',
  Intermediate: 'bg-yellow-500/20 text-yellow-400',
  Advanced: 'bg-red-500/20 text-red-400',
} as const;

const BlogCard = memo(
  ({
    title,
    excerpt,
    readTime,
    difficulty,
    tags,
    date,
    isRead = false,
    progress = 0,
    slug,
  }: BlogCardProps) => {
    // Performance monitoring - only in dev mode
    if (process.env.NODE_ENV === 'development') {
      usePerformanceMonitor('BlogCard');
    }

    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    // Memoize event handlers to prevent unnecessary re-renders
    const handleClick = useCallback(() => {
      if (slug) {
        navigate(`/post/${slug}`);
      }
    }, [slug, navigate]);

    // Memoize difficulty color to prevent lookup on each render
    const difficultyColor = useMemo(
      () => difficultyColors[difficulty] || difficultyColors['Beginner'],
      [difficulty]
    );

    // Memoize formatted date
    const formattedDate = useMemo(() => new Date(date).toLocaleDateString(), [date]);

    // Missing event handlers
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
      <article
        className={`glass-panel glass-panel-hover p-4 sm:p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
          isHovered ? 'glow' : ''
        } flex flex-col justify-between min-h-[280px]`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Read article: ${title}`}
        aria-describedby={`excerpt-${slug}`}
      >
        {/* Progress indicator for read articles */}
        {(isRead || progress > 0) && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-xl overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.max(progress, isRead ? 100 : 0)}%` }}
            />
          </div>
        )}

        {/* Header section with meta information */}
        <div className="flex-1">
          {/* Meta information */}
          <div className="flex items-center justify-between mb-3 text-xs sm:text-sm text-muted-foreground">
            <time dateTime={date} className="font-medium">
              {formattedDate}
            </time>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readTime}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
                {difficulty}
              </span>
            </div>
          </div>

          {/* Title - with better typography */}
          <h3 className="text-lg sm:text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-tight">
            {title}
          </h3>

          {/* Excerpt with better readability */}
          <p
            id={`excerpt-${slug}`}
            className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed mb-4"
          >
            {excerpt}
          </p>
        </div>

        {/* Footer section with tags and read status */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex flex-wrap gap-1.5 flex-1 mr-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{tags.length - 3} more</span>
            )}
          </div>

          {/* Read status indicator */}
          {isRead && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Read
            </div>
          )}
        </div>
      </article>
    );
  }
);

BlogCard.displayName = 'BlogCard';

export default BlogCard;
