'use client';

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

export interface RichTextEditorProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: ToolbarButtonProps) {
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
  required,
  placeholder,
  className,
  id,
  name,
}: RichTextEditorProps) {
  const inputId = id || name || React.useId();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
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
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[150px] p-3 focus:outline-none',
        'aria-invalid': error ? 'true' : 'false',
        ...(error ? { 'aria-describedby': `${inputId}-error` } : {}),
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
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div
        className={cn(
          'rounded-md border border-input bg-background',
          error && 'border-destructive'
        )}
      >
        <div className="flex flex-wrap gap-1 border-b border-input p-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            title="Bold"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Link"
          >
            🔗
          </ToolbarButton>
          <div className="w-px bg-border mx-1" />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>
          <div className="w-px bg-border mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            •
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            1.
          </ToolbarButton>
        </div>
        <EditorContent
          editor={editor}
          id={inputId}
          data-placeholder={placeholder}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
