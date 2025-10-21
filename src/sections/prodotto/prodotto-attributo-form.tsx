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
//import { useDeleteProdottoAttributo } from 'src/hooks/useDeleteProdottoAttributo';
import { Prodotto } from 'src/types/Prodotto';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { useGetAttributoOpzioni } from 'src/hooks/useGetAttributoOpzioni';
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
  // const { mutate: deleteProdottoAttributo, isPending: isDeleting } =
  //   useDeleteProdottoAttributo(prodotto_id);
  const [selectedAttributoId, setSelectedAttributoId] = useState<number | null>(null);
  const { data: attributoOpzioniFromAPI } = useGetAttributoOpzioni(selectedAttributoId || 0);

  // Trova l'attributo selezionato in prodotto.attributes per prendere le sue opzioni
  const selectedAttributeFromProduct = prodotto?.attributes?.find(
    (attr: any) => Number(attr.id) === Number(selectedAttributoId)
  );

  // PRIORITÀ:
  // 1. Se l'attributo è già nel prodotto, usa prodotto.attributes[].options (stringhe: ["L", "M"])
  // 2. Altrimenti usa le opzioni dall'API /terms (oggetti: [{id, name, slug}, ...])
  const attributeOptions = (selectedAttributeFromProduct?.options ||
    attributoOpzioniFromAPI ||
    []) as any;

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
    } else if (open && !prodotto_attributo?.id) {
      // Reset quando apri per nuovo attributo
      setSelectedAttributoId(null);
    }
  }, [open, prodotto_attributo]);

  // Reset opzioni quando cambia l'attributo selezionato
  useEffect(() => {
    if (selectedAttributoId && !prodotto_attributo?.id) {
      // Se è un nuovo attributo (non in modifica), resetta le opzioni
      setValue('options', []);
    }
  }, [selectedAttributoId, prodotto_attributo, setValue]);

  const handleDelete = () => {
    if (prodotto_attributo?.id && onDelete) {
      if (window.confirm('Sei sicuro di voler eliminare questo attributo dal prodotto?')) {
        // deleteProdottoAttributo(prodotto_attributo, {
        //   onSuccess: () => {
        //     onDelete(prodotto_attributo);
        //   },
        // });
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
      title={prodotto_attributo?.id ? `Attributo: ${prodotto_attributo.name}` : 'Nuovo Attributo'}
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
                  name="id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Attributo"
                      onChange={(e) => {
                        field.onChange(e);
                        handleAttributoChange(e.target.value);
                      }}
                    >
                      {attributi?.map((attr: any) => (
                        <MenuItem
                          key={attr.id}
                          value={attr.id}
                          disabled={prodotto?.attributes?.some(
                            (attribute: any) => attribute.id === attr.id
                          )}
                        >
                          {attr.name}
                        </MenuItem>
                      ))}
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
              <AttributoAutocomplete control={control} options={attributeOptions} />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <OpzioniInputField
                control={control}
                name="options"
                attributo_id={prodotto_attributo?.attributo_id}
              />
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
                  name="visible"
                  control={control}
                  render={({ field }) => <Switch {...field} checked={field.value} />}
                />
              }
              label="Visibile nella pagina prodotto"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="variation"
                  control={control}
                  render={({ field }) => <Switch {...field} checked={field.value} />}
                />
              }
              label="Usato nelle variazioni"
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              {prodotto_attributo?.id && (
                <Button
                  //disabled={isDeleting}
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  {/* {isDeleting ? 'Elimina attributo...' : 'Elimina attributo'} */}
                  Elimina attributo
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
