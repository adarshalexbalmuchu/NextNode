
import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  name: string
  duration: number
  timestamp: number
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = useRef<number>()
  const metricsRef = useRef<PerformanceMetrics[]>([])

  useEffect(() => {
    startTimeRef.current = performance.now()

    return () => {
      if (startTimeRef.current) {
        const duration = performance.now() - startTimeRef.current
        const metric: PerformanceMetrics = {
          name: componentName,
          duration,
          timestamp: Date.now()
        }
        
        metricsRef.current.push(metric)
        
        // Log slow components (> 100ms)
        if (duration > 100) {
          console.warn(`Slow component detected: ${componentName} took ${duration.toFixed(2)}ms`)
        }
        
        // Report to performance monitoring service (if available)
        if (typeof window !== 'undefined' && 'gtag' in window) {
          // @ts-ignore
          window.gtag('event', 'timing_complete', {
            name: componentName,
            value: Math.round(duration)
          })
        }
      }
    }
  }, [componentName])

  const getMetrics = () => metricsRef.current

  return { getMetrics }
}

// Web Vitals monitoring
export const initWebVitals = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return

  // Debounce console warnings to avoid spam
  let lcpWarned = false;
  let fidWarned = false;

  // Monitor LCP (Largest Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        const lcpTime = entry.startTime;
        
        // Only warn once and if LCP is significantly high
        if (lcpTime > 2500 && !lcpWarned) {
          console.warn(`⚠️ Poor LCP: ${Math.round(lcpTime)}ms (should be ≤ 2500ms)`);
          lcpWarned = true;
        }
      }
      if (entry.entryType === 'first-input') {
        const fid = (entry as any).processingStart - entry.startTime;
        
        // Only warn once and if FID is significantly high
        if (fid > 100 && !fidWarned) {
          console.warn(`⚠️ Poor FID: ${Math.round(fid)}ms (should be ≤ 100ms)`);
          fidWarned = true;
        }
      }
    }
  })

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
  } catch (e) {
    // Observer not supported
  }

  // Monitor CLS (Cumulative Layout Shift)
  let cumulativeLayoutShiftScore = 0
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        cumulativeLayoutShiftScore += (entry as any).value
      }
    }
  })

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  } catch (e) {
    // Observer not supported
  }

  // Report metrics periodically
  setInterval(() => {
    if (cumulativeLayoutShiftScore > 0.1) {
      console.warn('High CLS detected:', cumulativeLayoutShiftScore)
    }
  }, 5000)
}
