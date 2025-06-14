
import { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/contexts/AuthContext';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoadingPage from '@/components/LoadingPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import ComponentPreloader from '@/components/ComponentPreloader';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Auth = lazy(() => import('@/pages/Auth'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const CreatePost = lazy(() => import('@/pages/CreatePost'));
const BootstrapAdmin = lazy(() => import('@/pages/BootstrapAdmin'));
const CareerTools = lazy(() => import('@/pages/CareerTools'));
const ResumeAnalyzerPage = lazy(() => import('@/pages/tools/ResumeAnalyzerPage'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Cookies = lazy(() => import('@/pages/Cookies'));
const Resources = lazy(() => import('@/pages/Resources'));
const Newsletter = lazy(() => import('@/pages/Newsletter'));
const RSSPage = lazy(() => import('@/pages/RSSPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Create a client with simpler configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading with minimum 2 seconds
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading page during initial app load
  if (isInitialLoading) {
    return <LoadingPage />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <div className="App">
                <ComponentPreloader />
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/career-tools" element={<CareerTools />} />
                    <Route path="/tools/resume-analyzer" element={<ResumeAnalyzerPage />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/rss" element={<RSSPage />} />
                    
                    {/* Protected Admin Routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/create-post" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <CreatePost />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/bootstrap-admin" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <BootstrapAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                
                <Toaster />
              </div>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
