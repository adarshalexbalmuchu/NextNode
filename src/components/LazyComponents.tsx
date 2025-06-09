/**
 * Lazy-loaded components for better performance
 */
import { createLazyComponent } from '@/utils/lazyLoader';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load heavy components
export const LazyAdminDashboard = createLazyComponent(
  () => import('@/pages/AdminDashboard')
);

export const LazyCreatePost = createLazyComponent(
  () => import('@/pages/CreatePost')
);

export const LazyBlogPost = createLazyComponent(
  () => import('@/pages/BlogPost')
);

export const LazyVirtualizedBlogList = createLazyComponent(
  () => import('@/components/VirtualizedBlogList')
);

export const LazyComments = createLazyComponent(
  () => import('@/components/Comments')
);

export const LazyImageUpload = createLazyComponent(
  () => import('@/components/ImageUpload')
);

// Wrapper component with Suspense
export const LazyComponentWrapper = ({ 
  children, 
  fallback = <LoadingSpinner /> 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Preload critical components on hover/focus
export const preloadCriticalComponents = () => {
  // Preload admin components when user hovers over admin links
  const preloadAdmin = () => {
    import('@/pages/AdminDashboard');
    import('@/pages/CreatePost');
  };
  
  // Preload blog components when user shows intent to read
  const preloadBlog = () => {
    import('@/pages/BlogPost');
    import('@/components/Comments');
  };
  
  return { preloadAdmin, preloadBlog };
};
