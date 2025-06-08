/**
 * Test data fixtures for e2e tests
 */

export const TestUser = {
  VALID_USER: {
    email: 'test@quantumreadflow.com',
    password: 'TestPassword123!',
    name: 'Test User',
  },
  ADMIN_USER: {
    email: 'admin@quantumreadflow.com',
    password: 'AdminPassword123!',
    name: 'Admin User',
  },
  INVALID_USER: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

export const TestBlogPost = {
  SAMPLE_POST: {
    title: 'Test Blog Post',
    content: 'This is a test blog post content for e2e testing.',
    excerpt: 'Test excerpt for the blog post',
    tags: ['test', 'e2e', 'automation'],
    category: 'Technology',
  },
  LONG_POST: {
    title: 'Very Long Test Blog Post with Extended Content',
    content: `
      This is a very long test blog post that will be used to test
      various features like pagination, virtual scrolling, and performance.
      
      ## Section 1
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
      
      ## Section 2
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
      ut aliquip ex ea commodo consequat.
      
      ## Section 3
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur.
    `,
    excerpt: 'A comprehensive test post for performance testing',
    tags: ['performance', 'test', 'long-content'],
    category: 'Testing',
  },
};

export const TestComment = {
  POSITIVE_COMMENT: {
    content: 'Great article! Very informative and well-written.',
    author: 'Positive Reader',
  },
  NEGATIVE_COMMENT: {
    content: 'I disagree with some points mentioned in this article.',
    author: 'Critical Reader',
  },
};

export const TestSearch = {
  POPULAR_TERMS: ['technology', 'javascript', 'react', 'ai', 'web development'],
  NO_RESULTS_TERM: 'xyznonexistentterm123',
  SPECIAL_CHARS: ['@#$%', 'test & more', 'quotes "test"'],
};

export const TestFilters = {
  DATE_RANGES: {
    LAST_WEEK: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    LAST_MONTH: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  },
  AUTHORS: ['John Doe', 'Jane Smith', 'Tech Writer'],
  CATEGORIES: ['Technology', 'Science', 'Business', 'Lifestyle'],
  TAGS: ['react', 'javascript', 'ai', 'machine-learning', 'web-dev'],
};
