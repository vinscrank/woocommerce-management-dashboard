import { Grid, TextField, Typography, Button, Box } from '@mui/material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import React from 'react';
import { useForm } from 'react-hook-form';
import { InfoLabel } from 'src/components/InfoLabel';
import { Attributo } from 'src/types/Attributo';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import { AttributoOpzioniTable } from './view/attributo-opzioni-table';
import { usePostAttributo } from 'src/hooks/usePostAttributo';
import { usePutAttributo } from 'src/hooks/usePutAttributo';
interface AttributoFormProps {
  attributo: Attributo;
  onSubmit: (data: any) => void;
}

export function AttributoForm({ attributo, onSubmit }: AttributoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: attributo?.name || '',
    },
  });
  const { mutate: createAttributo, isPending: isPosting } = usePostAttributo();
  const { mutate: updateAttributo, isPending: isUpdating } = usePutAttributo();

  const onSubmitForm = async (data: any) => {
    if (attributo) {
      updateAttributo(
        {
          ...attributo,
          ...data,
        },
        {
          onSuccess: () => onSubmit(data),
          onError: (error: Error) => {
            console.error("Errore durante il salvataggio dell'attributo:", error);
          },
        }
      );
    } else {
      createAttributo(data, {
        onSuccess: () => onSubmit(data),
        onError: (error: Error) => {
          console.error("Errore durante il salvataggio dell'attributo:", error);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={2}>
        {attributo?.id && (
          <>
            <Grid item xs={12}>
              <TextField fullWidth label="ID" value={attributo.id} disabled />
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
            {isPosting || isUpdating ? 'Salvataggio...' : 'Salva Attributo'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
