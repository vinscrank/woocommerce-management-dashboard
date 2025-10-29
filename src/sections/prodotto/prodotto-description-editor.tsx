import { Box, Typography } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useEffect } from 'react';
import './tiptap-styles.css';

interface ProdottoDescriptionEditorProps {
  label: string;
  value: string;
  onChange: (content: string) => void;
  height?: number;
  menubar?: boolean;
}

export function ProdottoDescriptionEditor({
  label,
  value,
  onChange,
  height = 300,
  menubar = false,
}: ProdottoDescriptionEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: `min-height: ${height}px; padding: 12px;`,
      },
    },
  });

  // Aggiorna il contenuto quando value cambia esternamente
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      {/* <Editor
        apiKey="fjpuvxdvvk5cjofpllcst021237wbuo6hls9sibgghcqszuc"
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | table | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      /> */}
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          '& .tiptap': {
            minHeight: `${height}px`,
            padding: '12px',
            '&:focus': {
              outline: 'none',
            },
            '& p.is-editor-empty:first-child::before': {
              color: '#adb5bd',
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
          },
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            borderBottom: '1px solid #e0e0e0',
            padding: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            backgroundColor: '#f5f5f5',
          }}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('bold') ? '#1976d2' : '#fff',
              color: editor.isActive('bold') ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('italic') ? '#1976d2' : '#fff',
              color: editor.isActive('italic') ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('underline') ? '#1976d2' : '#fff',
              color: editor.isActive('underline') ? '#fff' : '#000',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            U
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('strike') ? '#1976d2' : '#fff',
              color: editor.isActive('strike') ? '#fff' : '#000',
              cursor: 'pointer',
              textDecoration: 'line-through',
            }}
          >
            S
          </button>
          <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 4px' }} />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('heading', { level: 1 }) ? '#1976d2' : '#fff',
              color: editor.isActive('heading', { level: 1 }) ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('heading', { level: 2 }) ? '#1976d2' : '#fff',
              color: editor.isActive('heading', { level: 2 }) ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('heading', { level: 3 }) ? '#1976d2' : '#fff',
              color: editor.isActive('heading', { level: 3 }) ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            H3
          </button>
          <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 4px' }} />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('bulletList') ? '#1976d2' : '#fff',
              color: editor.isActive('bulletList') ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('orderedList') ? '#1976d2' : '#fff',
              color: editor.isActive('orderedList') ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            1.
          </button>
          <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 4px' }} />
          <button
            type="button"
            onClick={() => {
              const url = window.prompt('Inserisci URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: editor.isActive('link') ? '#1976d2' : '#fff',
              color: editor.isActive('link') ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            🔗
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt('Inserisci URL immagine:');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
              cursor: 'pointer',
            }}
          >
            🖼️
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
              cursor: 'pointer',
            }}
          >
            ⧉
          </button>
          <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 4px' }} />
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
              cursor: 'pointer',
            }}
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
              cursor: 'pointer',
            }}
          >
            ↷
          </button>
        </Box>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
