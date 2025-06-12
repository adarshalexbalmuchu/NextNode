import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
  shimmer?: boolean;
}

function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  shimmer = true,
  ...props
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-muted rounded relative overflow-hidden',
    shimmer &&
      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-shimmer'
  );

  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-xl',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, variantClasses.text)}
            style={{
              width: index === lines - 1 ? '75%' : '100%',
              ...style,
            }}
            role="presentation"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      role="presentation"
      aria-hidden="true"
      {...props}
    />
  );
}

// Enhanced specialized skeleton components
const SkeletonCard = ({
  showImage = true,
  shimmer = true,
}: {
  showImage?: boolean;
  shimmer?: boolean;
}) => (
  <div className="glass p-6 rounded-xl space-y-4" role="presentation" aria-hidden="true">
    {showImage && <Skeleton variant="rectangular" height="200" shimmer={shimmer} />}
    <div className="space-y-3">
      <Skeleton variant="rectangular" height="12" className="w-3/4" shimmer={shimmer} />
      <Skeleton variant="text" lines={3} shimmer={shimmer} />
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width="32" height="32" shimmer={shimmer} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="120" shimmer={shimmer} />
          <Skeleton variant="text" width="80" shimmer={shimmer} />
        </div>
      </div>
    </div>
  </div>
);

const SkeletonBlogPost = ({
  showMeta = true,
  shimmer = true,
}: {
  showMeta?: boolean;
  shimmer?: boolean;
}) => (
  <article className="space-y-6" role="presentation" aria-hidden="true">
    {/* Featured Image */}
    <Skeleton variant="rectangular" height="200" className="w-full" shimmer={shimmer} />

    {/* Content */}
    <div className="space-y-4">
      <Skeleton variant="text" height="32" className="w-3/4" shimmer={shimmer} />
      <Skeleton variant="text" lines={5} shimmer={shimmer} />

      {showMeta && (
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" width="40" height="40" shimmer={shimmer} />
          <div className="space-y-2">
            <Skeleton variant="text" width="120" shimmer={shimmer} />
            <Skeleton variant="text" width="80" shimmer={shimmer} />
          </div>
        </div>
      )}
    </div>
  </article>
);

const SkeletonAvatar = ({
  size = 'md',
  shimmer = true,
}: {
  size?: 'sm' | 'md' | 'lg';
  shimmer?: boolean;
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={sizeClasses[size]}
      shimmer={shimmer}
      role="presentation"
      aria-hidden="true"
    />
  );
};

const SkeletonTable = ({
  rows = 5,
  columns = 4,
  shimmer = true,
}: {
  rows?: number;
  columns?: number;
  shimmer?: boolean;
}) => (
  <div className="space-y-3" role="presentation" aria-hidden="true">
    {/* Header */}
    <div className="grid grid-cols-4 gap-4 p-4 border-b">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant="text" height="16" shimmer={shimmer} />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant={colIndex === 0 ? 'circular' : 'text'}
            height={colIndex === 0 ? '32' : '16'}
            width={colIndex === 0 ? '32' : undefined}
            shimmer={shimmer}
          />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonDashboard = ({ shimmer = true }: { shimmer?: boolean }) => (
  <div className="space-y-6" role="presentation" aria-hidden="true">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="glass-panel p-6 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width="100" shimmer={shimmer} />
            <Skeleton variant="circular" width="24" height="24" shimmer={shimmer} />
          </div>
          <Skeleton variant="text" height="24" width="60" shimmer={shimmer} />
          <Skeleton variant="text" width="120" shimmer={shimmer} />
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-6 rounded-lg space-y-4">
        <Skeleton variant="text" height="20" width="200" shimmer={shimmer} />
        <Skeleton variant="rectangular" height="300" shimmer={shimmer} />
      </div>
      <div className="glass-panel p-6 rounded-lg space-y-4">
        <Skeleton variant="text" height="20" width="180" shimmer={shimmer} />
        <Skeleton variant="rectangular" height="300" shimmer={shimmer} />
      </div>
    </div>
  </div>
);

export {
  Skeleton,
  SkeletonCard,
  SkeletonBlogPost,
  SkeletonAvatar,
  SkeletonTable,
  SkeletonDashboard,
};
