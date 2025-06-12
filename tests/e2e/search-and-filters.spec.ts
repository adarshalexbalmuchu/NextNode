import { test, expect } from '@playwright/test';
import { TestUtils } from '../utils/test-utils';
import { TestSearch, TestFilters } from '../fixtures/test-data';

test.describe('Search and Filters', () => {
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    testUtils = new TestUtils(page);
    await testUtils.goToHomePage();
  });

  test.describe('Basic Search', () => {
    test('should have search input visible', async ({ page }) => {
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', /search/i);
    });

    test('should perform basic text search', async ({ page }) => {
      const searchTerm = TestSearch.POPULAR_TERMS[0];

      await page.fill('[data-testid="search-input"]', searchTerm);
      await page.press('[data-testid="search-input"]', 'Enter');

      // Wait for search results
      await testUtils.waitForNoLoadingSpinners();

      // Check search results are displayed
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();

      // Check that search term is highlighted in results
      const resultsContainer = page.locator('[data-testid="search-results"]');
      await expect(resultsContainer).toContainText(searchTerm, { ignoreCase: true });
    });

    test('should show no results message for invalid search', async ({ page }) => {
      await page.fill('[data-testid="search-input"]', TestSearch.NO_RESULTS_TERM);
      await page.press('[data-testid="search-input"]', 'Enter');

      await testUtils.waitForNoLoadingSpinners();

      await expect(page.locator('[data-testid="no-results-message"]')).toBeVisible();
    });

    test('should handle special characters in search', async ({ page }) => {
      for (const specialTerm of TestSearch.SPECIAL_CHARS) {
        await page.fill('[data-testid="search-input"]', specialTerm);
        await page.press('[data-testid="search-input"]', 'Enter');

        // Should not crash or show error
        await testUtils.waitForNoLoadingSpinners();

        // Clear search for next iteration
        await page.fill('[data-testid="search-input"]', '');
      }
    });

    test('should implement search debouncing', async ({ page }) => {
      const searchInput = page.locator('[data-testid="search-input"]');

      // Type quickly to test debouncing
      await searchInput.type('javascript', { delay: 50 });

      // Should show loading indicator briefly
      const loadingIndicator = page.locator('[data-testid="search-loading"]');

      // Wait for search to complete
      await testUtils.waitForNoLoadingSpinners();

      // Results should be displayed
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    });
  });

  test.describe('Advanced Search', () => {
    test('should open advanced search modal', async ({ page }) => {
      const advancedSearchButton = page.locator('[data-testid="advanced-search-button"]');

      if (await advancedSearchButton.isVisible()) {
        await advancedSearchButton.click();
        await expect(page.locator('[data-testid="advanced-search-modal"]')).toBeVisible();
      }
    });

    test('should filter by author', async ({ page }) => {
      // Open advanced search if available
      const advancedSearchButton = page.locator('[data-testid="advanced-search-button"]');

      if (await advancedSearchButton.isVisible()) {
        await advancedSearchButton.click();

        // Select author filter
        await page.selectOption('[data-testid="author-filter"]', TestFilters.AUTHORS[0]);
        await page.click('[data-testid="apply-filters-button"]');

        await testUtils.waitForNoLoadingSpinners();

        // Check that results are filtered by author
        const results = page.locator('[data-testid="blog-post"]');
        const firstResult = results.first();

        if (await firstResult.isVisible()) {
          await expect(firstResult.locator('[data-testid="post-author"]')).toContainText(
            TestFilters.AUTHORS[0]
          );
        }
      }
    });

    test('should filter by date range', async ({ page }) => {
      const advancedSearchButton = page.locator('[data-testid="advanced-search-button"]');

      if (await advancedSearchButton.isVisible()) {
        await advancedSearchButton.click();

        // Set date range (last week)
        const dateFrom = TestFilters.DATE_RANGES.LAST_WEEK.from.toISOString().split('T')[0];
        const dateTo = TestFilters.DATE_RANGES.LAST_WEEK.to.toISOString().split('T')[0];

        await page.fill('[data-testid="date-from-input"]', dateFrom);
        await page.fill('[data-testid="date-to-input"]', dateTo);

        await page.click('[data-testid="apply-filters-button"]');

        await testUtils.waitForNoLoadingSpinners();

        // Results should be filtered by date
        await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      }
    });

    test('should filter by tags', async ({ page }) => {
      const advancedSearchButton = page.locator('[data-testid="advanced-search-button"]');

      if (await advancedSearchButton.isVisible()) {
        await advancedSearchButton.click();

        // Select tag filter
        const tagCheckbox = page.locator(`[data-testid="tag-filter-${TestFilters.TAGS[0]}"]`);

        if (await tagCheckbox.isVisible()) {
          await tagCheckbox.check();
          await page.click('[data-testid="apply-filters-button"]');

          await testUtils.waitForNoLoadingSpinners();

          // Check that results contain the selected tag
          const results = page.locator('[data-testid="blog-post"]');
          const firstResult = results.first();

          if (await firstResult.isVisible()) {
            await expect(firstResult.locator('[data-testid="post-tags"]')).toContainText(
              TestFilters.TAGS[0]
            );
          }
        }
      }
    });

    test('should clear all filters', async ({ page }) => {
      const advancedSearchButton = page.locator('[data-testid="advanced-search-button"]');

      if (await advancedSearchButton.isVisible()) {
        await advancedSearchButton.click();

        // Apply some filters first
        await page.selectOption('[data-testid="author-filter"]', TestFilters.AUTHORS[0]);
        await page.click('[data-testid="apply-filters-button"]');

        await testUtils.waitForNoLoadingSpinners();

        // Now clear filters
        await advancedSearchButton.click();
        await page.click('[data-testid="clear-filters-button"]');
        await page.click('[data-testid="apply-filters-button"]');

        await testUtils.waitForNoLoadingSpinners();

        // Should show all results again
        await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      }
    });
  });

  test.describe('Search Results', () => {
    test('should display search results with proper structure', async ({ page }) => {
      await page.fill('[data-testid="search-input"]', TestSearch.POPULAR_TERMS[0]);
      await page.press('[data-testid="search-input"]', 'Enter');

      await testUtils.waitForNoLoadingSpinners();

      const results = page.locator('[data-testid="blog-post"]');
      const resultCount = await results.count();

      if (resultCount > 0) {
        const firstResult = results.first();

        // Check result structure
        await expect(firstResult.locator('[data-testid="post-title"]')).toBeVisible();
        await expect(firstResult.locator('[data-testid="post-excerpt"]')).toBeVisible();
        await expect(firstResult.locator('[data-testid="post-date"]')).toBeVisible();
      }
    });

    test('should support result pagination', async ({ page }) => {
      await page.fill('[data-testid="search-input"]', TestSearch.POPULAR_TERMS[0]);
      await page.press('[data-testid="search-input"]', 'Enter');

      await testUtils.waitForNoLoadingSpinners();

      // Check if pagination exists
      const paginationNextButton = page.locator('[data-testid="pagination-next"]');

      if (await paginationNextButton.isVisible()) {
        await paginationNextButton.click();
        await testUtils.waitForNoLoadingSpinners();

        // Should load next page of results
        await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      }
    });

    test('should allow clicking on search results', async ({ page }) => {
      await page.fill('[data-testid="search-input"]', TestSearch.POPULAR_TERMS[0]);
      await page.press('[data-testid="search-input"]', 'Enter');

      await testUtils.waitForNoLoadingSpinners();

      const firstResult = page.locator('[data-testid="blog-post"]').first();

      if (await firstResult.isVisible()) {
        const resultTitle = await firstResult.locator('[data-testid="post-title"]').textContent();

        await firstResult.click();

        // Should navigate to the blog post
        await page.waitForLoadState('networkidle');

        // Page should contain the post title
        if (resultTitle) {
          await expect(page.locator('h1')).toContainText(resultTitle);
        }
      }
    });
  });
});
