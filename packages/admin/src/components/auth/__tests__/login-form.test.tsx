import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../../context/auth-context';
import { LoginForm } from '../login-form';

function mockFetch(response: { ok: boolean; data?: unknown; status?: number }) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(response.data ? JSON.stringify(response.data) : null, {
      status: response.status ?? (response.ok ? 200 : 400),
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider apiBaseUrl="/api/auth">{children}</AuthProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  if (typeof document !== 'undefined') {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  }
});

describe('LoginForm', () => {
  describe('Rendering', () => {
    it('renders email and password fields', () => {
      // Mock CSRF and verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('has correct input types', () => {
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
    });

    it('has placeholders', () => {
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText(/admin@example.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
    });

    it('marks fields as required', () => {
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/email/i)).toBeRequired();
      expect(screen.getByLabelText(/password/i)).toBeRequired();
    });
  });

  describe('Form Submission', () => {
    it('calls signIn and onSuccess on successful submission', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm onSuccess={onSuccess} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Mock signIn success
      mockFetch({ ok: true, data: { user: mockUser } });

      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('displays error message on failed submission', async () => {
      const user = userEvent.setup();

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');

      // Mock signIn failure
      mockFetch({
        ok: false,
        status: 401,
        data: { message: 'Invalid credentials' },
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('calls onError callback on failed submission', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm onError={onError} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');

      // Mock signIn failure
      mockFetch({
        ok: false,
        status: 401,
        data: { message: 'Account locked' },
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
        expect((onError.mock.calls[0] as [Error])[0].message).toBe('Account locked');
      });
    });

    it('clears previous error on new submission', async () => {
      const user = userEvent.setup();

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');

      // First attempt fails
      mockFetch({
        ok: false,
        status: 401,
        data: { message: 'Invalid credentials' },
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Second attempt succeeds
      await user.clear(passwordInput);
      await user.type(passwordInput, 'correctpassword');

      mockFetch({ ok: true, data: { user: { id: '1' } } });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('validates email field (HTML5 validation)', () => {
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toBeRequired();
    });

    it('validates password field is required', () => {
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Loading State', () => {
    it('disables inputs during submission', async () => {
      const user = userEvent.setup();

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');

      // Mock slow response
      vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  new Response(JSON.stringify({ user: { id: '1' } }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                  })
                ),
              100
            )
          )
      );

      await user.click(submitButton);

      // Check immediately after click
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('shows "Signing in..." text during submission', async () => {
      const user = userEvent.setup();

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');

      // Mock slow response
      vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  new Response(JSON.stringify({ user: { id: '1' } }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                  })
                ),
              100
            )
          )
      );

      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /signing in/i })).not.toBeInTheDocument();
      });
    });

    it('re-enables form after failed submission', async () => {
      const user = userEvent.setup();

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');

      // Mock failure
      mockFetch({
        ok: false,
        status: 401,
        data: { message: 'Invalid credentials' },
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Form should be re-enabled
      expect(emailInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Submission Flow', () => {
    it('prevents default form submission', async () => {
      const user = userEvent.setup();
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      const { container } = render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const form = container.querySelector('form');
      const submitHandler = vi.fn((e) => e.preventDefault());

      if (form) {
        form.addEventListener('submit', submitHandler);
      }

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');

      mockFetch({ ok: true, data: { user: mockUser } });

      await user.click(submitButton);

      await waitFor(() => {
        expect(submitHandler).toHaveBeenCalled();
      });
    });

    it('handles Enter key submission', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm onSuccess={onSuccess} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      mockFetch({ ok: true, data: { user: mockUser } });

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Error Display', () => {
    it('shows error in red background', async () => {
      const user = userEvent.setup();

      // Mock CSRF and initial verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');

      mockFetch({
        ok: false,
        status: 401,
        data: { message: 'Test error' },
      });

      await user.click(submitButton);

      await waitFor(() => {
        const errorDiv = screen.getByText(/test error/i);
        expect(errorDiv).toHaveClass('text-red-600');
        expect(errorDiv).toHaveClass('bg-red-50');
      });
    });
  });
});
