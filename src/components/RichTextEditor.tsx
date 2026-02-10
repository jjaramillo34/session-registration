'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useMemo } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const buttonClass =
    'p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50';

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-gray-300 dark:border-gray-600 border-b-0 rounded-t-lg bg-gray-50 dark:bg-gray-800">
      <select
        className={buttonClass + ' text-sm min-w-0'}
        value=""
        onChange={(e) => {
          const v = e.target.value;
          if (v === 'p') editor.chain().focus().setParagraph().run();
          else if (v === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
          else if (v === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
          else if (v === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
          e.target.value = '';
        }}
      >
        <option value="">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      <button
        type="button"
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        • List
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
      >
        1. List
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        “
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => {
          const url = window.prompt('URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        title="Link"
      >
        Link
      </button>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write description...',
  className = '',
  required,
}: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const lastEmittedRef = useRef(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: useMemo(
      () => [
        StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
        }),
        Placeholder.configure({ placeholder }),
      ],
      [placeholder]
    ),
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedRef.current = html;
      onChangeRef.current(html);
    },
  });

  // Sync external value (e.g. after loading crawl) into editor; skip when value came from us
  useEffect(() => {
    if (!editor) return;
    if (value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    editor.commands.setContent(value || '', false);
  }, [editor, value]);

  return (
    <div className={`rich-text-editor ${className}`.trim()}>
      <Toolbar editor={editor} />
      <div className="border border-gray-300 dark:border-gray-600 rounded-b-lg bg-white dark:bg-gray-700">
        <EditorContent editor={editor} />
      </div>
      {required && !value.trim() && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">Description is required.</p>
      )}
    </div>
  );
}
