import {
  Grid,
  TextField,
  Box,
  Button,
  Typography,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { Categoria, Immagine } from 'src/types/Categoria';
import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';

import { InfoLabel } from 'src/components/InfoLabel';
import { usePutCategoria } from 'src/hooks/usePutCategoria';
import { usePostCategoria } from 'src/hooks/usePostCategoria';
import { Iconify } from 'src/components/iconify';
import { useGetAllCategories } from 'src/hooks/useGetCategorie';
import { ca } from 'date-fns/locale';
import { useUploadCategoriaImmagine } from 'src/hooks/useUploadCategoriaImmagine';
import { useGetCategoria } from 'src/hooks/useGetCategoria';
import { UploadModal } from 'src/components/upload-modal/UploadModal';
import { useState } from 'react';
import { Media } from 'src/types/File';
import { useDevUrl } from 'src/hooks/useDevUrl';

interface CategoriaFormProps {
  categoria: Categoria;
  onSubmit: (data: any) => void;
  onDelete?: (id: number) => void;
}

export function CategoriaForm({ categoria, onSubmit, onDelete }: CategoriaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: categoria?.name || '',
      id: categoria?.id || '',
      parent: categoria?.parent || null,
      description: categoria?.description || '',
      image: categoria?.image || null,
      // menuOrder: categoria?.menuOrder || '',
      // display: categoria?.display || null,
      // count: categoria?.count || false,
    },
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Media[]>([]);
  const [selectedExistingFiles, setSelectedExistingFiles] = useState<Media[]>([]);

  const { mutate: createCategoria, isPending: isPosting } = usePostCategoria();
  const { mutate: updateCategoria, isPending: isUpdating } = usePutCategoria();
  const { data: categoriaData } = useGetCategoria(categoria?.id as number);
  const { mutate: uploadCategoriaImmagine, isPending: isUploading } = useUploadCategoriaImmagine();
  const { convertUrl } = useDevUrl();

  const { data: categorie } = useGetAllCategories();

  const onSubmitForm = async (data: any) => {
    if (categoria) {
      updateCategoria(
        {
          ...categoria,
          ...data,
        },
        {
          onSuccess: () => {
            onSubmit(data);
            // uploadCategoriaImmagine({
            //     categoria_id: categoria.id.toString(),
            //     categoria_immagine_principale: data.immagine
            // })
          },
          onError: (error) => {
            console.error('Errore durante il salvataggio della categoria:', error);
          },
        }
      );
    } else {
      createCategoria(data, {
        onSuccess: () => onSubmit(data),
        onError: (error) => {
          console.error('Errore durante il salvataggio della categoria:', error);
        },
      });
    }
  };

  const handleUploadModalConfirm = async () => {
    // Prendi il primo file selezionato (categoria ha solo un'immagine)
    if (selectedFiles.length > 0) {
      const selectedImage = selectedFiles[0];

      // Crea l'oggetto immagine nel formato corretto per WooCommerce
      const imageData = {
        id: selectedImage.id,
        name: selectedImage.slug || selectedImage.title,
        src: selectedImage.sourceUrl,
        alt: selectedImage.altText || '',
      };

      // Aggiorna il campo image nel form
      setValue('image', imageData as any);

      // Chiudi la modale e resetta i file selezionati
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      setSelectedExistingFiles([]);
    }
  };

  const handleImageDelete = () => {
    setValue('image', null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={2}>
        {/* Form Fields */}
        {categoria?.id && (
          <>
            <Grid item xs={12} md={12}>
              <TextField fullWidth label="ID" {...register('id')} disabled />
            </Grid>
          </>
        )}

        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Nome categoria"
            {...register('name', { required: true })}
            error={!!errors.name}
            helperText={errors.name && 'Il nome è obbligatorio'}
          />
        </Grid>

        {/* {categoria?.id && (
          <Grid item xs={12} md={12}>
            <TextField fullWidth label="Slug" {...register('slug')} />
          </Grid>
        )} */}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrizione"
            {...register('description')}
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <InputLabel id="parent-label">Categoria Genitore</InputLabel>
            <Select
              labelId="parent-label"
              label="Categoria Genitore"
              {...register('parent')}
              value={watch('parent') || ''}
            >
              <MenuItem value="" disabled>
                Seleziona categoria genitore
              </MenuItem>
              {categorie
                ?.filter((cat) => cat.id !== categoria?.id)
                .map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Image Upload */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Immagine Categoria
          </Typography>

          {/* Visualizza immagine attuale se esiste */}
          {watch('image') && (
            <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
              <img
                src={convertUrl((watch('image') as any)?.src)}
                alt={(watch('image') as any)?.name || 'Categoria'}
                style={{
                  maxWidth: '200px',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                }}
              />
              <IconButton
                color="error"
                size="small"
                onClick={handleImageDelete}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'error.lighter' },
                }}
              >
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant={watch('image') ? 'outlined' : 'contained'}
              onClick={() => setIsUploadModalOpen(true)}
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              {watch('image') ? 'Cambia Immagine' : 'Carica Immagine'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Actions */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {categoria?.id && onDelete && (
            <Button
              color="error"
              variant="contained"
              onClick={() => onDelete(categoria.id as number)}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              Elimina categoria
            </Button>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPosting || isUpdating}
          >
            {isPosting || isUpdating ? 'Salvataggio...' : 'Salva Categoria'}
          </Button>
        </Box>
      </Grid>

      {/* Upload Modal */}
      <UploadModal
        open={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFiles([]);
          setSelectedExistingFiles([]);
        }}
        selectedFiles={selectedFiles}
        selectedExistingFiles={selectedExistingFiles}
        onSelectedFilesChange={(files) => {
          // Limita a un solo file per la categoria
          if (files.length > 0) {
            setSelectedFiles([files[files.length - 1]]);
          } else {
            setSelectedFiles([]);
          }
        }}
        onSelectedExistingFilesChange={setSelectedExistingFiles}
        onConfirm={handleUploadModalConfirm}
        isLoading={isUpdating || isPosting}
      />
    </form>
  );
}
