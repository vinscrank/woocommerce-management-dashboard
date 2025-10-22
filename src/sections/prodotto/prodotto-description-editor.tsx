import { Box, Typography } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';

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
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <Editor
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
      />
    </Box>
  );
}
