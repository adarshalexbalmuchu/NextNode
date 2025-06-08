import { Page } from '@playwright/test';

/**
 * Test utilities for common actions across e2e tests
 */

export class TestUtils {
  constructor(private page: Page) {}

  /**
   * Navigate to the home page and wait for it to load
   */
  async goToHomePage() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to the login page
   */
  async goToLoginPage() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to the register page
   */
  async goToRegisterPage() {
    await this.page.goto('/register');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login with test credentials
   */
  async loginUser(email: string = 'test@example.com', password: string = 'testpassword') {
    await this.goToLoginPage();
    
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    
    // Wait for successful login redirect
    await this.page.waitForURL('/dashboard');
  }

  /**
   * Logout the current user
   */
  async logoutUser() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    await this.page.waitForURL('/');
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Take a full page screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`, 
      fullPage: true 
    });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for loading to complete
   */
  async waitForNoLoadingSpinners() {
    await this.page.waitForSelector('[data-testid="loading-spinner"]', { 
      state: 'hidden', 
      timeout: 10000 
    }).catch(() => {
      // Ignore if no loading spinner is found
    });
  }

  /**
   * Check for error messages
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isElementVisible('[data-testid="error-message"]');
  }

  /**
   * Get text content of an element
   */
  async getElementText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  /**
   * Click and wait for navigation
   */
  async clickAndNavigate(selector: string) {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(selector)
    ]);
  }
}
