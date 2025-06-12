import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Temporarily disable performance optimizations for debugging
// import { initCriticalResources } from './utils/criticalResourceOptimizer'
// import { initPerformanceOptimizations } from './utils/performanceOptimizer'

// Initialize critical resources before React renders
// initCriticalResources();

// Initialize comprehensive performance optimizations
// initPerformanceOptimizations();

// Use concurrent features for better performance
const root = createRoot(document.getElementById('root')!, {
  // Enable concurrent features
  identifierPrefix: 'nextnode-',
});

root.render(<App />);
