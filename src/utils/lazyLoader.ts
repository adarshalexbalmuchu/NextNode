/**
 * Lazy loading utilities for performance optimization
 */
import { lazy, LazyExoticComponent, ComponentType } from 'react';

// Generic lazy loader with error boundary
export const createLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ComponentType
): LazyExoticComponent<T> => {
  return lazy(async () => {
    try {
      const module = await importFunc();
      return module;
    } catch (error) {
      console.error('Failed to load component:', error);
      // Return fallback or error component
      if (fallback) {
        return { default: fallback as T };
      }
      throw error;
    }
  });
};

// Preload a component for better UX
export const preloadComponent = (importFunc: () => Promise<any>) => {
  // Start loading the component
  const componentPromise = importFunc();
  
  // Don't block, just cache the promise
  componentPromise.catch((error) => {
    console.warn('Failed to preload component:', error);
  });
  
  return componentPromise;
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }
  
  // Fallback for browsers without IntersectionObserver
  return null;
};

// Lazy load images with proper fallbacks
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  options: {
    placeholder?: string;
    onLoad?: () => void;
    onError?: () => void;
  } = {}
) => {
  const { placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', onLoad, onError } = options;
  
  // Set placeholder immediately
  img.src = placeholder;
  
  // Create new image to test loading
  const imageLoader = new Image();
  
  imageLoader.onload = () => {
    img.src = src;
    img.classList.add('loaded');
    onLoad?.();
  };
  
  imageLoader.onerror = () => {
    console.warn(`Failed to load image: ${src}`);
    onError?.();
  };
  
  // Start loading
  imageLoader.src = src;
};

// Resource hints for better performance
export const addResourceHint = (
  href: string, 
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch',
  options: Partial<{
    as: string;
    type: string;
    crossorigin: string;
  }> = {}
) => {
  // Don't add duplicates
  if (document.querySelector(`link[href="${href}"][rel="${rel}"]`)) {
    return;
  }
  
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  
  if (options.as) link.setAttribute('as', options.as);
  if (options.type) link.setAttribute('type', options.type);
  if (options.crossorigin) link.setAttribute('crossorigin', options.crossorigin);
  
  document.head.appendChild(link);
};

// Critical CSS inliner (for build process)
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  
  // Insert before any existing stylesheets
  const firstLink = document.querySelector('link[rel="stylesheet"]');
  if (firstLink) {
    document.head.insertBefore(style, firstLink);
  } else {
    document.head.appendChild(style);
  }
};
