import { Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  'aria-label'?: string;
  variant?: 'spinner' | 'pulse' | 'skeleton' | 'gradient';
  showProgress?: boolean;
  progress?: number;
  timeout?: number;
  onTimeout?: () => void;
}

const LoadingSpinner = ({
  size = 'md',
  className,
  text,
  'aria-label': ariaLabel,
  variant = 'spinner',
  showProgress = false,
  progress = 0,
  timeout,
  onTimeout,
}: LoadingSpinnerProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle timeout
  useEffect(() => {
    if (!timeout) return;

    const timer = setTimeout(() => {
      setHasTimedOut(true);
      onTimeout?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  // Show timeout state
  if (hasTimedOut) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-3 p-4', className)}
        role="status"
        aria-live="polite"
      >
        <AlertCircle className={cn('text-yellow-500', sizeClasses[size])} aria-hidden="true" />
        <div className="text-center">
          <p className={cn('font-medium text-yellow-600 mb-1', textSizeClasses[size])}>
            Taking longer than expected
          </p>
          <p className={cn('text-muted-foreground', textSizeClasses[size])}>
            Please check your connection and try again
          </p>
        </div>
        <span className="sr-only">Loading timeout reached</span>
      </div>
    );
  }

  // Show offline state
  if (!isOnline) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-3 p-4', className)}
        role="status"
        aria-live="polite"
      >
        <WifiOff className={cn('text-red-500', sizeClasses[size])} aria-hidden="true" />
        <div className="text-center">
          <p className={cn('font-medium text-red-600 mb-1', textSizeClasses[size])}>
            No internet connection
          </p>
          <p className={cn('text-muted-foreground', textSizeClasses[size])}>
            Check your connection and try again
          </p>
        </div>
        <span className="sr-only">Offline - no internet connection</span>
      </div>
    );
  }

  const renderLoader = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div
            className={cn('rounded-full bg-primary animate-pulse', sizeClasses[size])}
            aria-hidden="true"
          />
        );

      case 'gradient':
        return (
          <div
            className={cn(
              'rounded-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-gradient',
              sizeClasses[size]
            )}
            aria-hidden="true"
          />
        );

      case 'skeleton':
        return (
          <div
            className={cn('rounded bg-muted animate-pulse', sizeClasses[size])}
            aria-hidden="true"
          />
        );

      default:
        return (
          <Loader2
            className={cn('animate-spin text-primary', sizeClasses[size])}
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel || text || 'Loading content'}
    >
      <div className="relative">
        {renderLoader()}

        {/* Progress indicator */}
        {showProgress && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>

      {/* Connection status indicator */}
      <div className="flex items-center gap-1">
        <Wifi className="w-3 h-3 text-green-500" aria-hidden="true" />
        {text && (
          <p className={cn('text-muted-foreground', textSizeClasses[size])} aria-hidden="true">
            {text}
          </p>
        )}
      </div>

      <span className="sr-only">{ariaLabel || text || 'Loading, please wait'}</span>
    </div>
  );
};

export default LoadingSpinner;
