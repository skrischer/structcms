import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(screen.getByTestId('nav-link-/pages')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-/navigation')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-/media')).toBeInTheDocument();
  });

  it('renders sidebar with Pages, Navigation, Media links', () => {
    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('renders header with default title', () => {
    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toHaveTextContent('StructCMS');
  });

  it('renders header with custom title', () => {
    render(
      <AdminLayout title="My CMS" onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('header-title')).toHaveTextContent('My CMS');
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
    expect(screen.queryByText('Pages')).not.toBeInTheDocument();
  });

  it('renders sidebar toggle button for mobile', () => {
    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
  });

  it('toggles sidebar on mobile when toggle is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    // Sidebar starts hidden (translated off-screen)
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('-translate-x-full');

    // Click toggle to open
    await user.click(screen.getByTestId('sidebar-toggle'));
    expect(sidebar).toHaveClass('translate-x-0');
    expect(sidebar).not.toHaveClass('-translate-x-full');
  });

  it('shows overlay when sidebar is open on mobile', async () => {
    const user = userEvent.setup();

    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('sidebar-toggle'));

    expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument();
  });

  it('closes sidebar when overlay is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AdminLayout onNavigate={() => {}}>
        <p>Content</p>
      </AdminLayout>
    );

    await user.click(screen.getByTestId('sidebar-toggle'));
    expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument();

    await user.click(screen.getByTestId('sidebar-overlay'));
    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();
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
    expect(activeLink).toHaveClass('bg-primary');
  });
});
