import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BlogCard from '@/components/BlogCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const defaultProps = {
  title: 'Test Blog Post',
  excerpt: 'This is a test excerpt for the blog post',
  readTime: '5 min',
  difficulty: 'Beginner' as const,
  tags: ['React', 'TypeScript'],
  date: '2024-01-01',
  slug: 'test-blog-post',
};

const renderBlogCard = (props = {}) => {
  return render(
    <BrowserRouter>
      <BlogCard {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('BlogCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders blog card with all basic information', () => {
    renderBlogCard();

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test excerpt for the blog post')).toBeInTheDocument();
    expect(screen.getByText('5 min')).toBeInTheDocument(); // Updated to match actual text
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('#React')).toBeInTheDocument(); // Updated to match actual text with #
    expect(screen.getByText('#TypeScript')).toBeInTheDocument(); // Updated to match actual text with #
    expect(screen.getByText('1/1/2024')).toBeInTheDocument();
  });

  it('applies correct difficulty styling', () => {
    const { rerender } = renderBlogCard();

    expect(screen.getByText('Beginner')).toHaveClass('bg-green-500/20', 'text-green-400');

    rerender(
      <BrowserRouter>
        <BlogCard {...defaultProps} difficulty="Intermediate" />
      </BrowserRouter>
    );
    expect(screen.getByText('Intermediate')).toHaveClass('bg-yellow-500/20', 'text-yellow-400');

    rerender(
      <BrowserRouter>
        <BlogCard {...defaultProps} difficulty="Advanced" />
      </BrowserRouter>
    );
    expect(screen.getByText('Advanced')).toHaveClass('bg-red-500/20', 'text-red-400');
  });

  it('navigates to post when clicked', async () => {
    const user = userEvent.setup();
    renderBlogCard();

    const article = screen.getByRole('button', { name: /Read article: Test Blog Post/i });
    await user.click(article);

    expect(mockNavigate).toHaveBeenCalledWith('/post/test-blog-post');
  });

  it('does not navigate when slug is missing', async () => {
    const user = userEvent.setup();
    renderBlogCard({ slug: undefined });

    const article = screen.getByRole('button', { name: /Read article: Test Blog Post/i });
    await user.click(article);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows progress ring when article is read', () => {
    renderBlogCard({ isRead: true, progress: 75 });

    // Check for progress bar with correct width style
    const progressBar = document.querySelector('.h-full.bg-primary');
    expect(progressBar).toHaveStyle('width: 100%'); // isRead shows 100% regardless of progress value

    // Check for "Read" indicator text
    expect(screen.getByText('Read')).toBeInTheDocument();
  });

  it('does not show progress ring when article is not read', () => {
    renderBlogCard({ isRead: false, progress: 75 });

    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  it('handles hover states correctly', async () => {
    const user = userEvent.setup();
    renderBlogCard();

    const article = screen.getByRole('button', { name: /Read article: Test Blog Post/i });

    await user.hover(article);
    expect(article).toHaveClass('glow');

    await user.unhover(article);
    expect(article).not.toHaveClass('glow');
  });

  it('renders all tags correctly', () => {
    const props = {
      ...defaultProps,
      tags: ['React', 'TypeScript', 'Vite', 'Testing'],
    };
    renderBlogCard(props);

    // Only first 3 tags are shown, with a "+1 more" indicator for the rest
    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();
    expect(screen.getByText('#Vite')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();

    // The 4th tag should not be visible
    expect(screen.queryByText('#Testing')).not.toBeInTheDocument();
  });

  it('renders with minimal props', () => {
    const minimalProps = {
      title: 'Minimal Post',
      excerpt: 'Minimal excerpt',
      readTime: '2 min',
      difficulty: 'Beginner' as const,
      tags: [],
      date: '2024-01-01',
    };

    render(
      <BrowserRouter>
        <BlogCard {...minimalProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Minimal Post')).toBeInTheDocument();
  });
});
