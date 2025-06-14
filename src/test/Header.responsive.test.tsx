
import { describe, beforeEach, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '@/components/Header';

// Mock the useAuth hook
const mockUseAuth = {
  user: null,
  hasRole: () => false,
  logout: () => Promise.resolve(),
};

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render Header with Router
const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Responsive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset viewport to desktop size
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
    window.dispatchEvent(new Event('resize'));
  });

  test('renders navigation links on desktop', () => {
    renderHeader();
    
    // Check for main navigation links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('shows mobile menu button on small screens', () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });
    window.dispatchEvent(new Event('resize'));
    
    renderHeader();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('navigation links are accessible on desktop', () => {
    renderHeader();
    
    // Check navigation links have proper href attributes
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blog');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
  });

  test('header has proper semantic structure', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  test('logo/brand link navigates to home', () => {
    renderHeader();
    
    const logoLink = screen.getByText('NextNode').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
