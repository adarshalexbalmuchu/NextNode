/**
 * Performance optimization utilities for NextNode platform
 * Implements critical performance improvements for faster loading
 */

import { startTransition } from 'react';

// Debounce function for expensive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for scroll/resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Schedule work during idle time
export const scheduleWork = (callback: () => void, timeout = 5000) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 0);
  }
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;
  
  // Throttle warnings to prevent spam
  let lastWarning = 0;
  const warningCooldown = 10000; // 10 seconds between warnings
  
  const warnIfCooldownExpired = (message: string) => {
    const now = Date.now();
    if (now - lastWarning > warningCooldown) {
      console.warn(message);
      lastWarning = now;
    }
  };
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming;
        const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
        
        if (loadTime > 3000) {
          warnIfCooldownExpired(`🐌 Slow page load: ${Math.round(loadTime)}ms (budget: 3000ms)`);
        }
      }
      
      if (entry.entryType === 'largest-contentful-paint') {
        const lcp = entry.startTime;
        if (lcp > 2500) {
          warnIfCooldownExpired(`🐌 Poor LCP: ${Math.round(lcp)}ms (budget: 2500ms)`);
        }
      }
      
      if (entry.entryType === 'first-input') {
        const fid = (entry as any).processingStart - entry.startTime;
        if (fid > 100) {
          warnIfCooldownExpired(`🐌 Poor FID: ${Math.round(fid)}ms (budget: 100ms)`);
        }
      }
    }
  });
  
  try {
    observer.observe({ 
      entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] 
    });
  } catch (e) {
    // Silently handle unsupported performance observer
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
    const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
    
    if (usedMB > 50) { // 50MB threshold
      console.warn(`🧠 High memory usage: ${usedMB}MB / ${totalMB}MB`);
    }
    
    return { usedMB, totalMB };
  }
  return null;
};

// Bundle size analyzer
export const logBundleInfo = () => {
  if (typeof window !== 'undefined' && 'performance' in window && process.env.NODE_ENV === 'development') {
    // Only run once per session
    const sessionKey = 'bundle-analyzed';
    if (sessionStorage.getItem(sessionKey)) return;
    
    // Use requestIdleCallback to avoid blocking main thread
    const analyzeBundle = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => 
        r.name.includes('.js') && 
        !r.name.includes('node_modules') &&
        r.transferSize > 0
      );
      
      let totalJSSize = 0;
      const largeFiles: Array<{name: string, size: number}> = [];
      
      jsResources.forEach(resource => {
        if (resource.transferSize) {
          totalJSSize += resource.transferSize;
          
          // Track files larger than 500KB
          if (resource.transferSize > 500000) {
            largeFiles.push({
              name: resource.name.split('/').pop() || resource.name,
              size: resource.transferSize
            });
          }
        }
      });
      
      const totalMB = (totalJSSize / 1048576).toFixed(2);
      
      if (totalJSSize > 1048576) { // 1MB threshold
        console.warn(`📦 Large bundle size: ${totalMB}MB (budget: 1MB)`);
        
        if (largeFiles.length > 0) {
          console.group('💡 Large files detected:');
          largeFiles.forEach(file => {
            console.log(`${file.name}: ${(file.size / 1048576).toFixed(2)}MB`);
          });
          console.log('Consider code splitting or removing unused dependencies');
          console.groupEnd();
        }
      } else {
        console.log(`📦 Bundle size: ${totalMB}MB ✅`);
      }
      
      // Mark as analyzed for this session
      sessionStorage.setItem(sessionKey, 'true');
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(analyzeBundle, { timeout: 5000 });
    } else {
      setTimeout(analyzeBundle, 3000);
    }
  }
};

// Critical resource prioritization
export const initPerformanceOptimizations = () => {
  // Preload critical resources
  preloadCriticalResources();
  
  // Initialize service worker for caching
  initServiceWorker();
  
  // Setup performance monitoring
  initPerformanceMonitoring();
  
  // Optimize images loading
  initImageOptimizations();
  
  // Setup connection optimizations
  initConnectionOptimizations();
};

// Preload critical resources
const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap';
  fontPreload.as = 'style';
  fontPreload.onload = () => {
    fontPreload.rel = 'stylesheet';
  };
  document.head.appendChild(fontPreload);
  
  // Preconnect to critical domains
  const domains = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Service Worker initialization
const initServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Performance monitoring
const initPerformanceMonitoring = () => {
  // Monitor Core Web Vitals using native Performance API
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Monitor Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    
    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // Fallback for browsers that don't support LCP
      console.log('LCP monitoring not supported');
    }
    
    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    
    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.log('FID monitoring not supported');
    }
  }
  
  // Monitor bundle loading times
  if (typeof PerformanceObserver !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`${entry.name}: ${entry.duration}ms`);
        }
      });
    });
    observer.observe({ entryTypes: ['measure'] });
  }
};

// Enhanced image optimization
const initImageOptimizations = () => {
  // Lazy load images using Intersection Observer
  if (typeof IntersectionObserver !== 'undefined') {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Connection optimizations
const initConnectionOptimizations = () => {
  // Prefetch likely next pages
  const prefetchLinks = ['/blog', '/about', '/contact'];
  
  prefetchLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  });
};

// Bundle optimization utilities
export const optimizeBundle = {
  // Dynamic imports with error handling
  dynamicImport: async <T>(importFunc: () => Promise<T>): Promise<T> => {
    try {
      return await importFunc();
    } catch (error) {
      console.error('Dynamic import failed:', error);
      throw error;
    }
  },
  
  // Preload modules
  preloadModule: (moduleId: string) => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = moduleId;
    document.head.appendChild(link);
  }
};

// CSS optimization
export const optimizeCSS = {
  // Inline critical CSS
  inlineCriticalCSS: (css: string) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },
  
  // Load non-critical CSS asynchronously
  loadNonCriticalCSS: (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'style';
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  }
};

// React performance utilities
export const reactOptimizations = {
  // Wrap state updates in transitions
  transitionUpdate: (updateFunc: () => void) => {
    startTransition(() => {
      updateFunc();
    });
  },
  
  // Batch DOM updates
  batchUpdates: (updates: (() => void)[]) => {
    startTransition(() => {
      updates.forEach(update => update());
    });
  }
};
