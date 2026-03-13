'use client';

import Link from '@tiptap/extension-link';
import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';

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

interface ToolbarProps {
  editor: Editor;
  allowedBlocks?: readonly string[];
  setLink: () => void;
}

function Toolbar({ editor, allowedBlocks, setLink }: ToolbarProps) {
  const showBold = isBlockAllowed('bold', allowedBlocks);
  const showItalic = isBlockAllowed('italic', allowedBlocks);
  const showLink = isBlockAllowed('link', allowedBlocks);
  const showH1 = isBlockAllowed('heading1', allowedBlocks);
  const showH2 = isBlockAllowed('heading2', allowedBlocks);
  const showH3 = isBlockAllowed('heading3', allowedBlocks);
  const showBulletList = isBlockAllowed('bulletList', allowedBlocks) || isBlockAllowed('list', allowedBlocks);
  const showOrderedList = isBlockAllowed('orderedList', allowedBlocks) || isBlockAllowed('list', allowedBlocks);

  const hasInlineButtons = showBold || showItalic || showLink;
  const hasHeadingButtons = showH1 || showH2 || showH3;
  const hasListButtons = showBulletList || showOrderedList;

  return (
    <div className="flex flex-wrap gap-1 border-b border-input p-2">
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
      {hasInlineButtons && hasHeadingButtons && <div className="w-px bg-border mx-1" />}
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
      {(hasInlineButtons || hasHeadingButtons) && hasListButtons && <div className="w-px bg-border mx-1" />}
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
  required,
  placeholder,
  className,
  id,
  name,
  allowedBlocks,
}: RichTextEditorProps) {
  const inputId = id || name || React.useId();

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
        class: 'prose prose-sm max-w-none min-h-[150px] p-3 focus:outline-none',
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
        <Toolbar editor={editor} allowedBlocks={allowedBlocks} setLink={setLink} />
        <EditorContent editor={editor} id={inputId} data-placeholder={placeholder} />
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
