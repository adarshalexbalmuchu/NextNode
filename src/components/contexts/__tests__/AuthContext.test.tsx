
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { AuthProvider, useAuth } from '../AuthContext';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(),
            })),
          })),
        })),
      })),
      insert: vi.fn(),
    })),
    rpc: vi.fn(),
  },
}));

// Test component that uses auth context
const TestComponent = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-status">{user ? `Logged in as ${user.email}` : 'Not logged in'}</div>
      <button onClick={signOut} data-testid="signout-btn">
        Sign Out
      </button>
    </div>
  );
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
          id: 'test-subscription',
          callback: vi.fn(),
        },
      },
    });

    // Mock RPC call
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: 'user',
      error: null,
    });

    // Mock database operations
    const mockFrom = vi.mocked(supabase.from);
    mockFrom.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' },
          }),
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { role: 'user' },
                error: null,
              }),
            })),
          })),
        })),
      })),
      insert: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    } as any);
  });

  it('shows loading state initially', async () => {
    const Wrapper = createWrapper();

    render(<TestComponent />, { wrapper: Wrapper });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows not logged in when no session', async () => {
    const Wrapper = createWrapper();

    render(<TestComponent />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
  });

  it('shows user email when logged in', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const mockSession = {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const Wrapper = createWrapper();

    render(<TestComponent />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
    });
  });

  it('calls signOut when sign out button is clicked', async () => {
    const user = userEvent.setup();
    const mockSignOut = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.auth.signOut).mockImplementation(mockSignOut);

    const Wrapper = createWrapper();

    render(<TestComponent />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('signout-btn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('signout-btn'));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
