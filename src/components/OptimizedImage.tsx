/**
 * Optimized Image component with lazy loading and performance features
 */
import { useState, useRef, useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { createIntersectionObserver } from '@/utils/lazyLoader';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
  responsive?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGMEYwRjAiLz48L3N2Zz4=',
      responsive = true,
      priority = false,
      onLoad,
      onError,
      className,
      ...props
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Lazy loading with Intersection Observer
    useEffect(() => {
      if (priority || isInView) return;

      const observer = createIntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer?.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '100px' } // Start loading 100px before entering viewport
      );

      if (observer && imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (observer && imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }, [priority, isInView]);

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    // Generate responsive sizes if needed
    const generateSrcSet = (src: string, width?: number) => {
      if (!responsive || !width) return undefined;

      const sizes = [width, width * 2, width * 3];
      return sizes.map(size => `${src}?w=${size} ${size}w`).join(', ');
    };

    const generateSizes = (width?: number) => {
      if (!responsive || !width) return undefined;

      return `(max-width: 768px) ${Math.min(width, 768)}px, ${width}px`;
    };

    return (
      <div className={cn('relative overflow-hidden', className)} style={{ width, height }}>
        {/* Placeholder/skeleton */}
        {!isLoaded && !hasError && (
          <img
            src={placeholder}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 transition-opacity duration-300"
            aria-hidden="true"
          />
        )}

        {/* Main image */}
        {(isInView || priority) && !hasError && (
          <img
            ref={node => {
              imgRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            src={src}
            srcSet={generateSrcSet(src, width)}
            sizes={generateSizes(width)}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            {...props}
          />
        )}

        {/* Error fallback */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Loading indicator */}
        {!isLoaded && !hasError && isInView && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
