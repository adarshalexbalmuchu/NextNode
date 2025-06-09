/**
 * Critical resource optimizer for first paint optimization
 */

// Critical CSS that should be inlined
export const criticalCSS = `
  /* Critical above-the-fold styles */
  body {
    margin: 0;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Hero section critical styles */
  .hero-critical {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  /* Navigation critical styles */
  .nav-critical {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.8);
  }
  
  /* Loading states */
  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* Fade in animation for critical content */
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
    opacity: 0;
  }
  
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }
`;

// Preload critical images
export const criticalImages = [
  // Add any hero/above-fold images here
  // '/hero-bg.webp',
  // '/logo.svg'
];

// Preload critical fonts
export const criticalFonts = [
  // Add critical font URLs if using custom fonts
  // 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Initialize critical resource loading
export const initCriticalResources = () => {
  // Inline critical CSS
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }
  
  // Preload critical images
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
  
  // Preload critical fonts
  criticalFonts.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'style';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Optimize images with responsive loading
export const createResponsiveImage = (
  src: string,
  alt: string,
  sizes: string[] = ['400w', '800w', '1200w']
) => {
  const srcSet = sizes.map(size => {
    const width = size.replace('w', '');
    return `${src}?w=${width} ${size}`;
  }).join(', ');
  
  return {
    src,
    srcSet,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const
  };
};

// Web font optimization
export const optimizeWebFonts = () => {
  // Use font-display: swap for better performance
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Inter Regular'), local('Inter-Regular');
    }
  `;
  document.head.appendChild(style);
};
