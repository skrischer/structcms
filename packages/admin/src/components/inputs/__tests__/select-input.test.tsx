import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SelectInput } from '../select-input';

describe('SelectInput', () => {
  it('renders radio buttons when options <= 3', () => {
    render(<SelectInput label="Color" options={['Red', 'Blue']} />);

    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('renders dropdown when options > 3', () => {
    render(<SelectInput label="Color" options={['Red', 'Blue', 'Green', 'Yellow']} />);

    expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<SelectInput label="Color" options={['Red', 'Blue']} />);

    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<SelectInput label="Color" options={['Red', 'Blue']} required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<SelectInput label="Color" options={['Red', 'Blue']} />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error', () => {
    render(<SelectInput label="Color" options={['Red', 'Blue']} error="Selection required" />);

    expect(screen.getByText('Selection required')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<SelectInput label="Color" options={['Red', 'Blue']} error="Selection required" />);

    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
  });

  it('calls onChange when radio option selected', async () => {
    const user = userEvent.setup();
    let selected = '';
    render(
      <SelectInput label="Color" options={['Red', 'Blue']} onChange={(v) => (selected = v)} />
    );

    await user.click(screen.getByTestId('select-option-Blue'));

    expect(selected).toBe('Blue');
  });

  it('calls onChange when dropdown value changes', async () => {
    const user = userEvent.setup();
    let selected = '';
    render(
      <SelectInput
        label="Color"
        options={['Red', 'Blue', 'Green', 'Yellow']}
        onChange={(v) => (selected = v)}
      />
    );

    await user.selectOptions(screen.getByTestId('select-dropdown'), 'Green');

    expect(selected).toBe('Green');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SelectInput label="Color" options={['Red', 'Blue']} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('shows correct option as selected in radio mode', () => {
    render(<SelectInput label="Color" options={['Red', 'Blue', 'Green']} value="Blue" />);

    const blueRadio = screen.getByTestId('select-option-Blue') as HTMLInputElement;
    const redRadio = screen.getByTestId('select-option-Red') as HTMLInputElement;

    expect(blueRadio.checked).toBe(true);
    expect(redRadio.checked).toBe(false);
  });

  it('shows correct option as selected in dropdown mode', () => {
    render(
      <SelectInput label="Color" options={['Red', 'Blue', 'Green', 'Yellow']} value="Green" />
    );

    const select = screen.getByTestId('select-dropdown') as HTMLSelectElement;
    expect(select.value).toBe('Green');
  });
});
