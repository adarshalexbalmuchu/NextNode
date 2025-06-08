import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  console.log('🚀 Starting global setup...');
  
  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Wait for the dev server to be ready
    if (baseURL) {
      console.log(`⏳ Waiting for dev server at ${baseURL}...`);
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
      console.log('✅ Dev server is ready');
    }
    
    // Set up test database or other global resources
    // This could include seeding test data, setting up authentication, etc.
    console.log('🔧 Setting up test environment...');
    
    // Create test user session if needed
    // await setupTestUser(page);
    
    console.log('✅ Global setup completed');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
