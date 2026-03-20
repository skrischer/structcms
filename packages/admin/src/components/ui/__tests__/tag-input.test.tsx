import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagInput } from '../tag-input';

describe('TagInput', () => {
  it('renders existing tags as badges', () => {
    render(<TagInput value={['react', 'typescript']} onChange={() => {}} />);

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('adds tag on Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TagInput value={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'newtag{Enter}');

    expect(onChange).toHaveBeenCalledWith(['newtag']);
  });

  it('adds tag on comma', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TagInput value={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'newtag,');

    expect(onChange).toHaveBeenCalledWith(['newtag']);
  });

  it('removes tag on badge close click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TagInput value={['react', 'typescript']} onChange={onChange} />);

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    await user.click(removeButtons[0] as HTMLElement);

    expect(onChange).toHaveBeenCalledWith(['typescript']);
  });

  it('prevents duplicate tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TagInput value={['react']} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'react{Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes last tag on Backspace with empty input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TagInput value={['react', 'typescript']} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenCalledWith(['react']);
  });

  it('shows placeholder when empty', () => {
    render(<TagInput value={[]} onChange={() => {}} placeholder="Add tags..." />);

    expect(screen.getByPlaceholderText('Add tags...')).toBeInTheDocument();
  });

  it('hides placeholder when tags exist', () => {
    render(<TagInput value={['react']} onChange={() => {}} placeholder="Add tags..." />);

    expect(screen.queryByPlaceholderText('Add tags...')).not.toBeInTheDocument();
  });

  it('disabled state prevents interaction', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TagInput value={['react']} onChange={onChange} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();

    const removeButtons = screen.queryAllByRole('button', { name: 'Remove' });
    expect(removeButtons).toHaveLength(0);
  });

  it('error state shows error styling', () => {
    render(<TagInput value={[]} onChange={() => {}} error />);

    const container = screen.getByTestId('tag-input');
    expect(container).toHaveClass('border-[var(--admin-error-500)]');
  });

  it('forwards className', () => {
    render(<TagInput value={[]} onChange={() => {}} className="my-custom-class" />);

    expect(screen.getByTestId('tag-input')).toHaveClass('my-custom-class');
  });

  it('trims whitespace from tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TagInput value={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '  spaced  {Enter}');

    expect(onChange).toHaveBeenCalledWith(['spaced']);
  });
});
