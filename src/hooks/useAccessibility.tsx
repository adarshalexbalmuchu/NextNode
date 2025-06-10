import { useEffect, useRef } from 'react';

/**
 * Hook for managing focus and announcing content changes to screen readers
 */
export const useAccessibility = () => {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
      
      // Clear after announcement to allow for repeated messages
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const AnnouncementRegion = () => (
    <div
      ref={announceRef}
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    />
  );

  return {
    announce,
    focusElement,
    AnnouncementRegion
  };
};

/**
 * Hook for managing keyboard navigation in complex components
 */
export const useKeyboardNavigation = (items: HTMLElement[], options?: {
  loop?: boolean;
  orientation?: 'horizontal' | 'vertical';
}) => {
  const { loop = true, orientation = 'vertical' } = options || {};

  const handleKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (event.key) {
      case nextKey:
        event.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (loop ? 0 : currentIndex);
        items[nextIndex]?.focus();
        break;

      case prevKey:
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : (loop ? items.length - 1 : currentIndex);
        items[prevIndex]?.focus();
        break;

      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;

      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        (items[currentIndex] as HTMLElement)?.click();
        break;
    }
  };

  return { handleKeyDown };
};

/**
 * Component for skip links to improve keyboard navigation
 */
export const SkipLinks = () => {
  return (
    <div className="sr-only focus:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-2"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="fixed top-16 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-2"
      >
        Skip to navigation
      </a>
    </div>
  );
};
