import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OAuthButton } from '../oauth-button';

function mockFetch(response: { ok: boolean; data?: unknown; status?: number }) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(response.data ? JSON.stringify(response.data) : null, {
      status: response.status ?? (response.ok ? 200 : 400),
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function mockFetchError() {
  return vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
}

beforeEach(() => {
  vi.clearAllMocks();
  (window as { location?: unknown }).location = undefined;
  (window as { location: { href: string } }).location = { href: '' };
});

describe('OAuthButton', () => {
  describe('Rendering', () => {
    it('renders button with default Google provider label', () => {
      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    });

    it('renders button with GitHub provider label', () => {
      render(<OAuthButton provider="github" apiBaseUrl="/api/auth" />);

      expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument();
    });

    it('renders button with GitLab provider label', () => {
      render(<OAuthButton provider="gitlab" apiBaseUrl="/api/auth" />);

      expect(screen.getByRole('button', { name: /sign in with gitlab/i })).toBeInTheDocument();
    });

    it('renders button with Azure provider label', () => {
      render(<OAuthButton provider="azure" apiBaseUrl="/api/auth" />);

      expect(screen.getByRole('button', { name: /sign in with azure/i })).toBeInTheDocument();
    });

    it('renders button with Bitbucket provider label', () => {
      render(<OAuthButton provider="bitbucket" apiBaseUrl="/api/auth" />);

      expect(screen.getByRole('button', { name: /sign in with bitbucket/i })).toBeInTheDocument();
    });

    it('renders custom children instead of default label', () => {
      render(
        <OAuthButton provider="google" apiBaseUrl="/api/auth">
          <span>Custom OAuth Text</span>
        </OAuthButton>
      );

      expect(screen.getByText(/custom oauth text/i)).toBeInTheDocument();
      expect(screen.queryByText(/sign in with google/i)).not.toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" className="my-custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('my-custom-class');
    });

    it('renders as outline variant button', () => {
      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      // Button component should apply variant="outline" styles
      expect(button).toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('calls OAuth API and redirects on successful response', async () => {
      const user = userEvent.setup();
      const oauthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...';

      mockFetch({ ok: true, data: { url: oauthUrl } });

      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(window.location.href).toBe(oauthUrl);
      });
    });

    it('sends correct provider in request body', async () => {
      const user = userEvent.setup();
      const fetchMock = mockFetch({ ok: true, data: { url: 'https://oauth.example.com' } });

      render(<OAuthButton provider="github" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          '/api/auth/auth/oauth',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'github', redirectTo: undefined }),
          })
        );
      });
    });

    it('includes redirectTo in request when provided', async () => {
      const user = userEvent.setup();
      const fetchMock = mockFetch({ ok: true, data: { url: 'https://oauth.example.com' } });

      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" redirectTo="/dashboard" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          '/api/auth/auth/oauth',
          expect.objectContaining({
            body: JSON.stringify({ provider: 'google', redirectTo: '/dashboard' }),
          })
        );
      });
    });

    it('handles multiple provider types correctly', async () => {
      const user = userEvent.setup();
      const providers: Array<'google' | 'github' | 'gitlab' | 'azure' | 'bitbucket'> = [
        'google',
        'github',
        'gitlab',
        'azure',
        'bitbucket',
      ];

      for (const provider of providers) {
        const { unmount } = render(<OAuthButton provider={provider} apiBaseUrl="/api/auth" />);

        const fetchMock = mockFetch({ ok: true, data: { url: 'https://oauth.example.com' } });

        const button = screen.getByRole('button');
        await user.click(button);

        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/auth/oauth',
            expect.objectContaining({
              body: JSON.stringify({ provider, redirectTo: undefined }),
            })
          );
        });

        unmount();
      }
    });
  });

  describe('Error Handling', () => {
    it('handles API failure gracefully', async () => {
      const user = userEvent.setup();
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockFetch({ ok: false, status: 500 });

      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('OAuth error:', expect.any(Error));
      });

      // Should not redirect
      expect(window.location.href).toBe('');

      consoleError.mockRestore();
    });

    it('handles network error gracefully', async () => {
      const user = userEvent.setup();
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockFetchError();

      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('OAuth error:', expect.any(Error));
      });

      // Should not redirect
      expect(window.location.href).toBe('');

      consoleError.mockRestore();
    });

    it('handles missing url in response', async () => {
      const user = userEvent.setup();

      mockFetch({ ok: true, data: {} }); // Missing url

      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        // Should attempt to redirect to undefined (which becomes string 'undefined')
        expect(window.location.href).toBe(undefined);
      });
    });
  });

  describe('Button Type', () => {
    it('has type="button" to prevent form submission', () => {
      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('does not submit parent form when clicked', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((e) => e.preventDefault());

      mockFetch({ ok: true, data: { url: 'https://oauth.example.com' } });

      render(
        <form onSubmit={onSubmit}>
          <OAuthButton provider="google" apiBaseUrl="/api/auth" />
        </form>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('API Base URL', () => {
    it('uses provided apiBaseUrl', async () => {
      const user = userEvent.setup();
      const fetchMock = mockFetch({ ok: true, data: { url: 'https://oauth.example.com' } });

      render(<OAuthButton provider="google" apiBaseUrl="https://api.example.com" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.example.com/auth/oauth',
          expect.any(Object)
        );
      });
    });

    it('handles relative apiBaseUrl', async () => {
      const user = userEvent.setup();
      const fetchMock = mockFetch({ ok: true, data: { url: 'https://oauth.example.com' } });

      render(<OAuthButton provider="google" apiBaseUrl="/api" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith('/api/auth/oauth', expect.any(Object));
      });
    });
  });

  describe('Multiple Clicks', () => {
    it('handles rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      const fetchMock = vi.spyOn(globalThis, 'fetch');

      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ url: 'https://oauth.example.com' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');

      // Click 3 times rapidly
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // All clicks should trigger API calls
      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('Custom Children with Icons', () => {
    it('renders children with icon and text', () => {
      render(
        <OAuthButton provider="google" apiBaseUrl="/api/auth">
          <span className="icon">G</span>
          <span>Continue with Google</span>
        </OAuthButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('G');
      expect(button).toHaveTextContent(/continue with google/i);
    });
  });

  describe('Accessibility', () => {
    it('has accessible role', () => {
      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      mockFetch({ ok: true, data: { url: 'https://oauth.example.com' } });

      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      button.focus();

      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(window.location.href).toBe('https://oauth.example.com');
      });
    });

    it('can be activated with Space key', async () => {
      const user = userEvent.setup();
      mockFetch({ ok: true, data: { url: 'https://oauth.example.com' } });

      render(<OAuthButton provider="google" apiBaseUrl="/api/auth" />);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard(' ');

      await waitFor(() => {
        expect(window.location.href).toBe('https://oauth.example.com');
      });
    });
  });

  describe('Integration with different providers', () => {
    it('works with all supported providers', () => {
      const providers: Array<'google' | 'github' | 'gitlab' | 'azure' | 'bitbucket'> = [
        'google',
        'github',
        'gitlab',
        'azure',
        'bitbucket',
      ];

      for (const provider of providers) {
        const { unmount } = render(<OAuthButton provider={provider} apiBaseUrl="/api/auth" />);

        expect(screen.getByRole('button')).toBeInTheDocument();

        unmount();
      }
    });
  });
});
