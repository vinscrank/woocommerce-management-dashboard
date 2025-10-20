import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useGetAttributi } from 'src/hooks/useGetAttributi';
import { useDeleteProdottoAttributo } from 'src/hooks/useDeleteProdottoAttributo';
import { Prodotto } from 'src/types/Prodotto';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { useGetAttributo } from 'src/hooks/useGetAttributo';
import { AttributoAutocomplete } from 'src/components/AttributoAutocomplete';
import { OpzioniInputField } from 'src/components/OpzioniInputField';

interface ProdottoAttributoFormProps {
  open: boolean;
  onClose: () => void;
  prodotto_attributo: any;
  onSubmit: (data: any) => void;
  onDelete?: (attributo: any) => void;
  prodottoType?: string;
  prodotto_id: number;
  prodotto: Prodotto;
  isLoading?: boolean;
}

export function ProdottoAttributoForm({
  open,
  onClose,
  prodotto_attributo,
  onSubmit,
  onDelete,
  prodottoType = 'simple',
  prodotto_id,
  prodotto,
  isLoading = false,
}: ProdottoAttributoFormProps) {
  const [isSpecifico, setIsSpecifico] = useState(
    prodotto_attributo?.attributo?.is_specifico || false
  );

  const { data: attributi } = useGetAttributi();
  const { mutate: deleteProdottoAttributo, isPending: isDeleting } =
    useDeleteProdottoAttributo(prodotto_id);
  const [selectedAttributoId, setSelectedAttributoId] = useState<number | null>(null);
  const { data: attributoDetails } = useGetAttributo(selectedAttributoId);

  const { register, handleSubmit, control, watch, setValue, reset } = useForm<any>({
    defaultValues: {
      id: prodotto_attributo?.id || null,
      attributo_id: prodotto_attributo?.attributo_id || '',
      attributo: {
        name: prodotto_attributo?.attributo?.name || '',
        is_specifico: prodotto_attributo?.attributo?.is_specifico || false,
        attributoOpzioni: prodotto_attributo?.attributo?.attributoOpzioni || [],
      },
      opzioni_id: prodotto_attributo?.opzioni_id || [],
      abilitato_per_variazioni:
        prodottoType === 'simple' ? false : prodotto_attributo?.abilitato_per_variazioni || false,
      visibile: prodotto_attributo?.visibile || true,
      prodotto_id: prodotto_id,
      position: prodotto_attributo?.position || null,
    },
  });

  useEffect(() => {
    if (prodotto_attributo) {
      reset(prodotto_attributo);
    }
  }, [prodotto_attributo]);

  // Effetto per l'inizializzazione all'apertura della modale
  useEffect(() => {
    if (open && prodotto_attributo?.attributo_id) {
      setSelectedAttributoId(Number(prodotto_attributo.attributo_id));
    }
  }, [open, prodotto_attributo]);

  const handleDelete = () => {
    if (prodotto_attributo?.id && onDelete) {
      if (window.confirm('Sei sicuro di voler eliminare questo attributo dal prodotto?')) {
        deleteProdottoAttributo(prodotto_attributo, {
          onSuccess: () => {
            onDelete(prodotto_attributo);
          },
        });
      }
    }
  };

  const handleAttributoChange = (attributoId: string) => {
    setSelectedAttributoId(Number(attributoId));
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={
        prodotto_attributo?.id
          ? `Attributo: ${prodotto_attributo.attributo.name}`
          : 'Nuovo Attributo'
      }
      maxWidth="md"
      onConfirm={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {!prodotto_attributo?.id && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="attributo.is_specifico"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          setIsSpecifico(e.target.checked);
                        }}
                      />
                    )}
                  />
                }
                label="Attributo interno al prodotto?"
              />
            </Grid>
          )}

          {!isSpecifico ? (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Attributo</InputLabel>
                <Controller
                  name="attributo_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Attributo"
                      disabled={!!prodotto_attributo?.id}
                      onChange={(e) => {
                        field.onChange(e);
                        handleAttributoChange(e.target.value);
                      }}
                    >
                      {/* {attributi?.map((attr: any) => (
                                                <MenuItem
                                                    key={attr.id}
                                                    value={attr.id}
                                                    disabled={prodotto?.attributi_id?.some(
                                                        (attrId: number) => attrId === attr.id
                                                    )}
                                                >
                                                    {attr.name}
                                                </MenuItem>
                                            ))} */}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nome attributo interno"
                disabled={!!prodotto_attributo?.id}
                {...register('attributo.name')}
              />
            </Grid>
          )}

          {!isSpecifico ? (
            <Grid item xs={12}>
              <AttributoAutocomplete control={control} attributoDetails={attributoDetails} />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <OpzioniInputField control={control} name="opzioni_id" />
            </Grid>
          )}

          {prodottoType === 'variable' && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="abilitato_per_variazioni"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} />}
                  />
                }
                label="Attributo usato per variazioni"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="visibile"
                  control={control}
                  render={({ field }) => <Switch {...field} checked={field.value} />}
                />
              }
              label="Attributo visibile nella pagina prodotto"
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              {prodotto_attributo?.id && (
                <Button
                  disabled={isDeleting}
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  {isDeleting ? 'Elimina attributo...' : 'Elimina attributo'}
                </Button>
              )}
              <Button disabled={isLoading} variant="contained" color="primary" type="submit">
                {isLoading ? 'Salva attributo...' : 'Salva attributo'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </GenericModal>
  );
}
