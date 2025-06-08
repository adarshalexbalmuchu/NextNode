
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
  if (typeof window === 'undefined') return

  // Monitor LCP (Largest Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime)
      }
      if (entry.entryType === 'first-input') {
        console.log('FID:', (entry as any).processingStart - entry.startTime)
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
