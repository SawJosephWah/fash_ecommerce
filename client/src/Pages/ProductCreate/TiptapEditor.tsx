"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List } from 'lucide-react'
import { useEffect } from 'react';

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        // Applying your minimalist styling to the editable area
        class: "min-h-[150px] w-full bg-transparent py-3 focus:outline-none prose prose-sm max-w-none text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    // Only update if the content is actually different to avoid cursor jumping
    const isSame = editor.getHTML() === value;

    // If value is empty string (form reset), or external change occurs
    if (!isSame) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border-b border-zinc-200 focus-within:border-black transition-all">
      {/* TOOLBAR */}
      <div className="flex gap-1 pb-2 border-b border-zinc-100 mb-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={14} />
        </ToolbarButton>
      </div>

      {/* EDITOR AREA */}
      <EditorContent editor={editor} />
    </div>
  );
};

// Internal Helper for Toolbar Styling
const ToolbarButton = ({ children, onClick, active }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 transition-colors ${active ? 'bg-black text-white' : 'text-zinc-400 hover:text-black'}`}
  >
    {children}
  </button>
);

export default TiptapEditor;