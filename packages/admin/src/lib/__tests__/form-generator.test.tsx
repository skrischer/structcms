import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { fields } from '@structcms/core';
import { FormGenerator, resolveFieldType, fieldNameToLabel } from '../form-generator';

describe('resolveFieldType', () => {
  it('resolves string field type', () => {
    expect(resolveFieldType(fields.string())).toBe('string');
  });

  it('resolves text field type', () => {
    expect(resolveFieldType(fields.text())).toBe('text');
  });

  it('resolves richtext field type', () => {
    expect(resolveFieldType(fields.richtext())).toBe('richtext');
  });

  it('resolves image field type', () => {
    expect(resolveFieldType(fields.image())).toBe('image');
  });

  it('resolves optional string field type', () => {
    expect(resolveFieldType(fields.string().optional())).toBe('string');
  });

  it('returns null for plain zod schema without field meta', () => {
    expect(resolveFieldType(z.string())).toBeNull();
  });
});

describe('fieldNameToLabel', () => {
  it('converts camelCase to label', () => {
    expect(fieldNameToLabel('firstName')).toBe('First Name');
  });

  it('converts snake_case to label', () => {
    expect(fieldNameToLabel('first_name')).toBe('First name');
  });

  it('capitalizes first letter', () => {
    expect(fieldNameToLabel('title')).toBe('Title');
  });
});

describe('FormGenerator', () => {
  const simpleSchema = z.object({
    title: fields.string().min(1, 'Title is required'),
    description: fields.text(),
  });

  it('renders form with fields from schema', () => {
    render(
      <FormGenerator schema={simpleSchema} onSubmit={() => {}} />
    );

    expect(screen.getByTestId('form-generator')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
  });

  it('renders submit button with default label', () => {
    render(
      <FormGenerator schema={simpleSchema} onSubmit={() => {}} />
    );

    expect(screen.getByTestId('form-submit')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders submit button with custom label', () => {
    render(
      <FormGenerator
        schema={simpleSchema}
        onSubmit={() => {}}
        submitLabel="Save"
      />
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders StringInput for string fields', () => {
    const schema = z.object({
      title: fields.string(),
    });

    render(<FormGenerator schema={schema} onSubmit={() => {}} />);

    const input = screen.getByLabelText(/Title/);
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders TextInput (textarea) for text fields', () => {
    const schema = z.object({
      description: fields.text(),
    });

    render(<FormGenerator schema={schema} onSubmit={() => {}} />);

    const textarea = screen.getByLabelText(/Description/);
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('calls onSubmit with form data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    const schema = z.object({
      title: fields.string(),
    });

    render(
      <FormGenerator
        schema={schema}
        onSubmit={handleSubmit}
        defaultValues={{ title: '' }}
      />
    );

    await user.type(screen.getByLabelText(/Title/), 'Hello');
    await user.click(screen.getByTestId('form-submit'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        { title: 'Hello' },
        expect.anything()
      );
    });
  });

  it('shows validation errors from Zod', async () => {
    const user = userEvent.setup();

    const schema = z.object({
      title: fields.string().min(1, 'Title is required'),
    });

    render(
      <FormGenerator
        schema={schema}
        onSubmit={() => {}}
        defaultValues={{ title: '' }}
      />
    );

    await user.click(screen.getByTestId('form-submit'));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(
      <FormGenerator
        schema={simpleSchema}
        onSubmit={() => {}}
        className="custom-class"
      />
    );

    expect(screen.getByTestId('form-generator')).toHaveClass('custom-class');
  });

  it('uses defaultValues', () => {
    const schema = z.object({
      title: fields.string(),
    });

    render(
      <FormGenerator
        schema={schema}
        onSubmit={() => {}}
        defaultValues={{ title: 'Default Title' }}
      />
    );

    expect(screen.getByLabelText(/Title/)).toHaveValue('Default Title');
  });
});
