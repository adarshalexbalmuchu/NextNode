/**
 * Content Security Policy configuration for Quantum Read Flow
 * This helps prevent XSS attacks and other security vulnerabilities
 */

export const CSP_DIRECTIVES = {
  // Default source for all resource types
  'default-src': ["'self'"],
  
  // Script sources
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Needed for Vite in development
    "'unsafe-eval'", // Needed for development hot reload
    'https://cdn.jsdelivr.net', // For CDN scripts
    'https://unpkg.com', // For unpkg scripts
    'https://www.googletagmanager.com', // Google Analytics
    'https://www.google-analytics.com',
  ],
  
  // Stylesheet sources
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Needed for CSS-in-JS and styled components
    'https://fonts.googleapis.com',
    'https://cdn.jsdelivr.net',
  ],
  
  // Font sources
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net',
    'data:', // For inline fonts
  ],
  
  // Image sources
  'img-src': [
    "'self'",
    'data:', // For inline images (base64)
    'blob:', // For dynamically generated images
    'https:', // Allow HTTPS images
    'https://images.unsplash.com', // For stock photos
    'https://via.placeholder.com', // For placeholder images
    'https://avatars.githubusercontent.com', // For GitHub avatars
  ],
  
  // Media sources (audio/video)
  'media-src': [
    "'self'",
    'https:', // Allow HTTPS media
    'blob:', // For generated media
  ],
  
  // Object sources (deprecated but included for compatibility)
  'object-src': ["'none'"],
  
  // Frame sources
  'frame-src': [
    "'self'",
    'https://www.youtube.com', // For embedded videos
    'https://player.vimeo.com',
    'https://www.google.com', // For reCAPTCHA
  ],
  
  // Connect sources (AJAX, WebSocket, EventSource)
  'connect-src': [
    "'self'",
    'https://api.github.com', // For GitHub API
    'https://*.supabase.co', // For Supabase
    'https://*.supabase.in', // For Supabase
    'wss://*.supabase.co', // For Supabase WebSocket
    'wss://*.supabase.in', // For Supabase WebSocket
    'https://www.google-analytics.com', // Google Analytics
    'https://region1.analytics.google.com',
    'ws://localhost:*', // For development WebSocket
    'http://localhost:*', // For development API calls
  ],
  
  // Worker sources
  'worker-src': [
    "'self'",
    'blob:', // For service workers
  ],
  
  // Child sources (deprecated but included for compatibility)
  'child-src': [
    "'self'",
    'blob:',
  ],
  
  // Manifest sources
  'manifest-src': ["'self'"],
  
  // Base URI
  'base-uri': ["'self'"],
  
  // Form action
  'form-action': [
    "'self'",
    'https://formspree.io', // For contact forms
  ],
  
  // Frame ancestors (who can embed this site)
  'frame-ancestors': ["'none'"], // Prevent clickjacking
  
  // Upgrade insecure requests in production
  'upgrade-insecure-requests': [],
  
  // Block mixed content
  'block-all-mixed-content': [],
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(isDevelopment = false): string {
  const directives = { ...CSP_DIRECTIVES };
  
  if (isDevelopment) {
    // Relax CSP for development
    directives['script-src'].push('http://localhost:*');
    directives['connect-src'].push('http://localhost:*');
    directives['style-src'].push('http://localhost:*');
    
    // Remove upgrade-insecure-requests in development
    delete directives['upgrade-insecure-requests'];
    delete directives['block-all-mixed-content'];
  }
  
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Express middleware for setting CSP header
 */
export function cspMiddleware(isDevelopment = false) {
  const cspHeader = generateCSPHeader(isDevelopment);
  
  return (req: any, res: any, next: any) => {
    res.setHeader('Content-Security-Policy', cspHeader);
    next();
  };
}

/**
 * Vite plugin to add CSP header in development
 */
export function viteCspPlugin(isDevelopment = true) {
  const cspHeader = generateCSPHeader(isDevelopment);
  
  return {
    name: 'csp-header',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url?.endsWith('.html')) {
          res.setHeader('Content-Security-Policy', cspHeader);
        }
        next();
      });
    },
  };
}

// Example CSP for different environments
export const CSP_CONFIGS = {
  development: generateCSPHeader(true),
  production: generateCSPHeader(false),
  strict: generateCSPHeader(false).replace(/'unsafe-inline'/g, '').replace(/'unsafe-eval'/g, ''),
};

// Report-only CSP for testing
export function generateReportOnlyCSP(reportUri: string): string {
  const baseCSP = generateCSPHeader(false);
  return `${baseCSP}; report-uri ${reportUri}`;
}
