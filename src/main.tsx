
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use concurrent features for better performance
const root = createRoot(document.getElementById('root')!, {
  // Enable concurrent features
  identifierPrefix: 'nextnode-',
});

root.render(<App />);
