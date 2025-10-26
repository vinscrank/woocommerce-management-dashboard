import { Grid, TextField, Chip, Typography, Button, Box } from '@mui/material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Brand } from 'src/types/Brand';

import React from 'react';
import { useForm } from 'react-hook-form';
import { InfoLabel } from 'src/components/InfoLabel';
import { usePostBrand } from 'src/hooks/usePostBrand';
import { usePutBrand } from 'src/hooks/usePutBrand';

interface brandFormProps {
  brand: Brand;
  onSubmit: (data: any) => void;
}

export function BrandForm({ brand, onSubmit }: brandFormProps) {
  const postbrand = usePostBrand();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: brand?.name || '',
    },
  });
  const { mutate: createbrand, isPending: isPosting } = usePostBrand();
  const { mutate: updatebrand, isPending: isUpdating } = usePutBrand();

  const onSubmitForm = async (data: any) => {
    if (brand) {
      updatebrand(
        {
          ...brand,
          ...data,
        },
        {
          onSuccess: () => onSubmit(data),
          onError: (error) => {
            console.error('Errore durante il salvaggio del brand:', error);
          },
        }
      );
    } else {
      createbrand(data, {
        onSuccess: () => onSubmit(data),
        onError: (error) => {
          console.error('Errore durante il salvaggio del brand:', error);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={2}>
        {brand?.id && (
          <>
            <Grid item xs={12}>
              <TextField fullWidth label="ID" value={brand.id} disabled />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome"
            {...register('name', { required: true })}
            error={!!errors.name}
            helperText={errors.name && 'Il nome è obbligatorio'}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPosting || isUpdating}
          >
            {isPosting || isUpdating ? 'Salvataggio...' : 'Salva brand'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
