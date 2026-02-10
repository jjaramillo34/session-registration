'use client';

import DOMPurify from 'isomorphic-dompurify';

interface RichTextContentProps {
  html: string;
  className?: string;
}

/** Renders sanitized HTML from the WYSIWYG editor (headings, lists, bold, links, etc.). */
export default function RichTextContent({ html, className = '' }: RichTextContentProps) {
  if (!html?.trim()) return null;

  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
