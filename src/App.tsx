
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary, { AsyncErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { initWebVitals } from "@/hooks/usePerformanceMonitor";
import { registerServiceWorker, promptPWAInstall } from "@/utils/serviceWorker";
import { toast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

// Lazy load admin and heavy components
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const BootstrapAdmin = lazy(() => import("./pages/BootstrapAdmin"));
const CreatePost = lazy(() => import("./pages/CreatePost"));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-dark-slate flex flex-col items-center justify-center p-6">
    <div className="w-full max-w-4xl space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
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
    },
  },
});

const App = () => {
  // Initialize performance monitoring
  useEffect(() => {
    initWebVitals();
  }, []);

  // Initialize service worker and PWA features
  useEffect(() => {
    // Temporarily disable service worker registration to debug React hooks issue
    console.log('Service worker registration disabled for debugging');
    /*
    registerServiceWorker({
      onSuccess: () => {
        console.log('App cached successfully for offline use');
        toast({
          title: "App Ready",
          description: "The app is now available offline!",
        });
      },
      onUpdate: () => {
        console.log('New app version available');
        toast({
          title: "Update Available",
          description: "A new version of the app is available. Refresh to update.",
          action: (
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
            >
              Refresh
            </button>
          ),
        });
      },
      onOffline: () => {
        toast({
          title: "You're Offline",
          description: "The app will continue to work with cached content.",
          variant: "destructive",
        });
      },
      onOnline: () => {
        toast({
          title: "Back Online",
          description: "Connection restored. Syncing data...",
        });
      },
    });

    // Initialize PWA install prompt
    promptPWAInstall();
    */
  }, []);

  return (
    <ErrorBoundary
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        // Log error to monitoring service in production
        console.error('App Error Boundary:', { error, errorInfo });
      }}
    >
      <AsyncErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/bootstrap" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <BootstrapAdmin />
                    </Suspense>
                  } />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Suspense fallback={<PageLoadingFallback />}>
                          <AdminDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/create-post" 
                    element={
                      <ProtectedRoute requiredRole="author">
                        <Suspense fallback={<PageLoadingFallback />}>
                          <CreatePost />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/post/:slug" element={<BlogPost />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AsyncErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;
