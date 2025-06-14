
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
import { createLazyComponent } from '@/utils/lazyLoader';

const Index = createLazyComponent(() => import('@/pages/Index'));
const Blog = createLazyComponent(() => import('@/pages/Blog'));
const BlogPost = createLazyComponent(() => import('@/pages/BlogPost'));
const About = createLazyComponent(() => import('@/pages/About'));
const Contact = createLazyComponent(() => import('@/pages/Contact'));
const Auth = createLazyComponent(() => import('@/pages/Auth'));
const AdminDashboard = createLazyComponent(() => import('@/pages/AdminDashboard'));
const CreatePost = createLazyComponent(() => import('@/pages/CreatePost'));
const CareerTools = createLazyComponent(() => import('@/pages/CareerTools'));
const ResumeAnalyzerPage = createLazyComponent(() => import('@/pages/tools/ResumeAnalyzerPage'));
const Resources = createLazyComponent(() => import('@/pages/Resources'));
const Newsletter = createLazyComponent(() => import('@/pages/Newsletter'));
const NotFound = createLazyComponent(() => import('@/pages/NotFound'));
const Terms = createLazyComponent(() => import('@/pages/Terms'));
const Privacy = createLazyComponent(() => import('@/pages/Privacy'));
const Cookies = createLazyComponent(() => import('@/pages/Cookies'));
const RSSPage = createLazyComponent(() => import('@/pages/RSSPage'));
const BootstrapAdmin = createLazyComponent(() => import('@/pages/BootstrapAdmin'));

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
