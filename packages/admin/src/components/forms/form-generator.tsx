"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldGroup as FieldGroupType,
  type FieldMeta,
  type FieldType,
  getFieldMeta,
} from "@structcms/core";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import * as React from "react";
import {
  type Control,
  Controller,
  type DefaultValues,
  type FieldError,
  type FieldValues,
  get,
  useFieldArray,
  useForm,
} from "react-hook-form";
import type { z } from "zod";
import { cn } from "../../lib/utils";
import { ArrayField } from "../fields/array-field";
import { BooleanField } from "../fields/boolean-field";
import { FilePicker } from "../fields/file-picker";
import { ImagePicker } from "../fields/image-picker";
import { ObjectField } from "../fields/object-field";
import { RichTextEditor } from "../fields/rich-text-editor";
import { SelectField } from "../fields/select-field";
import { StringField } from "../fields/string-field";
import { TextField } from "../fields/text-field";
import { UrlField } from "../fields/url-field";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field-group";
import { FieldMessage } from "../ui/field-message";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

/**
 * Unwraps Zod wrappers (optional, default, nullable, etc.) to find the inner schema
 */
function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if ("unwrap" in schema && typeof schema.unwrap === "function") {
    return unwrapSchema(schema.unwrap() as z.ZodTypeAny);
  }
  if ("_def" in schema) {
    const def = schema._def as Record<string, unknown>;
    if ("innerType" in def && def.innerType) {
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
 * Resolves the full FieldMeta from a Zod schema by unwrapping wrappers first
 */
function resolveFieldMeta(schema: z.ZodTypeAny): FieldMeta | null {
  const meta = getFieldMeta(schema);
  if (meta) return meta;

  const unwrapped = unwrapSchema(schema);
  return getFieldMeta(unwrapped);
}

/**
 * Converts a camelCase or snake_case field name to a human-readable label
 */
function fieldNameToLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Creates a default object from an inner shape, using field-type-aware defaults
 */
function createDefaultObject(
  innerShape: Record<string, z.ZodTypeAny>,
): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, schema] of Object.entries(innerShape)) {
    const fieldType = resolveFieldType(schema);
    switch (fieldType) {
      case "boolean":
        obj[key] = false;
        break;
      case "select": {
        const meta = resolveFieldMeta(schema);
        obj[key] = meta?.options?.[0] ?? "";
        break;
      }
      default:
        obj[key] = "";
    }
  }
  return obj;
}

interface ObjectArrayFieldProps {
  name: string;
  control: Control<FieldValues>;
  label: string;
  required: boolean;
  error: string | undefined;
  description: string | undefined;
  innerShape: Record<string, z.ZodTypeAny>;
  renderField: (
    fieldName: string,
    fieldSchema: z.ZodTypeAny,
  ) => React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Array-of-objects field using useFieldArray for single state ownership.
 * Replaces the previous ArrayField+Controller approach that had dual write paths.
 */
function ObjectArrayFieldInner(
  {
    name,
    control,
    label,
    required,
    error,
    description,
    innerShape,
    renderField,
    className,
    id,
  }: ObjectArrayFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    fields: arrayFields,
    append,
    remove,
    swap,
  } = useFieldArray({
    control,
    name,
  });

  const generatedId = React.useId();
  const inputId = id || name || generatedId;

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5", className)}
      data-testid="array-field"
    >
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div
        className={cn(
          "rounded-md border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] p-4",
          error && "border-[var(--admin-error-500)]",
        )}
      >
        {arrayFields.length === 0 ? (
          <p className="text-sm text-[var(--admin-gray-500)] text-center py-4">
            No items yet
          </p>
        ) : (
          <div className="space-y-3">
            {arrayFields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-2 items-start p-3 rounded-md border border-[var(--admin-gray-200)] bg-[var(--admin-gray-50)]"
                data-testid={`array-item-${index}`}
              >
                <div className="flex-1">
                  <div
                    className="space-y-3"
                    data-testid={`${name}-object-item-${index}`}
                  >
                    {Object.entries(innerShape).map(([subName, subSchema]) => {
                      const subFieldName = `${name}.${index}.${subName}`;
                      return renderField(subFieldName, subSchema);
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (index > 0) swap(index, index - 1);
                    }}
                    disabled={index === 0}
                    title="Move up"
                    data-testid={`move-up-${index}`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (index < arrayFields.length - 1)
                        swap(index, index + 1);
                    }}
                    disabled={index === arrayFields.length - 1}
                    title="Move down"
                    data-testid={`move-down-${index}`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    title="Remove"
                    data-testid={`remove-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append(createDefaultObject(innerShape) as FieldValues)
            }
            id={inputId}
            data-testid="add-item"
          >
            Add Item
          </Button>
        </div>
      </div>
      {description && !error && (
        <FieldMessage id={`${inputId}-desc`}>{description}</FieldMessage>
      )}
      {error && (
        <FieldMessage id={`${inputId}-error`} variant="error">
          {error}
        </FieldMessage>
      )}
    </div>
  );
}

const ObjectArrayField = React.forwardRef(ObjectArrayFieldInner);

export interface FormGeneratorProps<T extends z.ZodObject<z.ZodRawShape>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  onChange?: (data: z.infer<T>) => void;
  defaultValues?: DefaultValues<z.infer<T>>;
  submitLabel?: string;
  className?: string;
  descriptions?: Partial<Record<string, string>>;
  groups?: Array<FieldGroupType>;
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
  submitLabel = "Submit",
  className,
  descriptions,
  groups,
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

  // Get all current form values for conditional visibility checks in renderField.
  // This avoids calling watch() inside renderField which would violate Rules of Hooks.
  const watchedValues = watch();

  React.useEffect(() => {
    if (!onChange) return;
    const subscription = watch((values) => {
      onChange(values as z.infer<T>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const shape = schema.shape as Record<string, z.ZodTypeAny>;

  const getErrorMessage = (fieldName: string): string | undefined =>
    (get(errors, fieldName) as FieldError | undefined)?.message;

  /**
   * Extracts the item schema from a ZodArray
   */
  const getArrayItemSchema = (
    fieldSchema: z.ZodTypeAny,
  ): z.ZodTypeAny | null => {
    const unwrapped = unwrapSchema(fieldSchema);
    const def = unwrapped._def as Record<string, unknown>;
    if ("type" in def && def.type) {
      return def.type as z.ZodTypeAny;
    }
    return null;
  };

  const renderField = (
    fieldName: string,
    fieldSchema: z.ZodTypeAny,
  ): React.ReactNode => {
    const fieldType = resolveFieldType(fieldSchema);
    const fieldMeta = resolveFieldMeta(fieldSchema);
    const leafName = fieldName.includes(".")
      ? (fieldName.split(".").pop() as string)
      : fieldName;
    const label = fieldNameToLabel(leafName);
    const isRequired = !fieldSchema.isOptional();
    const errorMessage = getErrorMessage(fieldName);
    const description = descriptions?.[fieldName];

    // Conditional visibility
    if (fieldMeta?.visibleWhen) {
      const watchedValue =
        watchedValues[
          fieldMeta.visibleWhen.field as keyof typeof watchedValues
        ];
      const matches = fieldMeta.visibleWhen.values.some(
        (v) => v === watchedValue,
      );
      if (!matches) return null;
    }

    // Wraps rendered field with a visibility hint when visibleWhen is present
    const wrapWithHint = (element: React.ReactNode): React.ReactNode => {
      if (!fieldMeta?.visibleWhen) return element;
      return (
        <div key={fieldName} className="flex flex-col gap-1">
          <p className="text-[11px] italic text-[var(--admin-gray-400)]">
            Visible when {fieldNameToLabel(fieldMeta.visibleWhen.field)} is{" "}
            {fieldMeta.visibleWhen.values.map(String).join(" or ")}
          </p>
          {element}
        </div>
      );
    };

    switch (fieldType) {
      case "string":
        return wrapWithHint(
          <StringField
            key={fieldName}
            label={label}
            required={isRequired}
            error={errorMessage}
            description={description}
            {...register(fieldName as Parameters<typeof register>[0])}
          />,
        );

      case "text":
        return wrapWithHint(
          <TextField
            key={fieldName}
            label={label}
            required={isRequired}
            error={errorMessage}
            description={description}
            {...register(fieldName as Parameters<typeof register>[0])}
          />,
        );

      case "richtext": {
        const meta = resolveFieldMeta(fieldSchema);
        return wrapWithHint(
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label={label}
                required={isRequired}
                error={errorMessage}
                description={description}
                value={field.value as string | undefined}
                onChange={field.onChange}
                name={field.name}
                allowedBlocks={meta?.allowedBlocks}
              />
            )}
          />,
        );
      }

      case "image":
        return wrapWithHint(
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <ImagePicker
                label={label}
                required={isRequired}
                error={errorMessage}
                description={description}
                value={field.value as string | undefined}
                onChange={field.onChange}
                name={field.name}
              />
            )}
          />,
        );

      case "file":
        return wrapWithHint(
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <FilePicker
                label={label}
                required={isRequired}
                error={errorMessage}
                description={description}
                value={field.value as string | undefined}
                onChange={field.onChange}
                name={field.name}
              />
            )}
          />,
        );

      case "url":
        return wrapWithHint(
          <UrlField
            key={fieldName}
            label={label}
            required={isRequired}
            error={errorMessage}
            description={description}
            {...register(fieldName as Parameters<typeof register>[0])}
          />,
        );

      case "array": {
        const itemSchema = getArrayItemSchema(fieldSchema);
        const unwrappedItem = itemSchema ? unwrapSchema(itemSchema) : null;
        const itemFieldType = unwrappedItem
          ? resolveFieldType(unwrappedItem)
          : null;

        if (itemFieldType === "object" && unwrappedItem) {
          // Array of objects — use ObjectArrayField with useFieldArray
          const innerShape =
            "shape" in unwrappedItem
              ? ((unwrappedItem as z.ZodObject<z.ZodRawShape>).shape as Record<
                  string,
                  z.ZodTypeAny
                >)
              : null;

          if (!innerShape) return null;

          return wrapWithHint(
            <ObjectArrayField
              key={fieldName}
              name={fieldName}
              control={control as Control<FieldValues>}
              label={label}
              required={isRequired}
              error={errorMessage}
              description={description}
              innerShape={innerShape}
              renderField={renderField}
            />,
          );
        }

        // Array of primitives — existing behavior
        return wrapWithHint(
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <ArrayField<string>
                label={label}
                required={isRequired}
                error={errorMessage}
                description={description}
                value={(field.value as string[] | undefined) ?? []}
                onChange={field.onChange}
                name={field.name}
                createDefaultItem={() => ""}
                renderItem={(item, index, onItemChange) => (
                  <Input
                    value={item}
                    onChange={(e) => onItemChange(e.target.value)}
                    data-testid={`${fieldName}-item-${index}`}
                  />
                )}
              />
            )}
          />,
        );
      }

      case "boolean":
        return wrapWithHint(
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <BooleanField
                label={label}
                required={isRequired}
                error={errorMessage}
                description={description}
                checked={!!field.value}
                onCheckedChange={field.onChange}
                name={field.name}
              />
            )}
          />,
        );

      case "select": {
        const meta = resolveFieldMeta(fieldSchema);
        const options = meta?.options ?? [];
        return wrapWithHint(
          <Controller
            key={fieldName}
            name={fieldName as Parameters<typeof register>[0]}
            control={control}
            render={({ field }) => (
              <SelectField
                label={label}
                required={isRequired}
                error={errorMessage}
                description={description}
                options={options}
                value={field.value as string | undefined}
                onChange={field.onChange}
                name={field.name}
              />
            )}
          />,
        );
      }

      case "object": {
        const innerSchema = unwrapSchema(fieldSchema);
        const innerShape =
          "shape" in innerSchema
            ? ((innerSchema as z.ZodObject<z.ZodRawShape>).shape as Record<
                string,
                z.ZodTypeAny
              >)
            : null;

        return wrapWithHint(
          <ObjectField
            key={fieldName}
            label={label}
            required={isRequired}
            error={errorMessage}
            description={description}
          >
            {innerShape
              ? Object.entries(innerShape).map(([subName, subSchema]) =>
                  renderField(`${fieldName}.${subName}`, subSchema),
                )
              : null}
          </ObjectField>,
        );
      }

      default:
        return wrapWithHint(
          <StringField
            key={fieldName}
            label={label}
            required={isRequired}
            error={errorMessage}
            description={description}
            {...register(fieldName as Parameters<typeof register>[0])}
          />,
        );
    }
  };

  const renderFields = () => {
    if (!groups || groups.length === 0) {
      return Object.entries(shape).map(([fieldName, fieldSchema]) =>
        renderField(fieldName, fieldSchema),
      );
    }

    const groupedFieldNames = new Set(groups.flatMap((g) => g.fields));
    const ungroupedFields = Object.keys(shape).filter(
      (name) => !groupedFieldNames.has(name),
    );

    return (
      <>
        {groups.map((group, i) => (
          <React.Fragment key={group.name}>
            {i > 0 && (
              <hr className="border-[var(--admin-gray-200)] border-t" />
            )}
            <FieldGroup
              label={group.name}
              className="px-5 py-5"
              data-testid={`field-group-${group.name}`}
            >
              {group.description && (
                <FieldMessage>{group.description}</FieldMessage>
              )}
              {group.fields.map((fieldName) => {
                const fieldSchema = shape[fieldName];
                if (!fieldSchema) return null;
                return renderField(fieldName, fieldSchema);
              })}
            </FieldGroup>
          </React.Fragment>
        ))}
        {ungroupedFields.map((fieldName) => {
          const fieldSchema = shape[fieldName];
          if (!fieldSchema) return null;
          return renderField(fieldName, fieldSchema);
        })}
      </>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
      data-testid="form-generator"
    >
      {renderFields()}
      {!onChange && (
        <div className="flex items-center justify-end rounded-b-lg bg-[var(--admin-gray-50)] px-5 py-4 -mx-[1px] -mb-[1px]">
          <Button type="submit" data-testid="form-submit">
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}

FormGenerator.displayName = "FormGenerator";

export { FormGenerator, resolveFieldType, resolveFieldMeta, fieldNameToLabel };
