'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldType, getFieldMeta } from '@structcms/core';
import * as React from 'react';
import { Controller, type DefaultValues, type FieldErrors, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { ArrayField } from '../components/inputs/array-field';
import { ImagePicker } from '../components/inputs/image-picker';
import { ObjectField } from '../components/inputs/object-field';
import { RichTextEditor } from '../components/inputs/rich-text-editor';
import { StringInput } from '../components/inputs/string-input';
import { TextInput } from '../components/inputs/text-input';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { cn } from './utils';

/**
 * Unwraps Zod wrappers (optional, default, nullable, etc.) to find the inner schema
 */
function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if ('unwrap' in schema && typeof schema.unwrap === 'function') {
    return unwrapSchema(schema.unwrap() as z.ZodTypeAny);
  }
  if ('_def' in schema) {
    const def = schema._def as Record<string, unknown>;
    if ('innerType' in def && def.innerType) {
      return unwrapSchema(def.innerType as z.ZodTypeAny);
    }
  }
  return schema;
}

/**
 * Resolves the FieldType from a Zod schema by unwrapping wrappers first
 */
function resolveFieldType(schema: z.ZodTypeAny): FieldType | null {
  const meta = getFieldMeta(schema);
  if (meta) return meta.fieldType;

  const unwrapped = unwrapSchema(schema);
  const unwrappedMeta = getFieldMeta(unwrapped);
  return unwrappedMeta?.fieldType ?? null;
}

/**
 * Converts a camelCase or snake_case field name to a human-readable label
 */
function fieldNameToLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

export interface FormGeneratorProps<T extends z.ZodObject<z.ZodRawShape>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  onChange?: (data: z.infer<T>) => void;
  defaultValues?: DefaultValues<z.infer<T>>;
  submitLabel?: string;
  className?: string;
}

/**
 * Generates a React Hook Form from a Zod schema, mapping field types to input components.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   title: fields.string().min(1),
 *   description: fields.text(),
 *   content: fields.richtext(),
 * });
 *
 * <FormGenerator
 *   schema={schema}
 *   onSubmit={(data) => console.log(data)}
 *   submitLabel="Save"
 * />
 * ```
 */
function FormGenerator<T extends z.ZodObject<z.ZodRawShape>>({
  schema,
  onSubmit,
  onChange,
  defaultValues,
  submitLabel = 'Submit',
  className,
}: FormGeneratorProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  React.useEffect(() => {
    if (!onChange) return;
    const subscription = watch((values) => {
      onChange(values as z.infer<T>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const shape = schema.shape as Record<string, z.ZodTypeAny>;

  const renderField = (fieldName: string, fieldSchema: z.ZodTypeAny) => {
    const fieldType = resolveFieldType(fieldSchema);
    const label = fieldNameToLabel(fieldName);
    const isRequired = !fieldSchema.isOptional();
    const fieldError = (errors as FieldErrors<Record<string, unknown>>)[fieldName];
    const errorMessage = fieldError?.message as string | undefined;

    switch (fieldType) {
      case 'string':
        return (
          <StringInput
            key={fieldName}
            label={label}
            required={isRequired}
            error={errorMessage}
            {...register(fieldName as Parameters<typeof register>[0])}
          />
        );

      case 'text':
        return (
          <TextInput
            key={fieldName}
            label={label}
            required={isRequired}
            error={errorMessage}
            {...register(fieldName as Parameters<typeof register>[0])}
          />
        );

      case 'richtext':
        return (
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label={label}
                required={isRequired}
                error={errorMessage}
                value={field.value as string | undefined}
                onChange={field.onChange}
                name={field.name}
              />
            )}
          />
        );

      case 'image':
        return (
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <ImagePicker
                label={label}
                required={isRequired}
                error={errorMessage}
                value={field.value as string | undefined}
                onChange={field.onChange}
                name={field.name}
              />
            )}
          />
        );

      case 'array':
        return (
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <ArrayField<string>
                label={label}
                required={isRequired}
                error={errorMessage}
                value={(field.value as string[] | undefined) ?? []}
                onChange={field.onChange}
                name={field.name}
                createDefaultItem={() => ''}
                renderItem={(item, index, onItemChange) => (
                  <Input
                    value={item}
                    onChange={(e) => onItemChange(e.target.value)}
                    data-testid={`${fieldName}-item-${index}`}
                  />
                )}
              />
            )}
          />
        );

      case 'object': {
        const innerSchema = unwrapSchema(fieldSchema);
        const innerShape =
          'shape' in innerSchema
            ? ((innerSchema as z.ZodObject<z.ZodRawShape>).shape as Record<string, z.ZodTypeAny>)
            : null;

        return (
          <ObjectField key={fieldName} label={label} required={isRequired} error={errorMessage}>
            {innerShape
              ? Object.entries(innerShape).map(([subName, _subSchema]) => {
                  const subFieldName = `${fieldName}.${subName}`;
                  const subLabel = fieldNameToLabel(subName);
                  const subError = (errors as FieldErrors<Record<string, unknown>>)[fieldName] as
                    | FieldErrors<Record<string, unknown>>
                    | undefined;
                  const subErrorMessage = subError?.[subName]?.message as string | undefined;

                  return (
                    <StringInput
                      key={subFieldName}
                      label={subLabel}
                      error={subErrorMessage}
                      {...register(subFieldName as Parameters<typeof register>[0])}
                    />
                  );
                })
              : null}
          </ObjectField>
        );
      }

      default:
        return (
          <StringInput
            key={fieldName}
            label={label}
            required={isRequired}
            error={errorMessage}
            {...register(fieldName as Parameters<typeof register>[0])}
          />
        );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
      data-testid="form-generator"
    >
      {Object.entries(shape).map(([fieldName, fieldSchema]) => renderField(fieldName, fieldSchema))}
      {!onChange && (
        <Button type="submit" data-testid="form-submit">
          {submitLabel}
        </Button>
      )}
    </form>
  );
}

FormGenerator.displayName = 'FormGenerator';

export { FormGenerator, resolveFieldType, fieldNameToLabel };
