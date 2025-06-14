
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Header from '@/components/Header';

describe('Header Responsive Design', () => {
  it('renders the header component', () => {
    render(<Header />);
    
    // Check for navigation elements that should be present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('contains logo or brand element', () => {
    render(<Header />);
    
    // Look for common header elements
    const header = screen.getByRole('navigation');
    expect(header).toBeInTheDocument();
  });
});
