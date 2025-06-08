import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  try {
    // Clean up test database
    // Clean up uploaded files
    // Clean up any other global resources
    
    console.log('✅ Global teardown completed');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - we don't want teardown failures to fail the test run
  }
}

export default globalTeardown;
