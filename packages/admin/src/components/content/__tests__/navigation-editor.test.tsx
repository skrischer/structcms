import type { NavigationItem } from '@structcms/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NavigationEditor } from '../navigation-editor';

describe('NavigationEditor', () => {
  it('renders navigation editor', () => {
    render(<NavigationEditor items={[]} onSave={() => {}} />);

    expect(screen.getByTestId('navigation-editor')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(<NavigationEditor items={[]} onSave={() => {}} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/No navigation items yet/)).toBeInTheDocument();
  });

  it('renders Add Item button', () => {
    render(<NavigationEditor items={[]} onSave={() => {}} />);

    expect(screen.getByTestId('nav-add-item')).toBeInTheDocument();
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('renders Save Navigation button', () => {
    render(<NavigationEditor items={[]} onSave={() => {}} />);

    expect(screen.getByTestId('nav-save')).toBeInTheDocument();
    expect(screen.getByText('Save Navigation')).toBeInTheDocument();
  });

  it('renders existing items with label and href', () => {
    const items: NavigationItem[] = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    expect(screen.getByTestId('nav-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-label-0')).toHaveValue('Home');
    expect(screen.getByTestId('nav-item-href-0')).toHaveValue('/');
    expect(screen.getByTestId('nav-item-label-1')).toHaveValue('About');
    expect(screen.getByTestId('nav-item-href-1')).toHaveValue('/about');
  });

  it('adds a new item when Add Item is clicked', async () => {
    const user = userEvent.setup();

    render(<NavigationEditor items={[]} onSave={() => {}} />);

    await user.click(screen.getByTestId('nav-add-item'));

    expect(screen.getByTestId('nav-item-0')).toBeInTheDocument();
  });

  it('removes an item when Remove is clicked', async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId('nav-item-remove-0'));

    expect(screen.queryByTestId('nav-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('nav-item-label-0')).toHaveValue('About');
  });

  it('edits item label', async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: '', href: '' }];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.type(screen.getByTestId('nav-item-label-0'), 'Home');

    expect(screen.getByTestId('nav-item-label-0')).toHaveValue('Home');
  });

  it('edits item href', async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: '', href: '' }];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.type(screen.getByTestId('nav-item-href-0'), '/home');

    expect(screen.getByTestId('nav-item-href-0')).toHaveValue('/home');
  });

  it('adds a child item', async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: 'Products', href: '/products', children: [] }];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId('nav-add-child-0'));

    expect(screen.getByTestId('nav-child-0-0')).toBeInTheDocument();
  });

  it('renders existing children', () => {
    const items: NavigationItem[] = [
      {
        label: 'Products',
        href: '/products',
        children: [{ label: 'Widget', href: '/products/widget' }],
      },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    expect(screen.getByTestId('nav-child-0-0')).toBeInTheDocument();
    expect(screen.getByTestId('nav-child-label-0-0')).toHaveValue('Widget');
    expect(screen.getByTestId('nav-child-href-0-0')).toHaveValue('/products/widget');
  });

  it('removes a child item', async () => {
    const user = userEvent.setup();
    const items: NavigationItem[] = [
      {
        label: 'Products',
        href: '/products',
        children: [
          { label: 'Widget', href: '/products/widget' },
          { label: 'Gadget', href: '/products/gadget' },
        ],
      },
    ];

    render(<NavigationEditor items={items} onSave={() => {}} />);

    await user.click(screen.getByTestId('nav-child-remove-0-0'));

    expect(screen.queryByTestId('nav-child-0-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('nav-child-label-0-0')).toHaveValue('Gadget');
  });

  it('calls onSave with updated items when Save is clicked', async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();
    const items: NavigationItem[] = [{ label: 'Home', href: '/', children: [] }];

    render(<NavigationEditor items={items} onSave={handleSave} />);

    await user.click(screen.getByTestId('nav-save'));

    expect(handleSave).toHaveBeenCalledWith([{ label: 'Home', href: '/', children: [] }]);
  });

  it('applies custom className', () => {
    render(<NavigationEditor items={[]} onSave={() => {}} className="custom-class" />);

    expect(screen.getByTestId('navigation-editor')).toHaveClass('custom-class');
  });
});
