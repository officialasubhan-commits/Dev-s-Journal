"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SmartEditor({ 
  initialContent = "", 
  value, 
  onChange,
  name
}: { 
  initialContent?: string; 
  value?: string; 
  onChange?: (val: string) => void;
  name?: string;
}) {
  const isControlled = value !== undefined;
  const [htmlContent, setHtmlContent] = useState(isControlled ? value : initialContent);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your content here...',
      }),
    ],
    content: isControlled ? value : initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      if (onChange) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // Update editor content if controlled value changes externally, while avoiding infinite loops
  useEffect(() => {
    if (isControlled && value !== htmlContent) {
      setHtmlContent(value || "");
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value || "");
      }
    }
  }, [value, editor, isControlled, htmlContent]);

  if (!editor) return null;

  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--background)] overflow-hidden flex flex-col">
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border-color)] p-2 bg-[var(--card)]">
        <Button 
          type="button" 
          size="sm" 
          variant={editor.isActive('bold') ? 'default' : 'outline'} 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant={editor.isActive('italic') ? 'default' : 'outline'} 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-[var(--border-color)] mx-1" />
        <Button 
          type="button" 
          size="sm" 
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'} 
          className="h-8 w-8 p-0 font-bold"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'} 
          className="h-8 w-8 p-0 font-bold"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <div className="w-px h-6 bg-[var(--border-color)] mx-1" />
        <Button 
          type="button" 
          size="sm" 
          variant={editor.isActive('bulletList') ? 'default' : 'outline'} 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant={editor.isActive('orderedList') ? 'default' : 'outline'} 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant={editor.isActive('blockquote') ? 'default' : 'outline'} 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="flex-1 overflow-y-auto bg-transparent" />
      {name && <input type="hidden" name={name} value={htmlContent} />}
    </div>
  );
}
