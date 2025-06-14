
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Button } from '../button';

describe('Button Component', () => {
  it('should render a button with default props', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('should render a button with a custom class', () => {
    render(<Button className="custom-class">Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toHaveClass('custom-class');
  });

  it('should render a button with a variant', () => {
    render(<Button variant="secondary">Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('should render a button with a size', () => {
    render(<Button size="lg">Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('should render a disabled button', () => {
    render(<Button disabled>Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeDisabled();
  });
});
