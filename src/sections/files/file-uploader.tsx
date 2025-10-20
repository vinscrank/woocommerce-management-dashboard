import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import { Iconify } from 'src/components/iconify';
import { useUploadFiles } from 'src/hooks/useUploadFiles';

const DropZoneStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(5),
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const { uploadFiles, isUploading } = useUploadFiles({
    onSuccess: () => {
      onUploadSuccess();
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (files) => {
      await uploadFiles(files);
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5242880, // 5MB
    multiple: true, // Permette la selezione di più file
  });

  return (
    <Box>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && {
            borderColor: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
          ...(isUploading && {
            pointerEvents: 'none',
            opacity: 0.6,
          }),
        }}
      >
        <input {...getInputProps()} disabled={isUploading} />

        <Box sx={{ textAlign: 'center' }}>
          {isUploading ? (
            <>
              <CircularProgress size={56} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Caricamento in corso...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Attendere il completamento dell'upload
              </Typography>
            </>
          ) : (
            <>
              <Iconify
                icon="eva:cloud-upload-fill"
                sx={{ width: 56, height: 56, mb: 2, color: 'primary.main' }}
              />

              <Typography variant="h6" gutterBottom>
                Trascina i file qui o clicca per selezionarli
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Puoi caricare più file contemporaneamente (max 5MB ciascuno)
              </Typography>
            </>
          )}
        </Box>
      </DropZoneStyle>
    </Box>
  );
}
