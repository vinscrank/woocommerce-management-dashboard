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
} from '@mui/material';
import { Categoria, Immagine } from 'src/types/Categoria';
import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';

import { InfoLabel } from 'src/components/InfoLabel';
import { usePutCategoria } from 'src/hooks/usePutCategoria';
import { usePostCategoria } from 'src/hooks/usePostCategoria';
import { Iconify } from 'src/components/iconify';
import { useGetCategories } from 'src/hooks/useGetCategorie';
import { ca } from 'date-fns/locale';
import { useUploadCategoriaImmagine } from 'src/hooks/useUploadCategoriaImmagine';
import { useGetCategoria } from 'src/hooks/useGetCategoria';

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
      // image: categoria?.image || (null as Immagine | null),
      // menuOrder: categoria?.menuOrder || '',
      // display: categoria?.display || null,
      // count: categoria?.count || false,
    },
  });
  const { mutate: createCategoria, isPending: isPosting } = usePostCategoria();
  const { mutate: updateCategoria, isPending: isUpdating } = usePutCategoria();
  const { data: categoriaData } = useGetCategoria(categoria?.id as number);
  const { mutate: uploadCategoriaImmagine, isPending: isUploading } = useUploadCategoriaImmagine();

  const { data: categorie } = useGetCategories();

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Creiamo un oggetto Immagine temporaneo
      const immagineTemp: Immagine = {
        id: 0, // valore temporaneo

        categoria_id: categoria?.id as number,
        src: URL.createObjectURL(file),
        alt: file.name,
        name: file.name,
        file: file, // aggiungiamo il file originale se necessario
      };
      //@ts-ignore
      setValue('immagine', immagineTemp.file);
    }
  };

  // const handleImageDelete = () => {
  //     setValue('immagine', null);
  // };

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
        {/* <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<Iconify icon="solar:upload-bold" />}
                            >
                                Carica Immagine
                            </Button>
                        </label>
                    </Box>
                </Grid> */}
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
    </form>
  );
}
