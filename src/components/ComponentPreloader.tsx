/**
 * Component preloader for optimizing perceived performance
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Preload functions for different routes
const preloadRouteComponents = {
  '/admin': () => {
    import('@/pages/AdminDashboard');
    import('@/components/VirtualizedBlogList');
  },
  '/create-post': () => {
    import('@/pages/CreatePost');
    import('@/components/ImageUpload');
  },
  '/post': () => {
    import('@/pages/BlogPost');
    import('@/components/Comments');
  },
  '/': () => {
    // Preload frequently accessed components
    import('@/components/FeaturedPosts');
    import('@/components/BlogCard');
  }
};

// Mouse/touch position tracking for predictive preloading
let lastMousePosition = { x: 0, y: 0 };
let mouseVelocity = { x: 0, y: 0 };

const ComponentPreloader = () => {
  const location = useLocation();

  // Predictive preloading based on user behavior
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentPosition = { x: e.clientX, y: e.clientY };
      
      // Calculate velocity
      mouseVelocity = {
        x: currentPosition.x - lastMousePosition.x,
        y: currentPosition.y - lastMousePosition.y
      };
      
      lastMousePosition = currentPosition;
    };

    const handleLinkHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        const href = new URL(link.href).pathname;
        
        // Preload components based on hovered link
        if (href.startsWith('/admin')) {
          preloadRouteComponents['/admin']?.();
        } else if (href.startsWith('/create-post')) {
          preloadRouteComponents['/create-post']?.();
        } else if (href.startsWith('/post/')) {
          preloadRouteComponents['/post']?.();
        }
      }
    };

    // Add event listeners with passive flag for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleLinkHover, { passive: true });
    document.addEventListener('focus', handleLinkHover, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleLinkHover);
      document.removeEventListener('focus', handleLinkHover);
    };
  }, []);

  // Route-based preloading
  useEffect(() => {
    const currentRoute = location.pathname;
    
    // Preload components for current route
    Object.entries(preloadRouteComponents).forEach(([route, preloadFn]) => {
      if (currentRoute.startsWith(route) || currentRoute === route) {
        // Use requestIdleCallback to avoid blocking main thread
        if ('requestIdleCallback' in window) {
          requestIdleCallback(preloadFn, { timeout: 3000 });
        } else {
          setTimeout(preloadFn, 100);
        }
      }
    });

    // Preload next likely routes based on current route
    if (currentRoute === '/') {
      // From home, users often go to blog posts or about
      setTimeout(() => {
        import('@/pages/About');
        import('@/pages/BlogPost');
      }, 2000);
    } else if (currentRoute === '/auth') {
      // After auth, users might go to admin or create posts
      setTimeout(() => {
        import('@/pages/AdminDashboard');
        import('@/pages/CreatePost');
      }, 1000);
    }
  }, [location.pathname]);

  // Preload based on user interaction patterns
  useEffect(() => {
    const preloadOnIdle = () => {
      // Preload less critical components during idle time
      const idlePreloads = [
        () => import('@/pages/Privacy'),
        () => import('@/pages/Terms'),
        () => import('@/pages/Cookies'),
        () => import('@/pages/Newsletter'),
        () => import('@/pages/RSSPage'),
      ];

      idlePreloads.forEach((preload, index) => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(preload, { timeout: 5000 + index * 1000 });
        } else {
          setTimeout(preload, 3000 + index * 500);
        }
      });
    };

    // Start idle preloading after initial page load
    const timer = setTimeout(preloadOnIdle, 3000);
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

export default ComponentPreloader;
