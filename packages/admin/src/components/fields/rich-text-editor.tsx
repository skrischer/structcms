'use client';

import Link from '@tiptap/extension-link';
import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { FieldMessage } from '../ui/field-message';
import { Label } from '../ui/label';

export interface RichTextEditorProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  allowedBlocks?: readonly string[];
}

/**
 * Checks if a block type is allowed based on the allowedBlocks configuration.
 * When allowedBlocks is undefined or empty, all blocks are allowed.
 * The 'list' shorthand allows both 'bulletList' and 'orderedList'.
 */
function isBlockAllowed(blockName: string, allowedBlocks?: readonly string[]): boolean {
  if (!allowedBlocks || allowedBlocks.length === 0) return true;
  return allowedBlocks.includes(blockName);
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'px-2 py-1 text-sm rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed',
        isActive && 'bg-accent text-accent-foreground'
      )}
    >
      {children}
    </button>
  );
}

function InlineButtons({
  editor,
  allowedBlocks,
  setLink,
}: {
  editor: Editor;
  allowedBlocks?: readonly string[];
  setLink: () => void;
}) {
  const showBold = isBlockAllowed('bold', allowedBlocks);
  const showItalic = isBlockAllowed('italic', allowedBlocks);
  const showLink = isBlockAllowed('link', allowedBlocks);
  return (
    <>
      {showBold && (
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
      )}
      {showItalic && (
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
      )}
      {showLink && (
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
          Link
        </ToolbarButton>
      )}
    </>
  );
}

function HeadingButtons({
  editor,
  allowedBlocks,
}: {
  editor: Editor;
  allowedBlocks?: readonly string[];
}) {
  const showH1 = isBlockAllowed('heading1', allowedBlocks);
  const showH2 = isBlockAllowed('heading2', allowedBlocks);
  const showH3 = isBlockAllowed('heading3', allowedBlocks);
  return (
    <>
      {showH1 && (
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
      )}
      {showH2 && (
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
      )}
      {showH3 && (
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
      )}
    </>
  );
}

function ListButtons({
  editor,
  allowedBlocks,
}: {
  editor: Editor;
  allowedBlocks?: readonly string[];
}) {
  const showBulletList =
    isBlockAllowed('bulletList', allowedBlocks) || isBlockAllowed('list', allowedBlocks);
  const showOrderedList =
    isBlockAllowed('orderedList', allowedBlocks) || isBlockAllowed('list', allowedBlocks);
  return (
    <>
      {showBulletList && (
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          &bull;
        </ToolbarButton>
      )}
      {showOrderedList && (
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          1.
        </ToolbarButton>
      )}
    </>
  );
}

interface ToolbarProps {
  editor: Editor;
  allowedBlocks?: readonly string[];
  setLink: () => void;
}

function Toolbar({ editor, allowedBlocks, setLink }: ToolbarProps) {
  const hasInlineButtons =
    isBlockAllowed('bold', allowedBlocks) ||
    isBlockAllowed('italic', allowedBlocks) ||
    isBlockAllowed('link', allowedBlocks);
  const hasHeadingButtons =
    isBlockAllowed('heading1', allowedBlocks) ||
    isBlockAllowed('heading2', allowedBlocks) ||
    isBlockAllowed('heading3', allowedBlocks);
  const hasListButtons =
    isBlockAllowed('bulletList', allowedBlocks) ||
    isBlockAllowed('orderedList', allowedBlocks) ||
    isBlockAllowed('list', allowedBlocks);

  return (
    <div className="flex flex-wrap gap-0.5 border-b border-input py-1.5 px-2">
      <InlineButtons editor={editor} allowedBlocks={allowedBlocks} setLink={setLink} />
      {hasInlineButtons && hasHeadingButtons && <div className="w-px bg-border mx-1" />}
      <HeadingButtons editor={editor} allowedBlocks={allowedBlocks} />
      {(hasInlineButtons || hasHeadingButtons) && hasListButtons && (
        <div className="w-px bg-border mx-1" />
      )}
      <ListButtons editor={editor} allowedBlocks={allowedBlocks} />
    </div>
  );
}

/**
 * WYSIWYG editor for richtext fields using TipTap.
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   label="Content"
 *   value={content}
 *   onChange={setContent}
 *   required
 *   error={errors.content?.message}
 * />
 * ```
 */
function RichTextEditor({
  label,
  value = '',
  onChange,
  error,
  description,
  required,
  placeholder,
  className,
  id,
  name,
  allowedBlocks,
}: RichTextEditorProps) {
  const inputId = id || name || React.useId();
  const messageId = error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined;

  // Determine allowed heading levels based on allowedBlocks
  const headingLevels = React.useMemo(() => {
    if (!allowedBlocks || allowedBlocks.length === 0) return [1, 2, 3] as const;
    const levels: (1 | 2 | 3)[] = [];
    if (allowedBlocks.includes('heading1')) levels.push(1);
    if (allowedBlocks.includes('heading2')) levels.push(2);
    if (allowedBlocks.includes('heading3')) levels.push(3);
    return levels.length > 0 ? levels : ([1, 2, 3] as const);
  }, [allowedBlocks]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: headingLevels as (1 | 2 | 3 | 4 | 5 | 6)[],
        },
      }),
      Link.extend({ name: 'customLink' }).configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[120px] py-3 px-4 focus:outline-none',
        'aria-invalid': error ? 'true' : 'false',
        ...(messageId ? { 'aria-describedby': messageId } : {}),
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      onChange?.(updatedEditor.getHTML());
    },
  });

  const setLink = React.useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div
        className={cn(
          'rounded-md border border-input bg-background',
          error && 'border-[var(--admin-error-500)]'
        )}
      >
        <Toolbar editor={editor} allowedBlocks={allowedBlocks} setLink={setLink} />
        <EditorContent editor={editor} id={inputId} data-placeholder={placeholder} />
      </div>
      {description && !error && <FieldMessage id={`${inputId}-desc`}>{description}</FieldMessage>}
      {error && (
        <FieldMessage id={`${inputId}-error`} variant="error">
          {error}
        </FieldMessage>
      )}
    </div>
  );
}

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
