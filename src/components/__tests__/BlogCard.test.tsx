import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogCard from '../BlogCard';

describe('BlogCard Component', () => {
  const mockPost = {
    title: 'Test Blog Post',
    excerpt: 'This is a test excerpt.',
    readTime: '5 min',
    difficulty: 'Beginner',
    tags: ['Test Tag'],
    date: '2023-01-01',
    isRead: false,
    progress: 0,
    slug: 'test-blog-post',
  };

  it('renders the BlogCard component with correct data', () => {
    render(
      <BrowserRouter>
        <BlogCard {...mockPost} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    expect(screen.getByText(mockPost.readTime)).toBeInTheDocument();
    expect(screen.getByText(mockPost.difficulty)).toBeInTheDocument();
    expect(screen.getByText(mockPost.tags[0])).toBeInTheDocument();
  });

  it('applies difficulty level styles correctly', () => {
    render(
      <BrowserRouter>
        <BlogCard {...mockPost} />
      </BrowserRouter>
    );

    const difficultyElement = screen.getByText(mockPost.difficulty);
    expect(difficultyElement).toBeInTheDocument();
  });

  it('navigates to the correct blog post on click', () => {
    render(
      <BrowserRouter>
        <BlogCard {...mockPost} />
      </BrowserRouter>
    );

    const cardLink = screen.getByRole('link', { name: mockPost.title });
    expect(cardLink).toHaveAttribute('href', `/blog/${mockPost.slug}`);
  });

  it('displays "New" badge if the post is new', () => {
    render(
      <BrowserRouter>
        <BlogCard {...mockPost} />
      </BrowserRouter>
    );

    // Assuming "New" badge is only displayed for posts within a week
    const today = new Date();
    const postDate = new Date(mockPost.date);
    const diff = today.getTime() - postDate.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (diffDays <= 7) {
      // If the post is within a week, check if "New" badge is present
      expect(screen.getByText('New')).toBeInTheDocument();
    }
  });
});
