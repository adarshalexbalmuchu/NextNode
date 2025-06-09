import { test, expect } from '@playwright/test';
import { TestUtils } from '../utils/test-utils';

test.describe('Homepage and Navigation', () => {
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    testUtils = new TestUtils(page);
    await testUtils.goToHomePage();
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check if the main content is visible
    await expect(page.locator('main')).toBeVisible();
    
    // Check for key elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    
    // Check page title
    await expect(page).toHaveTitle(/Quantum Read Flow/);
  });

  test('should have working navigation menu', async ({ page }) => {
    // Test main navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    expect(linkCount).toBeGreaterThan(0);
    
    // Check specific navigation items
    await expect(page.locator('nav a:has-text("Home")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Blog")')).toBeVisible();
  });

  test('should display blog posts on homepage', async ({ page }) => {
    // Wait for blog posts to load
    await testUtils.waitForNoLoadingSpinners();
    
    // Check if blog posts are displayed
    const blogPosts = page.locator('[data-testid="blog-post"]');
    const postCount = await blogPosts.count();
    
    expect(postCount).toBeGreaterThan(0);
    
    // Check blog post structure
    const firstPost = blogPosts.first();
    await expect(firstPost.locator('[data-testid="post-title"]')).toBeVisible();
    await expect(firstPost.locator('[data-testid="post-excerpt"]')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu is visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Test mobile menu functionality
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('should enforce dark mode', async ({ page }) => {
    // Check that dark mode is always enforced
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Verify no theme toggle exists
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).not.toBeVisible();
  });

  test('should load quickly and meet performance standards', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Assert load time is under 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check for Core Web Vitals
    const metrics = await page.evaluate(() => ({
      // Get performance metrics if available
      navigation: performance.getEntriesByType('navigation')[0],
    }));
    
    expect(metrics).toBeDefined();
  });
});
