import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArrayField } from '../array-field';

interface TestItem {
  id: number;
  name: string;
}

const createDefaultItem = (): TestItem => ({ id: Date.now(), name: '' });

const renderItem = (
  item: TestItem,
  index: number,
  onChange: (item: TestItem) => void
) => (
  <input
    data-testid={`item-input-${index}`}
    value={item.name}
    onChange={(e) => onChange({ ...item, name: e.target.value })}
  />
);

describe('ArrayField', () => {
  it('renders with label', () => {
    render(
      <ArrayField
        label="Items"
        name="items"
        value={[]}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    expect(screen.getByText('Items')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <ArrayField
        label="Items"
        name="items"
        value={[]}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows "No items yet" when array is empty', () => {
    render(
      <ArrayField
        label="Items"
        name="items"
        value={[]}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    expect(screen.getByText('No items yet')).toBeInTheDocument();
  });

  it('renders Add Item button', () => {
    render(
      <ArrayField
        label="Items"
        name="items"
        value={[]}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    expect(screen.getByTestId('add-item')).toBeInTheDocument();
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('calls onChange with new item when Add Item is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ArrayField
        label="Items"
        name="items"
        value={[]}
        onChange={handleChange}
        createDefaultItem={() => ({ id: 1, name: 'new' })}
        renderItem={renderItem}
      />
    );

    await user.click(screen.getByTestId('add-item'));

    expect(handleChange).toHaveBeenCalledWith([{ id: 1, name: 'new' }]);
  });

  it('renders items with renderItem', () => {
    const items: TestItem[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];

    render(
      <ArrayField
        label="Items"
        name="items"
        value={items}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    expect(screen.getByTestId('item-input-0')).toHaveValue('First');
    expect(screen.getByTestId('item-input-1')).toHaveValue('Second');
  });

  it('renders Remove button for each item', () => {
    const items: TestItem[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];

    render(
      <ArrayField
        label="Items"
        name="items"
        value={items}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    expect(screen.getByTestId('remove-0')).toBeInTheDocument();
    expect(screen.getByTestId('remove-1')).toBeInTheDocument();
  });

  it('calls onChange without item when Remove is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const items: TestItem[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];

    render(
      <ArrayField
        label="Items"
        name="items"
        value={items}
        onChange={handleChange}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    await user.click(screen.getByTestId('remove-0'));

    expect(handleChange).toHaveBeenCalledWith([{ id: 2, name: 'Second' }]);
  });

  it('renders Up/Down buttons for each item', () => {
    const items: TestItem[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];

    render(
      <ArrayField
        label="Items"
        name="items"
        value={items}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    expect(screen.getByTestId('move-up-0')).toBeInTheDocument();
    expect(screen.getByTestId('move-down-0')).toBeInTheDocument();
    expect(screen.getByTestId('move-up-1')).toBeInTheDocument();
    expect(screen.getByTestId('move-down-1')).toBeInTheDocument();
  });

  it('disables Up button on first item', () => {
    const items: TestItem[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];

    render(
      <ArrayField
        label="Items"
        name="items"
        value={items}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    expect(screen.getByTestId('move-up-0')).toBeDisabled();
    expect(screen.getByTestId('move-up-1')).not.toBeDisabled();
  });

  it('disables Down button on last item', () => {
    const items: TestItem[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];

    render(
      <ArrayField
        label="Items"
        name="items"
        value={items}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    expect(screen.getByTestId('move-down-0')).not.toBeDisabled();
    expect(screen.getByTestId('move-down-1')).toBeDisabled();
  });

  it('moves item up when Up button is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const items: TestItem[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];

    render(
      <ArrayField
        label="Items"
        name="items"
        value={items}
        onChange={handleChange}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    await user.click(screen.getByTestId('move-up-1'));

    expect(handleChange).toHaveBeenCalledWith([
      { id: 2, name: 'Second' },
      { id: 1, name: 'First' },
    ]);
  });

  it('moves item down when Down button is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const items: TestItem[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];

    render(
      <ArrayField
        label="Items"
        name="items"
        value={items}
        onChange={handleChange}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
      />
    );

    await user.click(screen.getByTestId('move-down-0'));

    expect(handleChange).toHaveBeenCalledWith([
      { id: 2, name: 'Second' },
      { id: 1, name: 'First' },
    ]);
  });

  it('displays validation error below field', () => {
    render(
      <ArrayField
        label="Items"
        name="items"
        value={[]}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
        error="At least one item is required"
      />
    );

    expect(screen.getByText('At least one item is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(
      <ArrayField
        label="Items"
        name="items"
        value={[]}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
        error="Error message"
      />
    );

    const container = document.querySelector('.border-destructive');
    expect(container).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ArrayField
        label="Items"
        name="items"
        value={[]}
        onChange={() => {}}
        createDefaultItem={createDefaultItem}
        renderItem={renderItem}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
