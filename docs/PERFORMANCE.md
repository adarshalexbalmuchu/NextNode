# Performance Optimization Guide

## Overview

This guide covers performance optimization strategies implemented in the NextNode project, including code splitting, lazy loading, bundle optimization, and performance monitoring.

## Implemented Optimizations

### 1. Code Splitting & Lazy Loading

#### Route-based Code Splitting

```typescript
// App.tsx
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const BootstrapAdmin = lazy(() => import("./pages/BootstrapAdmin"));
const CreatePost = lazy(() => import("./pages/CreatePost"));

// Usage with Suspense
<Suspense fallback={<PageLoadingFallback />}>
  <AdminDashboard />
</Suspense>
```

#### Component-level Optimization

```typescript
// Memoized components
const BlogCard = memo(({ title, excerpt, ...props }) => {
  usePerformanceMonitor('BlogCard');
  // Component logic
});

// Memoized callbacks
const handleClick = useCallback(() => {
  navigate(`/post/${slug}`);
}, [slug, navigate]);
```

### 2. Bundle Optimization

#### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'admin-features': ['./src/pages/AdminDashboard.tsx'],
        },
      },
    },
  },
});
```

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Check bundle with visualizer
npm run build && npx vite-bundle-analyzer dist/stats.html
```

### 3. Image Optimization

#### Lazy Image Component

```typescript
import { LazyImage } from '@/components/ui/lazy-image'

<LazyImage
  src="/large-image.jpg"
  alt="Description"
  className="w-full h-64 object-cover"
/>
```

#### Responsive Images

```typescript
const srcSet = generateSrcSet('/api/images/hero', [400, 800, 1200, 1600])

<img
  src="/api/images/hero?w=800"
  srcSet={srcSet}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  alt="Hero image"
/>
```

### 4. Performance Monitoring

#### Component Performance

```typescript
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

const MyComponent = () => {
  usePerformanceMonitor('MyComponent');
  // Component renders are automatically tracked
};
```

#### Web Vitals Monitoring

```typescript
// Automatically initialized in App.tsx
import { initWebVitals } from '@/hooks/usePerformanceMonitor';

useEffect(() => {
  initWebVitals();
}, []);
```

### 5. React Query Optimization

#### Optimized Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('4')) {
          return false; // Don't retry 4xx errors
        }
        return failureCount < 3;
      },
    },
  },
});
```

## Performance Metrics & Monitoring

### Core Web Vitals

| Metric                         | Good    | Needs Improvement | Poor    |
| ------------------------------ | ------- | ----------------- | ------- |
| LCP (Largest Contentful Paint) | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| FID (First Input Delay)        | ≤ 100ms | 100ms - 300ms     | > 300ms |
| CLS (Cumulative Layout Shift)  | ≤ 0.1   | 0.1 - 0.25        | > 0.25  |

### Bundle Size Targets

| Chunk Type    | Target Size | Current Size | Status     |
| ------------- | ----------- | ------------ | ---------- |
| Initial JS    | < 200kb     | TBD          | 🟡 Monitor |
| Vendor Chunks | < 500kb     | TBD          | 🟡 Monitor |
| Route Chunks  | < 100kb     | TBD          | 🟡 Monitor |
| Total JS      | < 1MB       | TBD          | 🟡 Monitor |

### Performance Budget

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "2kb",
      "maximumError": "4kb"
    }
  ]
}
```

## Optimization Strategies

### 1. Component Optimization

#### Use React.memo for Pure Components

```typescript
const PureComponent = memo(({ data }) => {
  return <div>{data.title}</div>
});
```

#### Optimize Re-renders

```typescript
// Avoid inline objects and functions
❌ <Component style={{ margin: 10 }} onClick={() => doSomething()} />

✅
const style = { margin: 10 };
const handleClick = useCallback(() => doSomething(), []);
<Component style={style} onClick={handleClick} />
```

#### Use useMemo for Expensive Calculations

```typescript
const expensiveValue = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);
```

### 2. Network Optimization

#### Preload Critical Resources

```html
<link rel="preload" href="/critical-font.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/hero-image.jpg" as="image" />
```

#### Resource Hints

```html
<link rel="prefetch" href="/admin-dashboard.js" />
<link rel="preconnect" href="https://api.example.com" />
```

### 3. Rendering Optimization

#### Virtual Scrolling for Large Lists

```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {Row}
  </List>
);
```

#### Debounced Search

```typescript
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  // Search API call only triggers after user stops typing
  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);
};
```

## Performance Testing

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        run: |
          npm ci
          npm run build
          npx @lhci/cli@0.12.x autorun
```

### Bundle Size Monitoring

```bash
# Check bundle size impact
npm run build:analyze

# Monitor bundle size in CI
npx bundlesize
```

### Performance Testing Scripts

```bash
# Run performance tests
npm run test:performance

# Generate performance report
npm run perf:report
```

## Common Performance Anti-patterns

### ❌ Avoid

```typescript
// Inline objects cause unnecessary re-renders
<Component style={{ margin: 10 }} />

// Functions recreated on every render
<button onClick={() => setValue(value + 1)}>Increment</button>

// Missing dependencies in useEffect
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// Large bundle imports
import _ from 'lodash'; // Imports entire library
```

### ✅ Prefer

```typescript
// Memoized objects
const style = useMemo(() => ({ margin: 10 }), []);
<Component style={style} />

// Memoized callbacks
const handleIncrement = useCallback(() => setValue(v => v + 1), []);
<button onClick={handleIncrement}>Increment</button>

// Correct dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Tree-shakable imports
import debounce from 'lodash/debounce';
```

## Tools & Resources

### Development Tools

- **React DevTools Profiler**: Component render analysis
- **Chrome DevTools**: Performance tab for runtime analysis
- **Lighthouse**: Core Web Vitals and performance audits
- **Bundle Analyzer**: Webpack bundle visualization

### VS Code Extensions

- **Import Cost**: Shows package import sizes
- **Performance Monitor**: Runtime performance tracking

### Monitoring Services

- **Google Analytics**: Core Web Vitals tracking
- **Sentry**: Performance monitoring and error tracking
- **LogRocket**: Session replay with performance data

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build:dev        # Development build
npm run build:analyze    # Build with bundle analysis

# Performance
npm run lighthouse       # Run Lighthouse audit
npm run perf:monitor     # Start performance monitoring

# Testing
npm run test:performance # Run performance tests
npm run test:coverage    # Generate coverage report
```

## Continuous Optimization

1. **Regular Audits**: Run Lighthouse audits weekly
2. **Bundle Monitoring**: Check bundle size on every PR
3. **Performance Budget**: Set and enforce performance budgets
4. **User Monitoring**: Track real user metrics (RUM)
5. **A/B Testing**: Test performance optimizations with users
