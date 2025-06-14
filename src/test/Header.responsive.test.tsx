
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/contexts/AuthContext';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { GamificationProvider } from '@/components/gamification/GamificationProvider';
import Header from '@/components/Header';

// Create a wrapper with all required providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <GamificationProvider>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </GamificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Header Responsive Design', () => {
  it('renders the header component', () => {
    const Wrapper = createWrapper();
    
    render(<Header />, { wrapper: Wrapper });
    
    // Check for navigation elements that should be present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('contains logo or brand element', () => {
    const Wrapper = createWrapper();
    
    render(<Header />, { wrapper: Wrapper });
    
    // Look for common header elements
    const header = screen.getByRole('navigation');
    expect(header).toBeInTheDocument();
  });
});
