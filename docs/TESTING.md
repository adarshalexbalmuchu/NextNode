# Testing Guide for Quantum Read Flow

## Overview

This project uses Vitest as the testing framework with React Testing Library for component testing. The setup includes:

- **Vitest**: Fast unit test runner with hot reloading
- **React Testing Library**: Testing utilities for React components
- **Happy DOM**: Lightweight DOM implementation for tests
- **Coverage Reports**: V8 coverage provider with HTML/JSON/text reports

## Test Structure

```
src/
├── test/
│   ├── setup.ts          # Global test setup and mocks
│   ├── test-utils.tsx    # Custom render function with providers
│   └── vitest.d.ts       # TypeScript declarations
├── components/
│   └── __tests__/        # Component tests
├── hooks/
│   └── __tests__/        # Hook tests
└── contexts/
    └── __tests__/        # Context tests
```

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Type checking
npm run type-check
```

## Writing Tests

### Component Testing

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Component } from './Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    render(<Component />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCustomHook } from './useCustomHook'

describe('useCustomHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook())
    expect(result.current.value).toBe(0)
  })

  it('updates state on action', () => {
    const { result } = renderHook(() => useCustomHook())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.value).toBe(1)
  })
})
```

### Context Testing

Use the custom render function from `test-utils.tsx` for components that need providers:

```typescript
import { render } from '@/test/test-utils'
import { Component } from './Component'

describe('Component with context', () => {
  it('works with providers', () => {
    render(<Component />)
    // Test component that uses auth, query client, etc.
  })
})
```

## Mocking

### Supabase Mocking

Supabase is automatically mocked in the test setup. You can override specific methods:

```typescript
import { vi } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

vi.mocked(supabase.auth.signIn).mockResolvedValue({
  data: { user: mockUser, session: mockSession },
  error: null
})
```

### Router Mocking

```typescript
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})
```

## Performance Testing

Use the performance monitor hook in components:

```typescript
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

const Component = () => {
  usePerformanceMonitor('ComponentName')
  // Component logic
}
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Async Testing**: Always use `await` for user interactions and async operations
4. **Mock External Dependencies**: Mock APIs, timers, and browser APIs
5. **Test Edge Cases**: Include error states, loading states, and empty states
6. **Performance Monitoring**: Add performance monitoring to critical components

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Continuous Integration

Tests run automatically on:
- Pre-commit hooks (via Husky)
- Pull request validation
- Deployment pipelines

## Debugging Tests

### VS Code Integration

Add to `.vscode/settings.json`:

```json
{
  "vitest.enable": true,
  "vitest.commandLine": "npm test"
}
```

### Debug Mode

```bash
# Run specific test file
npx vitest src/components/__tests__/Component.test.tsx

# Debug with browser tools
npx vitest --ui
```

## Common Patterns

### Testing Forms

```typescript
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('submits form with valid data', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/message/i), 'Hello world')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

### Testing API Calls

```typescript
import { waitFor } from '@testing-library/react'

it('loads data on mount', async () => {
  render(<DataComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded data')).toBeInTheDocument()
  })
})
```

### Testing Error States

```typescript
it('shows error message on failure', async () => {
  vi.mocked(api.getData).mockRejectedValue(new Error('API Error'))
  
  render(<DataComponent />)
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```
