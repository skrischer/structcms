import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FieldMessage } from '../field-message';

describe('FieldMessage', () => {
  it('renders children', () => {
    render(<FieldMessage>Helper text</FieldMessage>);

    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('applies default variant styling', () => {
    render(<FieldMessage>Default</FieldMessage>);

    const el = screen.getByTestId('field-message');
    expect(el).toHaveClass('text-[var(--admin-gray-500)]');
    expect(el).toHaveClass('text-[12px]');
  });

  it('applies error variant styling', () => {
    render(<FieldMessage variant="error">Error text</FieldMessage>);

    const el = screen.getByTestId('field-message');
    expect(el).toHaveClass('text-[var(--admin-error-700)]');
  });

  it('sets role="alert" on error variant', () => {
    render(<FieldMessage variant="error">Error</FieldMessage>);

    expect(screen.getByTestId('field-message')).toHaveAttribute('role', 'alert');
  });

  it('does not set role on default variant', () => {
    render(<FieldMessage>Helper</FieldMessage>);

    expect(screen.getByTestId('field-message')).not.toHaveAttribute('role');
  });

  it('forwards className', () => {
    render(<FieldMessage className="my-custom">Text</FieldMessage>);

    expect(screen.getByTestId('field-message')).toHaveClass('my-custom');
  });

  it('forwards HTML attributes', () => {
    render(<FieldMessage id="field-error">Text</FieldMessage>);

    expect(screen.getByTestId('field-message')).toHaveAttribute('id', 'field-error');
  });

  it('renders as a paragraph element', () => {
    render(<FieldMessage>Text</FieldMessage>);

    const el = screen.getByTestId('field-message');
    expect(el.tagName).toBe('P');
  });
});
