import { fields, visibleWhen } from '@structcms/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import {
  FormGenerator,
  fieldNameToLabel,
  resolveFieldMeta,
  resolveFieldType,
} from '../form-generator';

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

  it('resolves file field type', () => {
    expect(resolveFieldType(fields.file())).toBe('file');
  });

  it('resolves optional string field type', () => {
    expect(resolveFieldType(fields.string().optional())).toBe('string');
  });

  it('resolves boolean field type', () => {
    expect(resolveFieldType(fields.boolean())).toBe('boolean');
  });

  it('resolves select field type', () => {
    expect(resolveFieldType(fields.select({ options: ['a', 'b'] as const }))).toBe('select');
  });

  it('resolves url field type', () => {
    expect(resolveFieldType(fields.url())).toBe('url');
  });

  it('returns null for plain zod schema without field meta', () => {
    expect(resolveFieldType(z.string())).toBeNull();
  });
});

describe('resolveFieldMeta', () => {
  it('resolves select metadata with options', () => {
    const meta = resolveFieldMeta(fields.select({ options: ['x', 'y', 'z'] as const }));
    expect(meta?.fieldType).toBe('select');
    expect(meta?.options).toEqual(['x', 'y', 'z']);
  });

  it('resolves select metadata through optional wrapper', () => {
    const meta = resolveFieldMeta(fields.select({ options: ['a', 'b'] as const }).optional());
    expect(meta?.fieldType).toBe('select');
    expect(meta?.options).toEqual(['a', 'b']);
  });

  it('returns null for plain zod schema', () => {
    expect(resolveFieldMeta(z.string())).toBeNull();
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
    render(<FormGenerator schema={simpleSchema} onSubmit={() => {}} />);

    expect(screen.getByTestId('form-generator')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
  });

  it('renders submit button with default label', () => {
    render(<FormGenerator schema={simpleSchema} onSubmit={() => {}} />);

    expect(screen.getByTestId('form-submit')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders submit button with custom label', () => {
    render(<FormGenerator schema={simpleSchema} onSubmit={() => {}} submitLabel="Save" />);

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

    render(<FormGenerator schema={schema} onSubmit={handleSubmit} defaultValues={{ title: '' }} />);

    await user.type(screen.getByLabelText(/Title/), 'Hello');
    await user.click(screen.getByTestId('form-submit'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ title: 'Hello' }, expect.anything());
    });
  });

  it('shows validation errors from Zod', async () => {
    const user = userEvent.setup();

    const schema = z.object({
      title: fields.string().min(1, 'Title is required'),
    });

    render(<FormGenerator schema={schema} onSubmit={() => {}} defaultValues={{ title: '' }} />);

    await user.click(screen.getByTestId('form-submit'));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(<FormGenerator schema={simpleSchema} onSubmit={() => {}} className="custom-class" />);

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

  it('renders ArrayField for array field types', () => {
    const schema = z.object({
      tags: fields.array(z.string()),
    });

    render(
      <FormGenerator
        schema={schema}
        onSubmit={() => {}}
        defaultValues={{ tags: ['tag1', 'tag2'] }}
      />
    );

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByTestId('array-field')).toBeInTheDocument();
  });

  it('renders BooleanInput for boolean fields', () => {
    const schema = z.object({
      active: fields.boolean(),
    });

    render(<FormGenerator schema={schema} onSubmit={() => {}} defaultValues={{ active: false }} />);

    expect(screen.getByTestId('boolean-input')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders SelectInput with radio for select fields with ≤ 3 options', () => {
    const schema = z.object({
      mode: fields.select({ options: ['static', 'overlay'] as const }),
    });

    render(
      <FormGenerator schema={schema} onSubmit={() => {}} defaultValues={{ mode: 'static' }} />
    );

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByText('Mode')).toBeInTheDocument();
  });

  it('renders SelectInput with dropdown for select fields with > 3 options', () => {
    const schema = z.object({
      color: fields.select({ options: ['red', 'green', 'blue', 'yellow'] as const }),
    });

    render(<FormGenerator schema={schema} onSubmit={() => {}} defaultValues={{ color: 'red' }} />);

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
    expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
  });

  it('renders FilePicker for file fields', () => {
    const schema = z.object({
      document: fields.file(),
    });

    render(<FormGenerator schema={schema} onSubmit={() => {}} defaultValues={{ document: '' }} />);

    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('No file selected')).toBeInTheDocument();
    expect(screen.getByText('Browse Files')).toBeInTheDocument();
  });

  it('renders ObjectField for object field types', () => {
    const schema = z.object({
      address: fields.object({
        street: z.string(),
        city: z.string(),
      }),
    });

    render(
      <FormGenerator
        schema={schema}
        onSubmit={() => {}}
        defaultValues={{ address: { street: '', city: '' } }}
      />
    );

    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByTestId('object-field-container')).toBeInTheDocument();
    expect(screen.getByLabelText(/Street/)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/)).toBeInTheDocument();
  });

  it('renders UrlInput for url fields', () => {
    const schema = z.object({
      website: fields.url(),
    });
    render(<FormGenerator schema={schema} onSubmit={() => {}} defaultValues={{ website: '' }} />);
    const input = screen.getByLabelText(/Website/);
    expect(input).toHaveAttribute('type', 'url');
    expect(input).toHaveAttribute('placeholder', 'https://...');
  });

  it('hides fields when visibleWhen condition is not met', () => {
    const schema = z.object({
      variant: fields.select({ options: ['static', 'overlay'] as const }),
      overlayColor: visibleWhen(
        fields.select({ options: ['teal', 'petrol', 'none'] as const }),
        'variant',
        'overlay'
      ),
    });
    render(
      <FormGenerator
        schema={schema}
        onSubmit={() => {}}
        defaultValues={{ variant: 'static', overlayColor: 'teal' }}
      />
    );
    expect(screen.getByText('Variant')).toBeInTheDocument();
    expect(screen.queryByText('Overlay Color')).not.toBeInTheDocument();
  });

  it('shows fields when visibleWhen condition is met', () => {
    const schema = z.object({
      variant: fields.select({ options: ['static', 'overlay'] as const }),
      overlayColor: visibleWhen(
        fields.select({ options: ['teal', 'petrol', 'none'] as const }),
        'variant',
        'overlay'
      ),
    });
    render(
      <FormGenerator
        schema={schema}
        onSubmit={() => {}}
        defaultValues={{ variant: 'overlay', overlayColor: 'teal' }}
      />
    );
    expect(screen.getByText('Variant')).toBeInTheDocument();
    expect(screen.getByText('Overlay Color')).toBeInTheDocument();
  });
});
