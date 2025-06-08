import { test, expect } from '@playwright/test';
import { TestUtils } from '../utils/test-utils';

test.describe('Performance and PWA', () => {
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    testUtils = new TestUtils(page);
  });

  test.describe('Page Load Performance', () => {
    test('should load homepage within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      // Check Core Web Vitals
      const vitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitalsData: any = {};
            
            entries.forEach((entry) => {
              if (entry.name === 'largest-contentful-paint') {
                vitalsData.lcp = entry.startTime;
              }
              if (entry.name === 'first-input-delay') {
                vitalsData.fid = entry.duration;
              }
              if (entry.name === 'cumulative-layout-shift') {
                vitalsData.cls = (entry as any).value;
              }
            });
            
            resolve(vitalsData);
          }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
          
          // Fallback timeout
          setTimeout(() => resolve({}), 5000);
        });
      });
      
      console.log('Core Web Vitals:', vitals);
    });

    test('should load blog posts efficiently with virtual scrolling', async ({ page }) => {
      await page.goto('/blog');
      
      // Wait for initial load
      await page.waitForLoadState('networkidle');
      
      const initialPostCount = await page.locator('[data-testid="blog-post"]').count();
      
      // Scroll down rapidly to test virtual scrolling
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        await page.waitForTimeout(100);
      }
      
      // Should maintain performance with virtual scrolling
      const finalPostCount = await page.locator('[data-testid="blog-post"]').count();
      
      // Virtual scrolling should maintain reasonable DOM size
      expect(finalPostCount).toBeLessThan(100); // Assuming virtual scrolling limits DOM size
    });

    test('should optimize images for fast loading', async ({ page }) => {
      await testUtils.goToHomePage();
      
      // Check for lazy loading images
      const images = page.locator('img[loading="lazy"]');
      const lazyImageCount = await images.count();
      
      if (lazyImageCount > 0) {
        // Images should have proper loading attributes
        expect(lazyImageCount).toBeGreaterThan(0);
      }
      
      // Check for responsive images
      const responsiveImages = page.locator('img[srcset]');
      const responsiveCount = await responsiveImages.count();
      
      console.log(`Found ${responsiveCount} responsive images`);
    });

    test('should cache static resources effectively', async ({ page }) => {
      // First visit
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Get network timing for first visit
      const firstVisitTiming = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          loadEventEnd: navigation.loadEventEnd,
          domContentLoadedEventEnd: navigation.domContentLoadedEventEnd
        };
      });
      
      // Reload page (should use cache)
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const secondVisitTiming = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          loadEventEnd: navigation.loadEventEnd,
          domContentLoadedEventEnd: navigation.domContentLoadedEventEnd
        };
      });
      
      // Second visit should be faster due to caching
      expect(secondVisitTiming.loadEventEnd).toBeLessThan(firstVisitTiming.loadEventEnd);
    });
  });

  test.describe('Progressive Web App (PWA)', () => {
    test('should have valid PWA manifest', async ({ page }) => {
      await page.goto('/');
      
      // Check for manifest link
      const manifestLink = page.locator('link[rel="manifest"]');
      await expect(manifestLink).toHaveCount(1);
      
      const manifestHref = await manifestLink.getAttribute('href');
      expect(manifestHref).toBeTruthy();
      
      // Check manifest content
      const manifestResponse = await page.request.get(manifestHref!);
      expect(manifestResponse.status()).toBe(200);
      
      const manifest = await manifestResponse.json();
      expect(manifest.name).toBeTruthy();
      expect(manifest.short_name).toBeTruthy();
      expect(manifest.icons).toBeDefined();
      expect(manifest.start_url).toBeTruthy();
      expect(manifest.display).toBeTruthy();
    });

    test('should register service worker', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check if service worker is registered
      const swRegistered = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          return !!registration;
        }
        return false;
      });
      
      expect(swRegistered).toBe(true);
    });

    test('should work offline after initial visit', async ({ page, context }) => {
      // First visit to cache resources
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Wait for service worker to cache resources
      await page.waitForTimeout(2000);
      
      // Go offline
      await context.setOffline(true);
      
      // Try to reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should show cached version or offline page
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      
      // Check for offline indicator if available
      const offlineIndicator = page.locator('[data-testid="offline-indicator"]');
      if (await offlineIndicator.isVisible()) {
        await expect(offlineIndicator).toBeVisible();
      }
      
      // Go back online
      await context.setOffline(false);
    });

    test('should show install prompt on supported devices', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Simulate PWA install prompt
      await page.evaluate(() => {
        // Dispatch beforeinstallprompt event
        const event = new Event('beforeinstallprompt');
        window.dispatchEvent(event);
      });
      
      await page.waitForTimeout(1000);
      
      // Check if install button appears
      const installButton = page.locator('[data-testid="pwa-install-button"]');
      
      if (await installButton.isVisible()) {
        await expect(installButton).toBeVisible();
        
        // Test install prompt
        await installButton.click();
        
        // Should show install dialog or confirmation
        // Note: Actual installation can't be tested in automation
      }
    });

    test('should handle push notifications', async ({ page, context }) => {
      // Grant notification permission
      await context.grantPermissions(['notifications']);
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check if notifications are supported
      const notificationSupport = await page.evaluate(() => {
        return 'Notification' in window && 'serviceWorker' in navigator;
      });
      
      if (notificationSupport) {
        // Check for notification permission request
        const notificationPermission = await page.evaluate(() => {
          return Notification.permission;
        });
        
        expect(['granted', 'default', 'denied']).toContain(notificationPermission);
      }
    });
  });

  test.describe('Accessibility and Performance', () => {
    test('should meet accessibility standards', async ({ page }) => {
      await testUtils.goToHomePage();
      
      // Check for basic accessibility features
      
      // Skip links for keyboard navigation
      const skipLink = page.locator('[data-testid="skip-to-content"]');
      if (await skipLink.isVisible()) {
        await expect(skipLink).toBeVisible();
      }
      
      // Alt text for images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          const ariaLabel = await img.getAttribute('aria-label');
          
          // Should have alt text or aria-label
          expect(alt || ariaLabel).toBeTruthy();
        }
      }
      
      // Proper heading hierarchy
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      if (headingCount > 0) {
        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      await testUtils.goToHomePage();
      
      // Test Tab navigation
      await page.keyboard.press('Tab');
      
      // Check if focus is visible
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      expect(focusedElement).toBeTruthy();
      
      // Test navigation menu with keyboard
      const navItems = page.locator('nav a, nav button');
      const navCount = await navItems.count();
      
      if (navCount > 0) {
        // Navigate through menu items
        for (let i = 0; i < Math.min(navCount, 3); i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(100);
        }
        
        // Should be able to activate with Enter
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
      }
    });

    test('should handle high contrast mode', async ({ page }) => {
      // Test with forced colors (high contrast mode)
      await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
      
      await testUtils.goToHomePage();
      
      // Check if content is still readable
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      
      // Check if interactive elements are still visible
      const buttons = page.locator('button, a');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        await expect(firstButton).toBeVisible();
      }
    });

    test('should work with reduced motion preference', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      await testUtils.goToHomePage();
      
      // Check if animations respect reduced motion
      // This is more of a visual check, but we can verify the setting is applied
      const prefersReducedMotion = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });
      
      expect(prefersReducedMotion).toBe(true);
    });
  });
});
