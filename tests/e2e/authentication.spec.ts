import { test, expect } from '@playwright/test';
import { TestUtils } from '../utils/test-utils';
import { TestUser } from '../fixtures/test-data';

test.describe('Authentication Flow', () => {
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    testUtils = new TestUtils(page);
  });

  test.describe('Login', () => {
    test('should navigate to login page', async ({ page }) => {
      await testUtils.goToLoginPage();
      
      await expect(page).toHaveURL('/login');
      await expect(page.locator('h1, h2').filter({ hasText: /login|sign in/i })).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await testUtils.goToLoginPage();
      
      // Try to submit empty form
      await page.click('[data-testid="login-button"]');
      
      // Check for validation errors
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await testUtils.goToLoginPage();
      
      await page.fill('[data-testid="email-input"]', TestUser.INVALID_USER.email);
      await page.fill('[data-testid="password-input"]', TestUser.INVALID_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Wait for error message
      await expect(page.locator('[data-testid="auth-error"]')).toBeVisible();
    });

    test('should successfully login with valid credentials', async ({ page }) => {
      // Note: This test requires a test user to exist in the database
      // In a real scenario, you would set up test data in global setup
      
      await testUtils.goToLoginPage();
      
      await page.fill('[data-testid="email-input"]', TestUser.VALID_USER.email);
      await page.fill('[data-testid="password-input"]', TestUser.VALID_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Should redirect to dashboard or home
      await page.waitForURL(/\/(dashboard|$)/);
      
      // Should show user is logged in
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    test('should persist login state after page refresh', async ({ page }) => {
      // First login
      await testUtils.loginUser(TestUser.VALID_USER.email, TestUser.VALID_USER.password);
      
      // Refresh the page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should still be logged in
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });
  });

  test.describe('Registration', () => {
    test('should navigate to registration page', async ({ page }) => {
      await testUtils.goToRegisterPage();
      
      await expect(page).toHaveURL('/register');
      await expect(page.locator('h1, h2').filter({ hasText: /register|sign up/i })).toBeVisible();
    });

    test('should show validation errors for invalid data', async ({ page }) => {
      await testUtils.goToRegisterPage();
      
      // Fill invalid data
      await page.fill('[data-testid="email-input"]', 'invalid-email');
      await page.fill('[data-testid="password-input"]', '123'); // Too short
      await page.fill('[data-testid="confirm-password-input"]', '456'); // Doesn't match
      
      await page.click('[data-testid="register-button"]');
      
      // Check for validation errors
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="confirm-password-error"]')).toBeVisible();
    });

    test('should successfully register new user', async ({ page }) => {
      // Generate unique email for test
      const uniqueEmail = `test-${Date.now()}@example.com`;
      
      await testUtils.goToRegisterPage();
      
      await page.fill('[data-testid="name-input"]', 'Test User');
      await page.fill('[data-testid="email-input"]', uniqueEmail);
      await page.fill('[data-testid="password-input"]', 'TestPassword123!');
      await page.fill('[data-testid="confirm-password-input"]', 'TestPassword123!');
      
      await page.click('[data-testid="register-button"]');
      
      // Should show success message or redirect
      await expect(
        page.locator('[data-testid="success-message"]')
          .or(page.locator('[data-testid="verification-message"]'))
      ).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('should successfully logout user', async ({ page }) => {
      // First login
      await testUtils.loginUser();
      
      // Then logout
      await testUtils.logoutUser();
      
      // Should be redirected to home page
      await expect(page).toHaveURL('/');
      
      // User menu should not be visible
      await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
      
      // Login button should be visible
      await expect(page.locator('[data-testid="login-link"]')).toBeVisible();
    });
  });

  test.describe('Password Reset', () => {
    test('should show password reset form', async ({ page }) => {
      await testUtils.goToLoginPage();
      
      // Click forgot password link
      await page.click('[data-testid="forgot-password-link"]');
      
      await expect(page.locator('[data-testid="reset-password-form"]')).toBeVisible();
    });

    test('should send password reset email for valid email', async ({ page }) => {
      await testUtils.goToLoginPage();
      await page.click('[data-testid="forgot-password-link"]');
      
      await page.fill('[data-testid="reset-email-input"]', TestUser.VALID_USER.email);
      await page.click('[data-testid="send-reset-button"]');
      
      // Should show success message
      await expect(page.locator('[data-testid="reset-success-message"]')).toBeVisible();
    });
  });
});
