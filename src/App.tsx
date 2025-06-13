import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/contexts/AuthContext';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary, { AsyncErrorBoundary } from '@/components/ErrorBoundary';
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
// import { initWebVitals } from "@/hooks/usePerformanceMonitor";
// import { registerServiceWorker, promptPWAInstall } from "@/utils/serviceWorker";
// import { checkPerformanceBudget, logBundleInfo } from "@/utils/performanceOptimizer";
// import { initCriticalResources } from "@/utils/criticalResourceOptimizer";
import { toast } from '@/hooks/use-toast';
import ComponentPreloader from '@/components/ComponentPreloader';
import {
  LazyBlog,
  LazyBlogPost,
  LazyAbout,
  LazyContact,
  LazyPrivacy,
  LazyTerms,
  LazyCookies,
  LazyNewsletter,
  LazyRSSPage,
  LazyAdminDashboard,
  LazyCreatePost,
  LazyBootstrapAdmin,
  LazyResources,
  LazyCareerTools,
  LazyResumeAnalyzer,
} from '@/utils/simpleLazyLoading';

// Critical pages loaded immediately for better performance
import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

// Loading fallback component - optimized for LCP
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-dark-slate flex flex-col items-center justify-center p-6">
    <div className="w-full max-w-4xl space-y-4">
      {/* Prioritize critical above-the-fold content */}
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      // Add network-based retry delay
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Faster timeout for mutations
      networkMode: 'online',
    },
  },
});

const App = () => {
  console.log('App component rendering'); // Debug log

  // Initialize critical resources first - temporarily disabled for debugging
  useEffect(() => {
    console.log('App component mounted successfully');
    // TODO: Re-enable performance optimizations after fixing runtime issues
    // try {
    //   initCriticalResources();
    // } catch (error) {
    //   console.error('Error initializing critical resources:', error);
    // }
  }, []);

  // Initialize performance monitoring and preload optimization - temporarily disabled
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('Initializing performance monitoring...');
  //     try {
  //       initWebVitals();
  //       checkPerformanceBudget();
  //
  //       // Log bundle info after page load stabilizes
  //       const timeoutId = setTimeout(() => {
  //         logBundleInfo();
  //       }, 3000);
  //
  //       return () => clearTimeout(timeoutId);
  //     } catch (error) {
  //       console.error('Error initializing performance monitoring:', error);
  //     }
  //   }
  // }, []);

  // Initialize service worker and PWA features - temporarily disabled for debugging
  // useEffect(() => {
  //   console.log('Service worker initialization...');
  //   try {
  //     // Only enable in production to avoid development issues
  //     if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  //       registerServiceWorker({
  //         onSuccess: () => {
  //           console.log('App cached successfully for offline use');
  //           toast({
  //             title: "App Ready",
  //             description: "The app is now available offline!",
  //           });
  //         },
  //         onUpdate: () => {
  //           console.log('New app version available');
  //           toast({
  //             title: "Update Available",
  //             description: "A new version of the app is available. Refresh to update.",
  //           });
  //         },
  //         onOffline: () => {
  //           toast({
  //             title: "You're Offline",
  //             description: "The app will continue to work with cached content.",
  //             variant: "destructive",
  //           });
  //         },
  //         onOnline: () => {
  //           toast({
  //             title: "Back Online",
  //             description: "Connection restored. Syncing data...",
  //           });
  //         },
  //       });
  //       promptPWAInstall();
  //     } else {
  //       console.log('Service worker skipped (development mode)');
  //     }
  //   } catch (error) {
  //     console.error('Error with service worker:', error);
  //   }
  // }, []);

  return (
    <ErrorBoundary
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        // Log error to monitoring service in production
        console.error('App Error Boundary:', { error, errorInfo });
      }}
    >
      <AsyncErrorBoundary>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AuthProvider>
                  <ComponentPreloader />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<LazyBlog />} />
                    <Route path="/resources" element={<LazyResources />} />
                    <Route path="/career-tools" element={<LazyCareerTools />} />
                    <Route path="/tools/resume-analyzer" element={<LazyResumeAnalyzer />} />
                    <Route path="/about" element={<LazyAbout />} />
                    <Route path="/contact" element={<LazyContact />} />
                    <Route path="/privacy" element={<LazyPrivacy />} />
                    <Route path="/terms" element={<LazyTerms />} />
                    <Route path="/cookies" element={<LazyCookies />} />
                    <Route path="/newsletter" element={<LazyNewsletter />} />
                    <Route path="/rss" element={<LazyRSSPage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/bootstrap" element={<LazyBootstrapAdmin />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <LazyAdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create-post"
                      element={
                        <ProtectedRoute requiredRole="author">
                          <LazyCreatePost />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/post/:slug" element={<LazyBlogPost />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>{' '}
                </AuthProvider>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </AsyncErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;
