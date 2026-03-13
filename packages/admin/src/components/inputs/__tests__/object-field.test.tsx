import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ObjectField } from '../object-field';

describe('ObjectField', () => {
  it('renders with label', () => {
    render(
      <ObjectField label="Address" name="address">
        <div>Nested content</div>
      </ObjectField>
    );

    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <ObjectField label="Address" name="address" required>
        <div>Nested content</div>
      </ObjectField>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(
      <ObjectField label="Address" name="address">
        <div>Nested content</div>
      </ObjectField>
    );

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders children inside container', () => {
    render(
      <ObjectField label="Address" name="address">
        <div data-testid="child-1">Street</div>
        <div data-testid="child-2">City</div>
      </ObjectField>
    );

    const container = screen.getByTestId('object-field-container');
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('renders container with visual grouping (border)', () => {
    render(
      <ObjectField label="Address" name="address">
        <div>Nested content</div>
      </ObjectField>
    );

    const container = screen.getByTestId('object-field-container');
    expect(container).toHaveClass('border');
    expect(container).toHaveClass('rounded-md');
  });

  it('displays validation error below container', () => {
    render(
      <ObjectField label="Address" name="address" error="Address is invalid">
        <div>Nested content</div>
      </ObjectField>
    );

    expect(screen.getByText('Address is invalid')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(
      <ObjectField label="Address" name="address" error="Error message">
        <div>Nested content</div>
      </ObjectField>
    );

    const container = screen.getByTestId('object-field-container');
    expect(container).toHaveClass('border-destructive');
  });

  it('has role="group" for accessibility', () => {
    render(
      <ObjectField label="Address" name="address">
        <div>Nested content</div>
      </ObjectField>
    );

    const container = screen.getByTestId('object-field-container');
    expect(container).toHaveAttribute('role', 'group');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ObjectField label="Address" name="address" className="custom-class">
        <div>Nested content</div>
      </ObjectField>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders nested form fields correctly', () => {
    render(
      <ObjectField label="Contact" name="contact">
        <input data-testid="name-input" placeholder="Name" />
        <input data-testid="email-input" placeholder="Email" />
      </ObjectField>
    );

    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
  });
});
