import { memo } from 'react';
import { cn } from '@/lib/utils';

interface ContentSkeletonProps {
  variant?: 'card' | 'article' | 'hero' | 'search';
  className?: string;
  count?: number;
}

const ContentSkeleton = memo(({ variant = 'card', className, count = 1 }: ContentSkeletonProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="glass-panel p-4 sm:p-6 rounded-xl animate-pulse">
            {/* Header with meta */}
            <div className="flex justify-between items-center mb-3">
              <div className="h-3 bg-muted rounded w-20"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-muted rounded w-12"></div>
                <div className="h-5 bg-muted rounded w-16"></div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2 mb-4">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-5 bg-muted rounded w-1/2"></div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 pt-3 border-t border-border/50">
              <div className="h-6 bg-muted rounded w-12"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
              <div className="h-6 bg-muted rounded w-14"></div>
            </div>
          </div>
        );

      case 'article':
        return (
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded w-full"></div>
              ))}
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="text-center space-y-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 bg-muted rounded w-32"></div>
              <div className="h-12 bg-muted rounded w-28"></div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-muted rounded"></div>
            <div className="glass-panel p-4 rounded-lg">
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        );

      default:
        return <div className="h-32 bg-muted rounded animate-pulse"></div>;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
});

ContentSkeleton.displayName = 'ContentSkeleton';

export default ContentSkeleton;
