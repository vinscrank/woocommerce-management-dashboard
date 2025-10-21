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
import { useState, useEffect, useRef } from 'react';
import { useGetAttributi } from 'src/hooks/useGetAttributi';
import { useDeleteProdottoAttributo } from 'src/hooks/useDeleteProdottoAttributo';
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
  // Determina se è un attributo interno: se esiste ma non ha id (o ha id=0), è interno
  const isAttributoInterno =
    prodotto_attributo && (!prodotto_attributo.id || prodotto_attributo.id === 0);
  const [isSpecifico, setIsSpecifico] = useState(
    isAttributoInterno || prodotto_attributo?.attributo?.is_specifico || false
  );

  const { data: attributi } = useGetAttributi();
  const { mutate: deleteProdottoAttributo, isPending: isDeleting } =
    useDeleteProdottoAttributo(prodotto);
  const [selectedAttributoId, setSelectedAttributoId] = useState<number | null>(null);
  const previousAttributoIdRef = useRef<number | null>(null);
  const { data: attributoOpzioniFromAPI } = useGetAttributoOpzioni(selectedAttributoId || 0);

  // Trova l'attributo selezionato in prodotto.attributes per prendere le sue opzioni
  const selectedAttributeFromProduct = prodotto?.attributes?.find(
    (attr: any) => Number(attr.id) === Number(selectedAttributoId)
  );

  // PRIORITÀ:
  // 1. Se NON c'è un attributo selezionato, ritorna array vuoto
  // 2. Se l'attributo è già nel prodotto E ci sono opzioni dall'API, usa le opzioni dall'API
  // 3. Altrimenti usa le opzioni già salvate nel prodotto
  // 4. Altrimenti array vuoto
  // In questo modo quando modifichi puoi sempre aggiungere altre opzioni disponibili
  const attributeOptions = (
    !selectedAttributoId
      ? []
      : attributoOpzioniFromAPI || selectedAttributeFromProduct?.options || []
  ) as any;

  const { register, handleSubmit, control, watch, setValue, reset } = useForm<any>({
    defaultValues: {
      id: prodotto_attributo?.id || null,
      name: prodotto_attributo?.name || '',
      options: prodotto_attributo?.options || [],
      visible: prodotto_attributo?.visible ?? true,
      variation: prodotto_attributo?.variation ?? true,
      prodotto_id: prodotto_id,
      position: prodotto_attributo?.position || null,
      attributo: {
        name: '',
        is_specifico: false,
      },
    },
  });

  useEffect(() => {
    if (prodotto_attributo) {
      reset({
        ...prodotto_attributo,
        options: prodotto_attributo.options || [],
        visible: prodotto_attributo.visible !== undefined ? prodotto_attributo.visible : true,
        variation: prodotto_attributo.variation !== undefined ? prodotto_attributo.variation : true,
        attributo: {
          name: isAttributoInterno ? prodotto_attributo.name : '',
          is_specifico: isAttributoInterno,
        },
      });
    }
  }, [prodotto_attributo, reset, isAttributoInterno]);

  // Effetto per l'inizializzazione all'apertura della modale
  useEffect(() => {
    if (open && prodotto_attributo) {
      // Imposta l'ID dell'attributo se esiste (sia in creazione che in modifica)
      const attrId = prodotto_attributo.id || prodotto_attributo.attributo_id;
      if (attrId) {
        setSelectedAttributoId(Number(attrId));
        previousAttributoIdRef.current = Number(attrId);
      }
    } else if (open && !prodotto_attributo) {
      // Reset quando apri per nuovo attributo
      setSelectedAttributoId(null);
      previousAttributoIdRef.current = null;
    }
  }, [open, prodotto_attributo]);

  // Reset opzioni quando cambia l'attributo selezionato
  useEffect(() => {
    // Se è un nuovo attributo (non in modifica) e l'attributo selezionato è cambiato
    if (
      !prodotto_attributo &&
      selectedAttributoId &&
      previousAttributoIdRef.current !== null &&
      previousAttributoIdRef.current !== selectedAttributoId
    ) {
      // Resetta le opzioni quando cambia l'attributo
      setValue('options', []);
    }
    // Aggiorna il ref con il nuovo valore
    previousAttributoIdRef.current = selectedAttributoId;
  }, [selectedAttributoId, prodotto_attributo, setValue]);

  // Reset opzioni quando cambia da attributo interno a globale (o viceversa)
  useEffect(() => {
    // Solo per nuovi attributi (non in modifica)
    if (!prodotto_attributo) {
      // Resetta le opzioni quando cambia il tipo di attributo
      setValue('options', []);
      // Resetta anche l'ID dell'attributo selezionato se passi a interno
      if (isSpecifico) {
        setValue('id', null);
        setSelectedAttributoId(null);
        previousAttributoIdRef.current = null;
      }
    }
  }, [isSpecifico, prodotto_attributo, setValue]);

  const handleDelete = () => {
    if (prodotto_attributo && onDelete) {
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

  // Gestisce il submit normalizzando i dati per attributi interni
  const handleFormSubmit = (data: any) => {
    // Determina se è un attributo interno:
    // 1. Se c'è data.attributo?.is_specifico, è un nuovo attributo interno
    // 2. Se stiamo modificando un attributo interno esistente (isAttributoInterno)
    const isInternoSubmit = data.attributo?.is_specifico || isAttributoInterno;

    if (isInternoSubmit) {
      // Per nuovo attributo interno, prendi il nome da data.attributo.name
      // Per modifica attributo interno esistente, prendi il nome da data.name
      let nomeAttributo = data.attributo?.name || data.name;

      // Valida che ci sia il nome dell'attributo interno
      if (!nomeAttributo || nomeAttributo.trim() === '') {
        alert("Inserisci il nome dell'attributo interno");
        return;
      }

      const normalizedData = {
        ...data,
        id: 0, // Gli attributi interni non hanno un ID globale
        name: nomeAttributo.trim(),
        options: data.options || [],
        visible: data.visible ?? true,
        variation: data.variation ?? true,
        position: data.position || null,
      };
      onSubmit(normalizedData);
    } else {
      // Per gli attributi globali, valida che sia stato selezionato un attributo
      if (!data.id) {
        alert('Seleziona un attributo dalla lista');
        return;
      }
      // Invia i dati così come sono
      onSubmit(data);
    }
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={prodotto_attributo ? `Attributo: ${prodotto_attributo.name}` : 'Nuovo Attributo'}
      maxWidth="md"
      onConfirm={handleSubmit(handleFormSubmit)}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          {/* Mostra lo switch solo quando si crea un nuovo attributo (non in modifica) */}
          {!prodotto_attributo && (
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
                      disabled={!!prodotto_attributo}
                      {...field}
                      label="Attributo"
                      value={field.value || ''}
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
                disabled={!!prodotto_attributo}
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
                    name="variation"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} />}
                  />
                }
                label="Usato nelle variazioni"
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
            <Box display="flex" justifyContent="space-between">
              <Button disabled={isLoading} variant="contained" color="error" onClick={handleDelete}>
                {isLoading ? 'Elimina attributo...' : 'Elimina attributo'}
              </Button>

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
