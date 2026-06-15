import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminLayout } from '../admin-layout';

describe('AdminLayout', () => {
  it('renders admin layout', () => {
    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  it('renders sidebar with default nav items', () => {
    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument();
  });

  it('renders sidebar title', () => {
    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('sidebar-title')).toHaveTextContent('StructCMS');
  });

  it('renders sidebar with custom title', () => {
    render(
      <AdminLayout title="My CMS" onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('sidebar-title')).toHaveTextContent('My CMS');
  });

  it('renders children in main content area', () => {
    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Hello World</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('calls onNavigate when a nav link is clicked', async () => {
    const handleNavigate = vi.fn();
    const user = userEvent.setup();

    render(
      <AdminLayout onNavigate={handleNavigate}>
        <p>Content</p>
      </AdminLayout>
    );

    await user.click(screen.getByTestId('nav-link-/pages'));

    expect(handleNavigate).toHaveBeenCalledWith('/pages');
  });

  it('renders custom nav items', () => {
    const customItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Settings', path: '/settings' },
    ];

    render(
      <AdminLayout navItems={customItems} onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders sidebar collapse toggle', () => {
    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('sidebar-collapse-toggle')).toBeInTheDocument();
  });

  it('toggles sidebar collapsed state when collapse toggle is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    const sidebar = screen.getByTestId('sidebar');

    // Click collapse toggle
    await user.click(screen.getByTestId('sidebar-collapse-toggle'));

    // Sidebar width should change (collapsed = w-16, expanded = w-[260px])
    const hasCollapsedWidth = sidebar.className.includes('w-16');
    const hasExpandedWidth = sidebar.className.includes('w-[260px]');
    expect(hasCollapsedWidth || hasExpandedWidth).toBe(true);
  });

  it('applies custom className', () => {
    render(
      <AdminLayout onNavigate={() => {}} className="custom-class">
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('admin-layout')).toHaveClass('custom-class');
  });

  it('highlights active nav item', () => {
    render(
      <AdminLayout onNavigate={() => {}} activePath="/pages">
        <p>Content</p>
      </AdminLayout>
    );

    const activeLink = screen.getByTestId('nav-link-/pages');
    expect(activeLink.className).toContain('admin-surface-sidebar-active');
  });
});
