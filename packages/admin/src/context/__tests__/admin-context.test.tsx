import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminProvider } from '../admin-context';
import { useAdmin } from '../../hooks/use-admin';
import { useApiClient } from '../../hooks/use-api-client';
import { useToast } from '../../components/ui/toast';
import type { Registry } from '@structcms/core';

function createMockRegistry(): Registry {
  return {
    getSection: vi.fn().mockReturnValue(undefined),
    getAllSections: vi.fn().mockReturnValue([]),
    getPageType: vi.fn().mockReturnValue(undefined),
    getAllPageTypes: vi.fn().mockReturnValue([]),
    getNavigation: vi.fn().mockReturnValue(undefined),
    getAllNavigations: vi.fn().mockReturnValue([]),
  };
}

function TestConsumer() {
  const { registry, apiBaseUrl } = useAdmin();
  const sectionsCount = registry.getAllSections().length;

  return (
    <div>
      <span data-testid="api-base-url">{apiBaseUrl}</span>
      <span data-testid="sections-count">{sectionsCount}</span>
    </div>
  );
}

function ApiClientConsumer() {
  const api = useApiClient();

  return (
    <div>
      <span data-testid="has-get">{typeof api.get === 'function' ? 'yes' : 'no'}</span>
      <span data-testid="has-post">{typeof api.post === 'function' ? 'yes' : 'no'}</span>
      <span data-testid="has-put">{typeof api.put === 'function' ? 'yes' : 'no'}</span>
      <span data-testid="has-delete">{typeof api.delete === 'function' ? 'yes' : 'no'}</span>
    </div>
  );
}

describe('AdminProvider', () => {
  let mockRegistry: Registry;

  beforeEach(() => {
    mockRegistry = createMockRegistry();
  });

  it('provides registry to child components', () => {
    render(
      <AdminProvider registry={mockRegistry}>
        <TestConsumer />
      </AdminProvider>
    );

    expect(screen.getByTestId('sections-count').textContent).toBe('0');
    expect(mockRegistry.getAllSections).toHaveBeenCalled();
  });

  it('provides default apiBaseUrl when not specified', () => {
    render(
      <AdminProvider registry={mockRegistry}>
        <TestConsumer />
      </AdminProvider>
    );

    expect(screen.getByTestId('api-base-url').textContent).toBe('/api/cms');
  });

  it('uses custom apiBaseUrl when provided', () => {
    render(
      <AdminProvider registry={mockRegistry} apiBaseUrl="/custom/api">
        <TestConsumer />
      </AdminProvider>
    );

    expect(screen.getByTestId('api-base-url').textContent).toBe('/custom/api');
  });
});

describe('useAdmin', () => {
  it('throws error when used outside AdminProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useAdmin must be used within an AdminProvider'
    );

    consoleError.mockRestore();
  });
});

describe('useApiClient', () => {
  let mockRegistry: Registry;

  beforeEach(() => {
    mockRegistry = createMockRegistry();
  });

  it('returns an API client with all methods', () => {
    render(
      <AdminProvider registry={mockRegistry}>
        <ApiClientConsumer />
      </AdminProvider>
    );

    expect(screen.getByTestId('has-get').textContent).toBe('yes');
    expect(screen.getByTestId('has-post').textContent).toBe('yes');
    expect(screen.getByTestId('has-put').textContent).toBe('yes');
    expect(screen.getByTestId('has-delete').textContent).toBe('yes');
  });
});

function ToastConsumer() {
  const { toast } = useToast();
  return (
    <button data-testid="trigger-toast" onClick={() => toast('Hello', 'success')}>
      Toast
    </button>
  );
}

describe('Toast integration in AdminProvider', () => {
  it('useToast works inside AdminProvider without separate ToastProvider', async () => {
    const mockRegistry = createMockRegistry();
    const user = userEvent.setup();

    render(
      <AdminProvider registry={mockRegistry}>
        <ToastConsumer />
      </AdminProvider>
    );

    await user.click(screen.getByTestId('trigger-toast'));

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
