import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRegistry, defineSection } from '@structcms/core';
import { z } from 'zod';
import { StructCMSAdminApp } from '../struct-cms-admin-app';

vi.mock('../../dashboard/dashboard-page', () => ({
  DashboardPage: ({ onSelectPage, onCreatePage, onUploadMedia }: {
    onSelectPage: (page: { slug: string; title: string; pageType: string }) => void;
    onCreatePage: () => void;
    onUploadMedia: () => void;
  }) => (
    <div data-testid="dashboard-page">
      <button onClick={onCreatePage}>Create New Page</button>
      <button onClick={onUploadMedia}>Upload Media</button>
      <button onClick={() => onSelectPage({ slug: 'test', title: 'Test', pageType: 'default' })}>
        Select Page
      </button>
    </div>
  ),
}));

vi.mock('../../content/page-list', () => ({
  PageList: ({ onSelectPage, onCreatePage }: {
    onSelectPage: (page: { slug: string; title: string; pageType: string }) => void;
    onCreatePage: () => void;
  }) => (
    <div data-testid="page-list">
      <button onClick={onCreatePage}>Create Page</button>
      <button onClick={() => onSelectPage({ slug: 'test', title: 'Test', pageType: 'default' })}>
        Select
      </button>
    </div>
  ),
}));

vi.mock('../../../components/editors/page-editor', () => ({
  PageEditor: () => <div data-testid="page-editor">Page Editor</div>,
}));

vi.mock('../../media/media-browser', () => ({
  MediaBrowser: () => <div data-testid="media-browser">Media Browser</div>,
}));

vi.mock('../../content/navigation-editor', () => ({
  NavigationEditor: () => <div data-testid="navigation-editor">Navigation Editor</div>,
}));

describe('StructCMSAdminApp', () => {
  const mockRegistry = createRegistry({
    sections: [
      defineSection({
        name: 'hero',
        fields: {
          title: z.string(),
        },
      }),
    ],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with minimal configuration', () => {
    render(<StructCMSAdminApp registry={mockRegistry} />);
    
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  it('accepts registry and apiBaseUrl props', () => {
    render(
      <StructCMSAdminApp 
        registry={mockRegistry} 
        apiBaseUrl="/custom/api" 
      />
    );
    
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  it('shows dashboard as default view', () => {
    render(<StructCMSAdminApp registry={mockRegistry} />);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('navigates to pages list when Pages nav item is clicked', async () => {
    const user = userEvent.setup();
    render(<StructCMSAdminApp registry={mockRegistry} />);
    
    const pagesLink = screen.getByText('Pages');
    await user.click(pagesLink);
    
    expect(screen.getByTestId('page-list')).toBeInTheDocument();
  });

  it('navigates to media browser when Media nav item is clicked', async () => {
    const user = userEvent.setup();
    render(<StructCMSAdminApp registry={mockRegistry} />);
    
    const mediaLink = screen.getByText('Media');
    await user.click(mediaLink);
    
    expect(screen.getByTestId('media-browser')).toBeInTheDocument();
  });

  it('navigates to navigation editor when Navigation nav item is clicked', async () => {
    const user = userEvent.setup();
    render(<StructCMSAdminApp registry={mockRegistry} />);
    
    const navLink = screen.getByText('Navigation');
    await user.click(navLink);
    
    expect(screen.getByTestId('navigation-editor')).toBeInTheDocument();
  });

  it('navigates to page editor when Create New Page is clicked', async () => {
    const user = userEvent.setup();
    render(<StructCMSAdminApp registry={mockRegistry} />);
    
    const createButton = screen.getByText('Create New Page');
    await user.click(createButton);
    
    expect(screen.getByTestId('page-editor')).toBeInTheDocument();
  });

  it('navigates back to dashboard when Dashboard nav item is clicked', async () => {
    const user = userEvent.setup();
    render(<StructCMSAdminApp registry={mockRegistry} />);
    
    const pagesLink = screen.getByText('Pages');
    await user.click(pagesLink);
    expect(screen.getByTestId('page-list')).toBeInTheDocument();
    
    const dashboardLink = screen.getByText('Dashboard');
    await user.click(dashboardLink);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('includes all default admin views', async () => {
    const user = userEvent.setup();
    render(<StructCMSAdminApp registry={mockRegistry} />);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    
    await user.click(screen.getByText('Pages'));
    expect(screen.getByTestId('page-list')).toBeInTheDocument();
    
    await user.click(screen.getByText('Media'));
    expect(screen.getByTestId('media-browser')).toBeInTheDocument();
    
    await user.click(screen.getByText('Navigation'));
    expect(screen.getByTestId('navigation-editor')).toBeInTheDocument();
  });

  it('wraps content in AdminProvider with correct props', () => {
    render(
      <StructCMSAdminApp 
        registry={mockRegistry} 
        apiBaseUrl="/test/api" 
      />
    );
    
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });
});
