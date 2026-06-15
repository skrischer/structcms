import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from '../radio-group';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
] as const;

describe('RadioGroup', () => {
  it('renders all options', () => {
    render(<RadioGroup options={options} />);

    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('renders with radiogroup role', () => {
    render(<RadioGroup options={options} />);

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('shows correct option as checked', () => {
    render(<RadioGroup options={options} value="b" />);

    const radioB = screen.getByTestId('radio-option-b') as HTMLInputElement;
    const radioA = screen.getByTestId('radio-option-a') as HTMLInputElement;

    expect(radioB.checked).toBe(true);
    expect(radioA.checked).toBe(false);
  });

  it('calls onChange when option is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<RadioGroup options={options} onChange={onChange} />);

    await user.click(screen.getByTestId('radio-option-b'));

    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('all radios share the same name for native keyboard navigation', () => {
    render(<RadioGroup options={options} name="color" />);

    const radios = screen.getAllByRole('radio');
    for (const radio of radios) {
      expect(radio).toHaveAttribute('name', 'color');
    }
  });

  it('disabled state prevents interaction', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<RadioGroup options={options} onChange={onChange} disabled />);

    await user.click(screen.getByTestId('radio-option-a'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies disabled styling', () => {
    render(<RadioGroup options={options} disabled />);

    const labels = screen.getByRole('radiogroup').querySelectorAll('label');
    for (const label of labels) {
      expect(label).toHaveClass('opacity-60');
      expect(label).toHaveClass('cursor-not-allowed');
    }
  });

  it('applies error styling to circles', () => {
    const { container } = render(<RadioGroup options={options} error />);

    const circles = container.querySelectorAll('[aria-hidden="true"]');
    for (const circle of circles) {
      expect(circle).toHaveClass('border-[var(--admin-error-500)]');
    }
  });

  it('renders horizontal orientation', () => {
    render(<RadioGroup options={options} orientation="horizontal" />);

    const group = screen.getByRole('radiogroup');
    expect(group).toHaveClass('flex-row');
    expect(group).toHaveClass('gap-4');
  });

  it('renders vertical orientation by default', () => {
    render(<RadioGroup options={options} />);

    const group = screen.getByRole('radiogroup');
    expect(group).toHaveClass('flex-col');
    expect(group).toHaveClass('gap-2');
  });

  it('forwards className', () => {
    render(<RadioGroup options={options} className="my-custom" />);

    expect(screen.getByTestId('radio-group')).toHaveClass('my-custom');
  });

  it('supports custom testIdPrefix', () => {
    render(<RadioGroup options={options} testIdPrefix="select" />);

    expect(screen.getByTestId('select-option-a')).toBeInTheDocument();
    expect(screen.getByTestId('select-option-b')).toBeInTheDocument();
  });
});
