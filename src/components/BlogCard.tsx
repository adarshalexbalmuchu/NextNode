import { useState, useCallback, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

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
  'Beginner': 'bg-green-500/20 text-green-400',
  'Intermediate': 'bg-yellow-500/20 text-yellow-400', 
  'Advanced': 'bg-red-500/20 text-red-400'
} as const;

const BlogCard = memo(({ 
  title, 
  excerpt, 
  readTime, 
  difficulty, 
  tags, 
  date, 
  isRead = false,
  progress = 0,
  slug
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
  const difficultyColor = useMemo(() => 
    difficultyColors[difficulty] || difficultyColors['Beginner'], 
    [difficulty]
  );

  // Memoize formatted date
  const formattedDate = useMemo(() => 
    new Date(date).toLocaleDateString(), 
    [date]
  );

  // Missing event handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <article 
      className={`glass p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
        isHovered ? 'glow' : 'hover:glow-hover'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </div>
        
        {/* Progress Ring for Read Articles */}
        {isRead && progress > 0 && (
          <div className="relative w-12 h-12 ml-4">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>{readTime} read</span>
          <span className={`px-2 py-1 rounded-md text-xs ${difficultyColor}`}>
            {difficulty}
          </span>
        </div>
        <time>{formattedDate}</time>
      </div>

      {/* Hover Effects */}
      {isHovered && (
        <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl -z-10 blur-sm" />
      )}
    </article>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;
