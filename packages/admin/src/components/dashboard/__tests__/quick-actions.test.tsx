import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickActions } from '../quick-actions';

describe('QuickActions', () => {
  const defaultProps = {
    onCreatePage: vi.fn(),
    onUploadMedia: vi.fn(),
  };

  it('renders the quick actions container', () => {
    render(<QuickActions {...defaultProps} />);
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
  });

  it('renders heading', () => {
    render(<QuickActions {...defaultProps} />);
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('renders Create New Page button', () => {
    render(<QuickActions {...defaultProps} />);
    expect(screen.getByTestId('quick-action-create-page')).toBeInTheDocument();
    expect(screen.getByText('Create New Page')).toBeInTheDocument();
  });

  it('renders Upload Media button', () => {
    render(<QuickActions {...defaultProps} />);
    expect(screen.getByTestId('quick-action-upload-media')).toBeInTheDocument();
    expect(screen.getByText('Upload Media')).toBeInTheDocument();
  });

  it('calls onCreatePage when Create New Page is clicked', async () => {
    const onCreatePage = vi.fn();
    render(<QuickActions {...defaultProps} onCreatePage={onCreatePage} />);

    await userEvent.click(screen.getByTestId('quick-action-create-page'));
    expect(onCreatePage).toHaveBeenCalledOnce();
  });

  it('calls onUploadMedia when Upload Media is clicked', async () => {
    const onUploadMedia = vi.fn();
    render(<QuickActions {...defaultProps} onUploadMedia={onUploadMedia} />);

    await userEvent.click(screen.getByTestId('quick-action-upload-media'));
    expect(onUploadMedia).toHaveBeenCalledOnce();
  });

  it('has proper ARIA labels', () => {
    render(<QuickActions {...defaultProps} />);
    expect(screen.getByLabelText('Create New Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Media')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<QuickActions {...defaultProps} className="my-custom-class" />);
    expect(screen.getByTestId('quick-actions')).toHaveClass('my-custom-class');
  });

  it('does not require any API dependency', () => {
    // QuickActions should render without AdminProvider (no useAdmin/useApiClient)
    const { container } = render(<QuickActions {...defaultProps} />);
    expect(container.querySelectorAll('button')).toHaveLength(2);
  });
});
