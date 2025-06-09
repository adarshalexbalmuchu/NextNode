/**
 * Performance optimization utilities
 */

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
