import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Grid, IconButton, CircularProgress, Chip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { useGetFiles } from 'src/hooks/useGetFiles';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'src/context/SnackbarContext';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { File as FileType } from 'src/types/File';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  selectedFiles: FileType[];
  selectedExistingFiles: FileType[];
  onSelectedFilesChange: (files: FileType[]) => void;
  onSelectedExistingFilesChange: (files: FileType[]) => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  isUploadLoading?: boolean;
}
export function UploadModal({
  open,
  onClose,
  selectedFiles, // Questo dovrebbe contenere TUTTI i file selezionati
  onSelectedFilesChange, // Callback per aggiornare TUTTI i file
  onConfirm,
  isLoading = false,
  isUploadLoading = false,
}: UploadModalProps) {
  const [showExistingFiles, setShowExistingFiles] = useState(true);
  const { data: existingFiles, isFetching: isFetchingFiles } = useGetFiles() as {
    data: FileType[] | undefined;
    isFetching: boolean;
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { showMessage } = useSnackbar();

  // Configurazione dropzone per la lista dei file selezionati
  const {
    getRootProps: getListDropzoneProps,
    getInputProps: getListInputProps,
    isDragActive: isListDragActive,
  } = useDropzone({
    onDrop: async (acceptedFiles) => {
      try {
        // Upload di ogni file al database - stessa logica di FileView
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append('files_upload[]', file);

          await axiosInstance.post('/file/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: {
              return_type: 'url',
            },
          });
        }

        // Aggiorna la lista dei file esistenti - stessa logica di FileView
        queryClient.invalidateQueries({ queryKey: ['files'] });

        showMessage({
          text: `${acceptedFiles.length} file caricato/i con successo`,
          type: 'success',
        });

        // Aggiungi i file alla lista dei selezionati (ora sono nel database)
        const uploadedFiles = acceptedFiles.map((file) => ({
          ...file,
          id: `temp_${Date.now()}_${Math.random()}`, // ID temporaneo
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        })) as any;

        onSelectedFilesChange([...selectedFiles, ...uploadedFiles]);
      } catch (error) {
        console.error('Errore durante il caricamento:', error);
        showMessage({
          text: 'Errore durante il caricamento dei file',
          type: 'error',
        });
      }
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize: 5242880, // 5MB
    noClick: true, // Non apre il file picker quando si clicca
    noKeyboard: true, // Non gestisce eventi tastiera
  });

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      try {
        const files = Array.from(e.dataTransfer.files);

        // Upload di ogni file al database - stessa logica di FileView
        for (const file of files) {
          const formData = new FormData();
          formData.append('files_upload[]', file);

          await axiosInstance.post('/file/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: {
              return_type: 'url',
            },
          });
        }

        // Aggiorna la lista dei file esistenti - stessa logica di FileView
        queryClient.invalidateQueries({ queryKey: ['files'] });

        showMessage({
          text: `${files.length} file caricato/i con successo nel database`,
          type: 'success',
        });

        // Aggiungi i file alla lista dei selezionati (ora sono nel database)
        const uploadedFiles = files.map((file) => ({
          ...file,
          id: `temp_${Date.now()}_${Math.random()}`, // ID temporaneo
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        })) as any;

        onSelectedFilesChange([...selectedFiles, ...uploadedFiles]);
      } catch (error) {
        console.error('Errore durante il caricamento:', error);
        showMessage({
          text: 'Errore durante il caricamento dei file',
          type: 'error',
        });
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const files = Array.from(e.target.files);

        // Upload di ogni file al database - stessa logica di FileView
        for (const file of files) {
          const formData = new FormData();
          formData.append('files_upload[]', file);

          await axiosInstance.post('/file/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: {
              return_type: 'url',
            },
          });
        }

        // Aggiorna la lista dei file esistenti - stessa logica di FileView
        queryClient.invalidateQueries({ queryKey: ['files'] });

        showMessage({
          text: `${files.length} file caricato/i con successo nel database`,
          type: 'success',
        });

        // Aggiungi i file alla lista dei selezionati (ora sono nel database)
        const uploadedFiles = files.map((file) => ({
          ...file,
          id: `temp_${Date.now()}_${Math.random()}`, // ID temporaneo
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        })) as any;

        onSelectedFilesChange([...selectedFiles, ...uploadedFiles]);
      } catch (error) {
        console.error('Errore durante il caricamento:', error);
        showMessage({
          text: 'Errore durante il caricamento dei file',
          type: 'error',
        });
      }
    }
  };

  const handleExistingFileToggle = (file: FileType) => {
    const isSelected = selectedFiles.some((f: any) => f.id === file.id);
    if (isSelected) {
      onSelectedFilesChange(selectedFiles.filter((f: any) => f.id !== file.id));
    } else {
      onSelectedFilesChange([...selectedFiles, file]);
    }
  };

  const removeSelectedFile = (file: any) => {
    onSelectedFilesChange(selectedFiles.filter((f: any) => f !== file));
  };

  const hasSelectedFiles = selectedFiles.length > 0;

  return (
    <GenericModal
      title="Carica Immagini"
      open={open}
      onClose={onClose}
      maxWidth="sm"
      sx={{
        '& .MuiDialogContent-root': {
          paddingBottom: 0,
        },
      }}
    >
      {/* Sezione file selezionati con posizione fissa - lista unica e dropzone */}
      {hasSelectedFiles && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 2,
            mb: 2,
            zIndex: 1,
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" flexGrow={1}>
              File selezionati ({selectedFiles.length}):
            </Typography>
          </Box>

          <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
            {selectedFiles.map((file: any, index: number) => (
              <Box
                key={`${file.id || index}-${index}`}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
                sx={{
                  bgcolor: 'action.hover',
                  p: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box display="flex" alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    {file.name}
                  </Typography>
                  <Chip
                    label={file.id ? 'Esistente' : 'Nuovo'}
                    size="small"
                    color={file.id ? 'secondary' : 'primary'}
                    sx={{ ml: 1, flexShrink: 0 }}
                  />
                </Box>
                <IconButton
                  size="small"
                  onClick={() => removeSelectedFile(file)}
                  sx={{ ml: 1, flexShrink: 0 }}
                >
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Contenuto scrollabile della modale */}
      <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowExistingFiles(!showExistingFiles)}
            startIcon={<Iconify icon={showExistingFiles ? 'eva:eye-off-fill' : 'eva:eye-fill'} />}
            fullWidth
          >
            {showExistingFiles ? 'Nascondi file esistenti' : 'Seleziona da file esistenti'}
          </Button>
        </Box>

        {showExistingFiles && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              File esistenti disponibili:
            </Typography>
            {isFetchingFiles ? (
              <CircularProgress size={24} />
            ) : (
              <Box
                {...getListDropzoneProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isListDragActive ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  p: 2,
                  transition: 'all 0.3s ease',
                  bgcolor: isListDragActive ? 'primary.lighter' : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <input {...getListInputProps()} />

                {isListDragActive && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 2,
                      p: 2,
                      bgcolor: 'primary.lighter',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Iconify icon="eva:plus-fill" color="primary.main" />
                    <Typography variant="subtitle2" color="primary.main">
                      Rilascia qui per aggiungere il file alla lista
                    </Typography>
                  </Box>
                )}

                <Grid container spacing={1}>
                  {existingFiles?.map((file: FileType) => (
                    <Grid item xs={6} sm={4} md={3} key={file.id}>
                      <Box
                        sx={{
                          border: selectedFiles.some((f) => f.id === file.id)
                            ? '2px solid primary.main'
                            : '1px solid divider',
                          borderRadius: 1,
                          p: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() => handleExistingFileToggle(file)}
                      >
                        <img
                          src={`${import.meta.env.VITE_GEST_URL}/front/${file.name}`}
                          alt={file.name}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {/* <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
          <Iconify icon="eva:cloud-upload-fill" width={40} height={40} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Trascina le immagini qui o clicca per selezionarle
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supporta immagini JPG, PNG e GIF
          </Typography>
        </Box> */}
      </Box>

      {/* Pulsanti di azione sempre visibili */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2,
          mx: -2,
          zIndex: 1,
          borderRadius: '0 0 8px 8px',
          mt: 'auto',
        }}
      >
        <Button onClick={onClose} variant="outlined">
          Annulla
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={!hasSelectedFiles || isLoading || isUploadLoading}
          startIcon={isLoading || isUploadLoading ? <CircularProgress size={20} /> : null}
        >
          Conferma upload
        </Button>
      </Box>
    </GenericModal>
  );
}
