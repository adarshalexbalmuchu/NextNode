/**
 * Simple and effective lazy loading system for NextNode
 */

import React, { lazy, Suspense } from 'react';

// Simple loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-dark-slate flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Simple lazy component creator - bypass TypeScript strict checking for dynamic imports
const createLazyComponent = (importFunc: () => Promise<any>) => {
  const LazyComponent = lazy(importFunc);

  const WrappedComponent = (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return WrappedComponent;
};

// All lazy components - TypeScript will resolve these at runtime
export const LazyBlog = createLazyComponent(() => import('@/pages/Blog' as any));
export const LazyBlogPost = createLazyComponent(() => import('@/pages/BlogPost' as any));
export const LazyAbout = createLazyComponent(() => import('@/pages/About' as any));
export const LazyContact = createLazyComponent(() => import('@/pages/Contact' as any));
export const LazyPrivacy = createLazyComponent(() => import('@/pages/Privacy' as any));
export const LazyTerms = createLazyComponent(() => import('@/pages/Terms' as any));
export const LazyCookies = createLazyComponent(() => import('@/pages/Cookies' as any));
export const LazyNewsletter = createLazyComponent(() => import('@/pages/Newsletter' as any));
export const LazyRSSPage = createLazyComponent(() => import('@/pages/RSSPage' as any));
export const LazyAdminDashboard = createLazyComponent(
  () => import('@/pages/AdminDashboard' as any)
);
export const LazyCreatePost = createLazyComponent(() => import('@/pages/CreatePost' as any));
export const LazyBootstrapAdmin = createLazyComponent(
  () => import('@/pages/BootstrapAdmin' as any)
);
export const LazyResources = createLazyComponent(() => import('@/pages/Resources' as any));
export const LazyCareerTools = createLazyComponent(() => import('@/pages/CareerTools' as any));
export const LazyResumeAnalyzer = createLazyComponent(() =>
  import('@/pages/tools/ResumeAnalyzerPage' as any)
);
