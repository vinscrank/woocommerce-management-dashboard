import { Grid, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import React from 'react';
import { usePostAttributoOpzione } from 'src/hooks/usePostAttributoOpzione';
import { usePutAttributoOpzione } from 'src/hooks/usePutAttributoOpzione';
import { useDeleteAttributoOpzione } from 'src/hooks/useDeleteAttributoOpzione';

interface AttributoOpzioneFormProps {
  opzione?: AttributoOpzione;
  attributoId: number;
  onSubmit: () => void;
}

export function AttributoOpzioneForm({
  opzione,
  attributoId,
  onSubmit,
}: AttributoOpzioneFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: opzione?.name || '',
      attributo_id: attributoId,
    },
  });

  React.useEffect(() => {
    if (opzione) {
      reset({
        name: opzione.name || '',
        attributo_id: attributoId,
      });
    }
  }, [opzione]);

  const { mutate: createOpzione, isPending: isPosting } = usePostAttributoOpzione({
    attributo_id: attributoId,
  });
  const { mutate: updateOpzione, isPending: isUpdating } = usePutAttributoOpzione({
    attributo_id: attributoId,
  });

  const onSubmitForm = (data: any) => {
    if (opzione) {
      updateOpzione(
        {
          ...opzione,
          ...data,
        },
        {
          onSuccess: onSubmit,
        }
      );
    } else {
      createOpzione(data, {
        onSuccess: onSubmit,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name && 'Il nome è obbligatorio'}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth type="submit" variant="contained" disabled={isPosting || isUpdating}>
            {isPosting || isUpdating ? 'Salvataggio...' : 'Salva Opzione'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
