import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Grid, IconButton, CircularProgress, Chip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { useGetFiles } from 'src/hooks/useGetFiles';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'src/context/SnackbarContext';
import { Media } from 'src/types/File';
import { useDevUrl } from 'src/hooks/useDevUrl';
import { useUploadFiles } from 'src/hooks/useUploadFiles';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  selectedFiles: Media[];
  selectedExistingFiles: Media[];
  onSelectedFilesChange: (files: Media[]) => void;
  onSelectedExistingFilesChange: (files: Media[]) => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}
export function UploadModal({
  open,
  onClose,
  selectedFiles, // Questo dovrebbe contenere TUTTI i file selezionati
  onSelectedFilesChange, // Callback per aggiornare TUTTI i file
  onConfirm,
  isLoading = false,
}: UploadModalProps) {
  const [showExistingFiles, setShowExistingFiles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allFiles, setAllFiles] = useState<Media[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: existingFiles,
    isFetching: isFetchingFiles,
    refetch,
  } = useGetFiles(currentPage, 20);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const { showMessage } = useSnackbar();
  const { convertUrl } = useDevUrl();

  // Reset quando si apre la modale
  useEffect(() => {
    if (open) {
      console.log('Modale aperta - Reset e refetch');
      setCurrentPage(1);
      setAllFiles([]);
      setHasMore(true);
      // Forza il refetch dei dati quando si apre la modale
      refetch();
    }
  }, [open, refetch]);

  // Accumula i file quando arrivano nuove pagine
  useEffect(() => {
    console.log('Effect accumulo file - existingFiles:', existingFiles);
    console.log('Effect accumulo file - isFetching:', isFetchingFiles);

    if (existingFiles?.items) {
      console.log('✅ Files ricevuti:', {
        page: existingFiles.currentPage,
        requestedPage: currentPage,
        items: existingFiles.items.length,
        totalItems: existingFiles.totalItems,
        totalPages: existingFiles.totalPages,
      });

      // Verifica che la pagina ricevuta sia quella richiesta (evita race conditions)
      if (existingFiles.currentPage === currentPage) {
        if (currentPage === 1) {
          // Prima pagina: sostituisci sempre
          setAllFiles(existingFiles.items);
        } else {
          // Pagine successive: aggiungi solo se non ci sono già
          setAllFiles((prev) => {
            // Evita duplicati
            const newFiles = existingFiles.items.filter(
              (newFile) => !prev.some((existingFile) => existingFile.id === newFile.id)
            );
            console.log('➕ Aggiunti', newFiles.length, 'nuovi file');
            return [...prev, ...newFiles];
          });
        }

        // Verifica se ci sono altre pagine (controllo rigoroso)
        const morePages = existingFiles.currentPage < existingFiles.totalPages;
        console.log(
          '📖 Altre pagine disponibili?',
          morePages,
          `(${existingFiles.currentPage}/${existingFiles.totalPages})`
        );
        setHasMore(morePages);
      } else {
        console.log('⚠️ Pagina ricevuta diversa da quella richiesta, skip');
      }
    } else {
      console.log('❌ Nessun file ricevuto o items vuoto');
    }
  }, [existingFiles, currentPage, isFetchingFiles]);

  // IntersectionObserver per infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        // Verifica più rigorosa per evitare di caricare pagine inesistenti
        if (
          first.isIntersecting &&
          hasMore &&
          !isFetchingFiles &&
          existingFiles?.currentPage &&
          existingFiles?.totalPages &&
          existingFiles.currentPage < existingFiles.totalPages
        ) {
          console.log('📄 Caricamento pagina successiva:', currentPage + 1);
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget && hasMore) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetchingFiles, existingFiles, currentPage]);

  const { uploadFiles, isUploading } = useUploadFiles({
    onSuccess: (uploadedFiles) => {
      showMessage({
        text: `${uploadedFiles.length} file caricato/i con successo`,
        type: 'success',
      });
      // Aggiungi i file caricati alla lista dei selezionati
      onSelectedFilesChange([...selectedFiles, ...uploadedFiles]);
      // Aggiungi anche alla lista di tutti i file per mostrarli immediatamente
      setAllFiles((prev) => [...uploadedFiles, ...prev]);
    },
    onError: () => {
      showMessage({
        text: 'Errore durante il caricamento dei file',
        type: 'error',
      });
    },
  });

  // Configurazione dropzone per la lista dei file selezionati
  const {
    getRootProps: getListDropzoneProps,
    getInputProps: getListInputProps,
    isDragActive: isListDragActive,
  } = useDropzone({
    onDrop: async (acceptedFiles) => {
      await uploadFiles(acceptedFiles);
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
      const files = Array.from(e.dataTransfer.files);
      await uploadFiles(files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await uploadFiles(files);
    }
  };

  const handleExistingFileToggle = (file: Media) => {
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
      {/* Sezione file selezionati con posizione fissa - visualizzazione compatta */}
      {hasSelectedFiles && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: 'success.lighter',
            borderBottom: '2px solid',
            borderColor: 'success.main',
            p: 1.5,
            mb: 2,
            zIndex: 1,
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 2px 8px rgba(0,200,83,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={20} />
            <Typography variant="subtitle2" color="success.dark" flexGrow={1} fontWeight={600}>
              File Selezionati
            </Typography>
            <Chip
              label={`${selectedFiles.length}`}
              color="success"
              size="small"
              sx={{ fontWeight: 600, fontSize: '0.75rem', height: '20px' }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              maxHeight: '80px',
              pb: 0.5,
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'success.main',
                borderRadius: '3px',
              },
            }}
          >
            {selectedFiles.map((file: any, index: number) => (
              <Box key={`${file.id || index}-${index}`}>
                <Box
                  sx={{
                    position: 'relative',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'success.main',
                    minWidth: '60px',
                    width: '60px',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      '& .delete-btn': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Bottone Elimina */}
                  <IconButton
                    className="delete-btn"
                    size="small"
                    onClick={() => removeSelectedFile(file)}
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      zIndex: 2,
                      bgcolor: 'error.main',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      padding: '2px',
                      minWidth: '20px',
                      width: '20px',
                      height: '20px',
                      '&:hover': {
                        bgcolor: 'error.dark',
                      },
                    }}
                  >
                    <Iconify icon="eva:close-fill" width={14} />
                  </IconButton>

                  {/* Anteprima Immagine */}
                  <Box
                    component="img"
                    src={(() => {
                      // Se ha sourceUrl o src, è un file esistente dalla media library
                      if (file.sourceUrl) return convertUrl(file.sourceUrl);
                      if (file.src) return convertUrl(file.src);
                      // Se è un File object (nuovo upload), crea URL temporaneo
                      if (file instanceof File) return URL.createObjectURL(file);
                      // Fallback
                      return '';
                    })()}
                    alt={file.slug || file.name}
                    sx={{
                      width: '100%',
                      height: '60px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Contenuto scrollabile della modale */}
      <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        {/* <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowExistingFiles(!showExistingFiles)}
            startIcon={<Iconify icon={showExistingFiles ? 'eva:eye-off-fill' : 'eva:eye-fill'} />}
            fullWidth
          >
            {showExistingFiles ? 'Nascondi file esistenti' : 'Seleziona da file esistenti'}
          </Button>
        </Box> */}

        {showExistingFiles && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              File esistenti disponibili ({existingFiles?.totalItems || 0} totali):
            </Typography>
            {allFiles.length === 0 && isFetchingFiles ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Caricamento file in corso...
                </Typography>
              </Box>
            ) : allFiles.length === 0 && !isFetchingFiles ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Nessun file disponibile
                </Typography>
              </Box>
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
                  {allFiles.map((file: Media) => (
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
                          src={`${convertUrl(file.sourceUrl)}`}
                          alt={file.slug}
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
                          {file.slug}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}

                  {/* Elemento observer per infinite scroll */}
                  {hasMore && (
                    <Grid item xs={12}>
                      <Box
                        ref={observerTarget}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          p: 2,
                        }}
                      >
                        {isFetchingFiles && currentPage > 1 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={24} />
                            <Typography variant="body2" color="text.secondary">
                              Caricamento altri file...
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  )}

                  {/* Messaggio fine lista */}
                  {!hasMore && allFiles.length > 0 && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          p: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: 'italic' }}
                        >
                          ✓ Tutti i file sono stati caricati ({allFiles.length} di{' '}
                          {existingFiles?.totalItems || 0})
                        </Typography>
                      </Box>
                    </Grid>
                  )}
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
          disabled={!hasSelectedFiles || isLoading || isUploading}
          startIcon={isLoading || isUploading ? <CircularProgress size={20} /> : null}
        >
          Conferma upload
        </Button>
      </Box>
    </GenericModal>
  );
}
