// Simple performance test script
const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting performance test...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable performance monitoring
  await page.coverage.startJSCoverage();
  await page.coverage.startCSSCoverage();
  
  console.log('Navigating to production preview...');
  const startTime = Date.now();
  
  await page.goto('http://localhost:4173', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  const loadTime = Date.now() - startTime;
  console.log(`Page load time: ${loadTime}ms`);
  
  // Measure performance metrics
  const performanceMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
    };
  });
  
  console.log('Performance Metrics:');
  console.log(`  DOM Content Loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
  console.log(`  Load Complete: ${performanceMetrics.loadComplete.toFixed(2)}ms`);
  console.log(`  First Paint: ${performanceMetrics.firstPaint.toFixed(2)}ms`);
  console.log(`  First Contentful Paint: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);
  console.log(`  DOM Interactive: ${performanceMetrics.domInteractive.toFixed(2)}ms`);
  console.log(`  Total Load Time: ${performanceMetrics.totalLoadTime.toFixed(2)}ms`);
  
  // Check for LCP
  const lcp = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({entryTypes: ['largest-contentful-paint']});
      
      // Fallback timeout
      setTimeout(() => resolve(0), 5000);
    });
  });
  
  console.log(`  Largest Contentful Paint: ${lcp.toFixed(2)}ms`);
  
  if (lcp > 2500) {
    console.warn(`⚠️  LCP is ${lcp.toFixed(2)}ms (should be ≤2500ms)`);
  } else {
    console.log(`✅ LCP is within acceptable range`);
  }
  
  const jsCoverage = await page.coverage.stopJSCoverage();
  const cssCoverage = await page.coverage.stopCSSCoverage();
  
  // Calculate unused code
  let totalBytes = 0;
  let usedBytes = 0;
  
  [...jsCoverage, ...cssCoverage].forEach(entry => {
    totalBytes += entry.text.length;
    for (const range of entry.ranges) {
      usedBytes += range.end - range.start - 1;
    }
  });
  
  const unusedBytes = totalBytes - usedBytes;
  console.log(`Bundle Analysis:`);
  console.log(`  Total bytes: ${(totalBytes / 1024).toFixed(2)} KB`);
  console.log(`  Used bytes: ${(usedBytes / 1024).toFixed(2)} KB`);
  console.log(`  Unused bytes: ${(unusedBytes / 1024).toFixed(2)} KB`);
  console.log(`  Code utilization: ${((usedBytes / totalBytes) * 100).toFixed(2)}%`);
  
  await browser.close();
  console.log('Performance test completed!');
})();
