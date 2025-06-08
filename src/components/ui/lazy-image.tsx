import { useState, useEffect, useRef } from 'react'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  placeholder?: string
  className?: string
  alt: string
  onLoad?: () => void
  onError?: () => void
}

export const LazyImage = ({ 
  src, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  className = '',
  alt,
  onLoad,
  onError,
  ...props 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const currentRef = imgRef.current
    if (!currentRef) return

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    observerRef.current.observe(currentRef)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  )
}

// Hook for preloading critical images
export const useImagePreloader = (imageSources: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const preloadPromises = imageSources.map((src) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = () => reject(src)
        img.src = src
      })
    })

    Promise.allSettled(preloadPromises).then((results) => {
      const loaded = new Set<string>()
      const failed = new Set<string>()

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loaded.add(result.value)
        } else {
          failed.add(imageSources[index])
        }
      })

      setLoadedImages(loaded)
      setFailedImages(failed)
    })
  }, [imageSources])

  return { loadedImages, failedImages }
}

// Utility for responsive image srcsets
export const generateSrcSet = (basePath: string, sizes: number[] = [400, 800, 1200, 1600]) => {
  return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ')
}

// Hook for adaptive image quality based on connection
export const useAdaptiveImageQuality = () => {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high')

  useEffect(() => {
    // @ts-ignore - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

    if (connection) {
      const updateQuality = () => {
        switch (connection.effectiveType) {
          case 'slow-2g':
          case '2g':
            setQuality('low')
            break
          case '3g':
            setQuality('medium')
            break
          case '4g':
          default:
            setQuality('high')
            break
        }
      }

      updateQuality()
      connection.addEventListener('change', updateQuality)

      return () => {
        connection.removeEventListener('change', updateQuality)
      }
    }
  }, [])

  return quality
}
