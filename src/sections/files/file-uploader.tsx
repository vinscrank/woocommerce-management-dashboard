import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import { Iconify } from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';
import { useQueryClient } from '@tanstack/react-query';

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
    const queryClient = useQueryClient();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (files) => {

            try {
                const formData = new FormData();
                files.forEach((file, index) => {
                    formData.append('files_upload[]', file);
                });

                const { data } = await axiosInstance.post('/file/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    params: {
                        return_type: 'url'
                    }
                });

               

                queryClient.invalidateQueries({ queryKey: ['files'] });

                onUploadSuccess();
            } catch (error) {
                console.error('Errore durante il caricamento:', error);
            }
        },
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf']
        },
        maxSize: 5242880, // 5MB
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
                }}
            >
                <input {...getInputProps()} />

                <Box sx={{ textAlign: 'center' }}>
                    <Iconify
                        icon="eva:cloud-upload-fill"
                        sx={{ width: 56, height: 56, mb: 2, color: 'primary.main' }}
                    />

                    <Typography variant="h6" gutterBottom>
                        Trascina i file qui o clicca per selezionarli
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Rilascia i file qui o clicca per navigare nel tuo computer
                    </Typography>
                </Box>
            </DropZoneStyle>
        </Box>
    );
} 