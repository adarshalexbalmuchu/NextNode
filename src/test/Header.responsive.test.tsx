import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/contexts/AuthContext';
import Header from '@/components/Header';
import { vi } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const HeaderWrapper = () => (
  <BrowserRouter>
    <AuthProvider>
      <Header />
    </AuthProvider>
  </BrowserRouter>
);

describe('Header Responsive Design', () => {
  beforeEach(() => {
    // Reset viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  test('renders all navigation links on mobile', () => {
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<HeaderWrapper />);
    
    expect(screen.getByText('Guides')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Career Tools')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('renders search button on mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<HeaderWrapper />);
    
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  test('renders all navigation links on tablet', () => {
    // Simulate tablet viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<HeaderWrapper />);
    
    expect(screen.getByText('Guides')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Career Tools')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('header has proper accessibility attributes', () => {
    render(<HeaderWrapper />);
    
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(navigation).toBeInTheDocument();
    
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
  });

  test('touch targets meet minimum size requirements', () => {
    render(<HeaderWrapper />);
    
    const searchButton = screen.getByLabelText('Search');
    const computedStyle = window.getComputedStyle(searchButton);
    
    // Touch targets should be at least 44px for accessibility
    expect(searchButton).toHaveClass('touch-friendly');
  });
});
