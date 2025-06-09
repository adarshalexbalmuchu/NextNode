import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initCriticalResources } from './utils/criticalResourceOptimizer'

// Initialize critical resources before React renders
initCriticalResources();

// Use concurrent features for better performance
const root = createRoot(document.getElementById("root")!, {
  // Enable concurrent features
  identifierPrefix: 'quantum-read-'
});

root.render(<App />);
