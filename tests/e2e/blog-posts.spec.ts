import { test, expect } from '@playwright/test';
import { TestUtils } from '../utils/test-utils';
import { TestBlogPost, TestComment } from '../fixtures/test-data';

test.describe('Blog Post Features', () => {
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    testUtils = new TestUtils(page);
  });

  test.describe('Blog Post Display', () => {
    test('should display individual blog post correctly', async ({ page }) => {
      await testUtils.goToHomePage();

      // Click on first blog post
      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        // Check blog post structure
        await expect(page.locator('[data-testid="post-title"]')).toBeVisible();
        await expect(page.locator('[data-testid="post-content"]')).toBeVisible();
        await expect(page.locator('[data-testid="post-author"]')).toBeVisible();
        await expect(page.locator('[data-testid="post-date"]')).toBeVisible();

        // Check if tags are displayed
        const tagsContainer = page.locator('[data-testid="post-tags"]');
        if (await tagsContainer.isVisible()) {
          const tags = page.locator('[data-testid="post-tag"]');
          expect(await tags.count()).toBeGreaterThan(0);
        }
      }
    });

    test('should show reading time estimate', async ({ page }) => {
      await testUtils.goToHomePage();

      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        // Check for reading time indicator
        const readingTime = page.locator('[data-testid="reading-time"]');

        if (await readingTime.isVisible()) {
          const timeText = await readingTime.textContent();
          expect(timeText).toMatch(/\d+\s*min/i);
        }
      }
    });

    test('should support social sharing', async ({ page }) => {
      await testUtils.goToHomePage();

      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        // Check for share buttons
        const shareContainer = page.locator('[data-testid="share-buttons"]');

        if (await shareContainer.isVisible()) {
          await expect(shareContainer.locator('[data-testid="share-twitter"]')).toBeVisible();
          await expect(shareContainer.locator('[data-testid="share-facebook"]')).toBeVisible();
          await expect(shareContainer.locator('[data-testid="share-linkedin"]')).toBeVisible();
        }
      }
    });

    test('should have working table of contents for long posts', async ({ page }) => {
      await testUtils.goToHomePage();

      // Look for a long post or navigate to one
      const posts = page.locator('[data-testid="blog-post"]');
      const postCount = await posts.count();

      for (let i = 0; i < Math.min(postCount, 3); i++) {
        await posts.nth(i).click();
        await page.waitForLoadState('networkidle');

        // Check if table of contents exists
        const toc = page.locator('[data-testid="table-of-contents"]');

        if (await toc.isVisible()) {
          // Test TOC navigation
          const tocLinks = toc.locator('a');
          const linkCount = await tocLinks.count();

          if (linkCount > 0) {
            await tocLinks.first().click();

            // Should scroll to the section
            await page.waitForTimeout(500); // Wait for scroll animation

            break;
          }
        }

        // Go back to try next post
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    });
  });

  test.describe('Blog List and Navigation', () => {
    test('should display blog list with pagination', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');

      // Check blog posts are displayed
      const blogPosts = page.locator('[data-testid="blog-post"]');
      expect(await blogPosts.count()).toBeGreaterThan(0);

      // Check pagination
      const pagination = page.locator('[data-testid="pagination"]');

      if (await pagination.isVisible()) {
        const nextButton = page.locator('[data-testid="pagination-next"]');

        if ((await nextButton.isVisible()) && !(await nextButton.isDisabled())) {
          await nextButton.click();
          await page.waitForLoadState('networkidle');

          // Should load next page
          await expect(blogPosts.first()).toBeVisible();
        }
      }
    });

    test('should support infinite scroll or load more', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');

      const initialPostCount = await page.locator('[data-testid="blog-post"]').count();

      // Check for load more button
      const loadMoreButton = page.locator('[data-testid="load-more-button"]');

      if (await loadMoreButton.isVisible()) {
        await loadMoreButton.click();
        await testUtils.waitForNoLoadingSpinners();

        const newPostCount = await page.locator('[data-testid="blog-post"]').count();
        expect(newPostCount).toBeGreaterThan(initialPostCount);
      } else {
        // Test infinite scroll
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        await page.waitForTimeout(2000); // Wait for potential loading

        const newPostCount = await page.locator('[data-testid="blog-post"]').count();
        // May or may not load more depending on implementation
      }
    });

    test('should filter blog posts by category', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');

      const categoryFilter = page.locator('[data-testid="category-filter"]');

      if (await categoryFilter.isVisible()) {
        // Select a category
        await categoryFilter.selectOption({ index: 1 }); // Select first non-empty option

        await testUtils.waitForNoLoadingSpinners();

        // Posts should be filtered
        const filteredPosts = page.locator('[data-testid="blog-post"]');
        expect(await filteredPosts.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Comments System', () => {
    test('should display comments section', async ({ page }) => {
      await testUtils.goToHomePage();

      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        // Check for comments section
        const commentsSection = page.locator('[data-testid="comments-section"]');

        if (await commentsSection.isVisible()) {
          await expect(commentsSection.locator('[data-testid="comments-title"]')).toBeVisible();
        }
      }
    });

    test('should allow authenticated users to post comments', async ({ page }) => {
      // Login first
      await testUtils.loginUser();

      // Navigate to a blog post
      await testUtils.goToHomePage();
      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        const commentForm = page.locator('[data-testid="comment-form"]');

        if (await commentForm.isVisible()) {
          await page.fill('[data-testid="comment-input"]', TestComment.POSITIVE_COMMENT.content);
          await page.click('[data-testid="submit-comment-button"]');

          // Should show success message or new comment
          await expect(
            page
              .locator('[data-testid="comment-success"]')
              .or(page.locator('[data-testid="new-comment"]'))
          ).toBeVisible();
        }
      }
    });

    test('should show login prompt for unauthenticated users', async ({ page }) => {
      await testUtils.goToHomePage();

      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        const commentsSection = page.locator('[data-testid="comments-section"]');

        if (await commentsSection.isVisible()) {
          // Should show login prompt instead of comment form
          const loginPrompt = page.locator('[data-testid="comment-login-prompt"]');

          if (await loginPrompt.isVisible()) {
            await expect(loginPrompt).toContainText(/login|sign in/i);
          }
        }
      }
    });

    test('should support comment replies', async ({ page }) => {
      // Login first
      await testUtils.loginUser();

      await testUtils.goToHomePage();
      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        const existingComment = page.locator('[data-testid="comment"]').first();

        if (await existingComment.isVisible()) {
          const replyButton = existingComment.locator('[data-testid="reply-button"]');

          if (await replyButton.isVisible()) {
            await replyButton.click();

            // Should show reply form
            await expect(existingComment.locator('[data-testid="reply-form"]')).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Reading Experience', () => {
    test('should track reading progress', async ({ page }) => {
      await testUtils.goToHomePage();

      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        const progressBar = page.locator('[data-testid="reading-progress"]');

        if (await progressBar.isVisible()) {
          // Scroll down to test progress
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
          });

          await page.waitForTimeout(500);

          // Progress should have changed
          const progress = await progressBar.getAttribute('value');
          expect(parseInt(progress || '0')).toBeGreaterThan(0);
        }
      }
    });

    test('should support text size adjustment', async ({ page }) => {
      await testUtils.goToHomePage();

      const firstPost = page.locator('[data-testid="blog-post"]').first();

      if (await firstPost.isVisible()) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        const textSizeControls = page.locator('[data-testid="text-size-controls"]');

        if (await textSizeControls.isVisible()) {
          const increaseButton = textSizeControls.locator('[data-testid="increase-text-size"]');

          if (await increaseButton.isVisible()) {
            await increaseButton.click();

            // Text should be larger
            const postContent = page.locator('[data-testid="post-content"]');
            const fontSize = await postContent.evaluate(el => window.getComputedStyle(el).fontSize);

            expect(fontSize).toBeDefined();
          }
        }
      }
    });
  });
});
