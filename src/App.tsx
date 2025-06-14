
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/contexts/AuthContext';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { GamificationProvider } from '@/components/gamification/GamificationProvider';
import { ToastProvider } from '@/components/ui/toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import ComponentPreloader from '@/components/ComponentPreloader';

// Lazy load components for better performance
import { lazyLoader } from '@/utils/lazyLoader';

const Index = lazyLoader(() => import('@/pages/Index'));
const Blog = lazyLoader(() => import('@/pages/Blog'));
const BlogPost = lazyLoader(() => import('@/pages/BlogPost'));
const About = lazyLoader(() => import('@/pages/About'));
const Contact = lazyLoader(() => import('@/pages/Contact'));
const Auth = lazyLoader(() => import('@/pages/Auth'));
const AdminDashboard = lazyLoader(() => import('@/pages/AdminDashboard'));
const CreatePost = lazyLoader(() => import('@/pages/CreatePost'));
const CareerTools = lazyLoader(() => import('@/pages/CareerTools'));
const ResumeAnalyzerPage = lazyLoader(() => import('@/pages/tools/ResumeAnalyzerPage'));
const Resources = lazyLoader(() => import('@/pages/Resources'));
const Newsletter = lazyLoader(() => import('@/pages/Newsletter'));
const NotFound = lazyLoader(() => import('@/pages/NotFound'));
const Terms = lazyLoader(() => import('@/pages/Terms'));
const Privacy = lazyLoader(() => import('@/pages/Privacy'));
const Cookies = lazyLoader(() => import('@/pages/Cookies'));
const RSSPage = lazyLoader(() => import('@/pages/RSSPage'));
const BootstrapAdmin = lazyLoader(() => import('@/pages/BootstrapAdmin'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <GamificationProvider>
              <ToastProvider>
                <Router>
                  <ComponentPreloader />
                  <div className="min-h-screen w-full">
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/create-post" element={<CreatePost />} />
                        <Route path="/tools" element={<CareerTools />} />
                        <Route path="/tools/resume-analyzer" element={<ResumeAnalyzerPage />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/newsletter" element={<Newsletter />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/cookies" element={<Cookies />} />
                        <Route path="/rss" element={<RSSPage />} />
                        <Route path="/bootstrap-admin" element={<BootstrapAdmin />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </div>
                  <Toaster />
                </Router>
              </ToastProvider>
            </GamificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
