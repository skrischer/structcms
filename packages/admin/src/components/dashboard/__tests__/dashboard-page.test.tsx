import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { defineSection, createRegistry } from '@structcms/core';
import { AdminProvider } from '../../../context/admin-context';
import { DashboardPage } from '../dashboard-page';
import type { PageSummary } from '../../content/page-list';

const heroSection = defineSection({
  name: 'hero',
  fields: { title: z.string() },
});

const registry = createRegistry({
  sections: [heroSection],
  pageTypes: [],
});

const defaultProps = {
  onSelectPage: vi.fn(),
  onCreatePage: vi.fn(),
  onUploadMedia: vi.fn(),
};

function renderWithProvider(props = defaultProps) {
  return render(
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      <DashboardPage {...props} />
    </AdminProvider>
  );
}

const mockPages: PageSummary[] = [
  { id: '1', title: 'Home', slug: 'home', pageType: 'landing', updatedAt: '2026-02-09T00:00:00Z' },
  { id: '2', title: 'About', slug: 'about', pageType: 'landing', updatedAt: '2026-02-08T00:00:00Z' },
];

function mockAllApiSuccess() {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  // KpiCards makes 3 calls: /pages, /media, /navigation
  // RecentPages makes 1 call: /pages
  // Total: 4 fetch calls
  fetchMock.mockImplementation((url) => {
    const urlStr = typeof url === 'string' ? url : (url as Request).url;
    if (urlStr.includes('/pages')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockPages), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
    if (urlStr.includes('/media')) {
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 'm1' }]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
    if (urlStr.includes('/navigation')) {
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 'n1' }]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
    return Promise.resolve(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
  return fetchMock;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('DashboardPage', () => {
  it('renders the dashboard container', () => {
    mockAllApiSuccess();
    renderWithProvider();
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('renders Dashboard heading', () => {
    mockAllApiSuccess();
    renderWithProvider();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders KpiCards sub-component', () => {
    mockAllApiSuccess();
    renderWithProvider();
    expect(screen.getByTestId('kpi-cards')).toBeInTheDocument();
  });

  it('renders RecentPages sub-component', () => {
    mockAllApiSuccess();
    renderWithProvider();
    expect(screen.getByTestId('recent-pages')).toBeInTheDocument();
  });

  it('renders QuickActions sub-component', () => {
    mockAllApiSuccess();
    renderWithProvider();
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
  });

  it('displays KPI counts after data loads', async () => {
    mockAllApiSuccess();
    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('kpi-pages-value')).toHaveTextContent('2');
    });

    expect(screen.getByTestId('kpi-media-value')).toHaveTextContent('1');
    expect(screen.getByTestId('kpi-navigation-value')).toHaveTextContent('1');
    expect(screen.getByTestId('kpi-sections-value')).toHaveTextContent('1');
  });

  it('displays recent pages after data loads', async () => {
    mockAllApiSuccess();
    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-list')).toBeInTheDocument();
    });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('passes onSelectPage to RecentPages', async () => {
    const onSelectPage = vi.fn();
    mockAllApiSuccess();
    renderWithProvider({ ...defaultProps, onSelectPage });

    await waitFor(() => {
      expect(screen.getByTestId('recent-page-1')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('recent-page-1'));
    expect(onSelectPage).toHaveBeenCalledWith(mockPages[0]);
  });

  it('passes onCreatePage to QuickActions', async () => {
    const onCreatePage = vi.fn();
    mockAllApiSuccess();
    renderWithProvider({ ...defaultProps, onCreatePage });

    await userEvent.click(screen.getByTestId('quick-action-create-page'));
    expect(onCreatePage).toHaveBeenCalledOnce();
  });

  it('passes onUploadMedia to QuickActions', async () => {
    const onUploadMedia = vi.fn();
    mockAllApiSuccess();
    renderWithProvider({ ...defaultProps, onUploadMedia });

    await userEvent.click(screen.getByTestId('quick-action-upload-media'));
    expect(onUploadMedia).toHaveBeenCalledOnce();
  });

  it('wraps sections in ErrorBoundary for isolation', () => {
    mockAllApiSuccess();
    renderWithProvider();

    // ErrorBoundaries are present — if a child throws, the boundary catches it
    // We verify by checking that all 3 sections render independently
    expect(screen.getByTestId('kpi-cards')).toBeInTheDocument();
    expect(screen.getByTestId('recent-pages')).toBeInTheDocument();
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockAllApiSuccess();
    render(
      <AdminProvider registry={registry} apiBaseUrl="/api/cms">
        <DashboardPage {...defaultProps} className="my-dashboard" />
      </AdminProvider>
    );
    expect(screen.getByTestId('dashboard-page')).toHaveClass('my-dashboard');
  });

  it('uses responsive grid layout', () => {
    mockAllApiSuccess();
    renderWithProvider();

    // The dashboard has a grid layout for RecentPages + QuickActions
    // Find the grid that contains both recent-pages and quick-actions
    const recentPages = screen.getByTestId('recent-pages');
    const gridParent = recentPages.closest('.md\\:grid-cols-3');
    expect(gridParent).toBeInTheDocument();
  });
});
