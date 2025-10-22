import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Iconify } from 'src/components/iconify';
import { NumericFormat } from 'react-number-format';
import { useGetVariazione } from 'src/hooks/useGetVariazione';
import { usePostVariazione } from 'src/hooks/usePostVariazione';
import { usePutVariazione } from 'src/hooks/usePutVariazione';
import { useDeleteVariazione } from 'src/hooks/useDeleteVariazione';
import { useGetStockStati } from 'src/hooks/useGetStockStati';
import { Variazione } from 'src/types/Variazione';
import { STOCK_ENABLED } from 'src/utils/const';

type ProdottoVariazioneFormProps = {
  open: boolean;
  onClose: () => void;
  variazione: any;
  prodotto_id: number;
  prodotto: any;
  onSubmitSuccess?: () => void;
};

export function ProdottoVariazioneForm({
  open,
  onClose,
  variazione,
  prodotto_id,
  prodotto,
  onSubmitSuccess,
}: ProdottoVariazioneFormProps) {
  const { control, handleSubmit, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      id: undefined,
      sku: '',
      shippingClass: '',
      regularPrice: '',
      salePrice: '',
      manageStock: false,
      stockQuantity: 0,
      stockStatus: 'instock',
      attributes: [],
    },
  });

  const manageStock = watch('manageStock');
  const variazioneId = watch('id');

  const { mutate: storeVariazione, isPending: isStoreLoading } = usePostVariazione(prodotto_id);
  const { mutate: updateVariazione, isPending: isUpdateLoading } = usePutVariazione(
    prodotto_id,
    variazioneId as number
  );

  const { mutate: deleteVariazione, isPending: isDeleteLoading } = useDeleteVariazione(prodotto_id);
  const { data: variazioneSelezionata, isLoading: isLoadingVariazione } = useGetVariazione(
    prodotto_id,
    variazione?.id
  );
  const stockStati = useGetStockStati();

  useEffect(() => {
    const initForm = async () => {
      if (open) {
        try {
          if (variazione && variazioneSelezionata && prodotto) {
            console.log('=== DEBUG VARIAZIONE EDIT ===');
            console.log('Tutti gli attributi del prodotto:', prodotto.attributes);
            console.log('Attributi della variazione salvata:', variazioneSelezionata.attributes);

            // PRENDI TUTTI gli attributi del prodotto che usano le variazioni
            const attributiArricchiti =
              prodotto.attributes
                ?.filter((attr: any) => {
                  // Gestisci sia boolean che stringhe/numeri
                  const isVariation =
                    attr.variation === true ||
                    attr.variation === 1 ||
                    attr.variation === '1' ||
                    attr.variation === 'true';
                  console.log(
                    `Attributo prodotto "${attr.name}" variation=${attr.variation} -> incluso: ${isVariation}`
                  );
                  return isVariation;
                })
                .map((prodottoAttr: any) => {
                  // Cerca se questo attributo ha già un valore salvato nella variazione
                  const varAttr = variazioneSelezionata.attributes?.find((vAttr: any) => {
                    if (!prodottoAttr.id || prodottoAttr.id === 0) {
                      // Attributo interno: confronta per nome
                      return vAttr.name === prodottoAttr.name;
                    } else {
                      // Attributo globale: confronta per ID o nome
                      return vAttr.id === prodottoAttr.id || vAttr.name === prodottoAttr.name;
                    }
                  });

                  const result = {
                    id: prodottoAttr.id || 0,
                    name: prodottoAttr.name,
                    option: varAttr?.option || '', // Usa il valore salvato, oppure vuoto
                    options: prodottoAttr.options || [], // Opzioni disponibili dal prodotto
                  };

                  console.log(`Attributo mappato "${prodottoAttr.name}":`, {
                    trovatoInVariazione: !!varAttr,
                    option: result.option,
                    options: result.options.length,
                  });

                  return result;
                }) || [];

            console.log('Attributi arricchiti in edit (TUTTI dal prodotto):', attributiArricchiti);

            const formValues = {
              ...variazioneSelezionata,
              attributes: attributiArricchiti,
              // Se lo SKU è uguale a quello del prodotto padre, non impostarlo (lascialo vuoto per ereditare)
              sku: variazioneSelezionata.sku === prodotto.sku ? '' : variazioneSelezionata.sku,
              // Gestisci manageStock: converte in booleano (true se è esplicitamente true, false altrimenti)
              manageStock:
                !!(variazioneSelezionata.manageStock as any) &&
                (variazioneSelezionata.manageStock as any) !== 'parent',
              // stockQuantity: usa valore della variazione o 0
              stockQuantity: Number(variazioneSelezionata.stockQuantity) || 0,
              // stockStatus: usa valore della variazione o instock
              stockStatus: String(variazioneSelezionata.stockStatus || 'instock'),
            };

            reset(formValues);
          } else if (!variazione && prodotto) {
            // Nuova variazione - popola gli attributi dal prodotto
            console.log('=== DEBUG VARIAZIONE FORM ===');
            console.log('Tutti gli attributi del prodotto:', prodotto.attributes);
            prodotto.attributes?.forEach((attr: any) => {
              console.log(`Attributo "${attr.name}":`, {
                variation: attr.variation,
                type: typeof attr.variation,
                check: attr.variation === true,
              });
            });

            const attributiVariazione =
              prodotto.attributes
                ?.filter((attr: any) => {
                  // Gestisci sia boolean che stringhe/numeri
                  const isVariation =
                    attr.variation === true ||
                    attr.variation === 1 ||
                    attr.variation === '1' ||
                    attr.variation === 'true';
                  console.log(
                    `Attributo "${attr.name}" variation=${attr.variation} -> incluso: ${isVariation}`
                  );
                  return isVariation;
                })
                .map((attr: any) => ({
                  id: attr.id || 0,
                  name: attr.name,
                  option: '', // Da selezionare
                  options: attr.options || [], // Lista opzioni disponibili
                })) || [];

            console.log('Attributi filtrati per variazione:', attributiVariazione);

            reset({
              id: undefined,
              sku: '',
              shippingClass: '',
              regularPrice: '',
              salePrice: '',
              manageStock: false,
              stockQuantity: 0,
              stockStatus: 'instock',
              attributes: attributiVariazione,
            });
          }
        } catch (error) {
          console.error("Errore durante l'inizializzazione del form:", error);
        }
      }
    };

    initForm();
  }, [open, variazione, prodotto_id, variazioneSelezionata, prodotto, reset]);

  const onSubmit = async (data: any) => {
    try {
      // // Validazione: tutti gli attributi devono avere un'opzione selezionata
      const attributiNonSelezionati = data.attributes?.filter((attr: any) => !attr.option) || [];
      if (attributiNonSelezionati.length > 0) {
        alert("Seleziona un'opzione per tutti gli attributi prima di salvare");
        return;
      }

      // Prepara i dati nel formato corretto per l'API
      const formattedData: any = {
        attributes:
          data.attributes?.map((attr: any) => ({
            id: attr.id,
            name: attr.name,
            option: attr.option,
          })) || [],
        manageStock: data.manageStock ? true : 'parent',
      };

      // Aggiungi campi opzionali solo se presenti e diversi da quelli del prodotto padre
      // SKU: invia solo se presente E diverso da quello del padre (altrimenti eredita)
      if (data.sku && data.sku.trim() !== '' && data.sku !== prodotto?.sku) {
        formattedData.sku = data.sku.trim();
      }
      if (data.shippingClass) {
        formattedData.shippingClass = data.shippingClass;
      }

      data.salePrice ? (formattedData.salePrice = data.salePrice) : (formattedData.salePrice = '');
      data.regularPrice
        ? (formattedData.regularPrice = data.regularPrice)
        : (formattedData.regularPrice = '');

      if (data.stockStatus) {
        formattedData.stockStatus = data.stockStatus;
      }
      if (data.manageStock && data.stockQuantity) {
        formattedData.stockQuantity = data.stockQuantity;
      }

      onClose();

      if (data.id) {
        updateVariazione(
          { id: data.id, data: formattedData },
          {
            onSuccess: () => {
              onSubmitSuccess?.();
            },
          }
        );
      } else {
        storeVariazione(formattedData, {
          onSuccess: () => {
            onSubmitSuccess?.();
          },
        });
      }
    } catch (error) {
      console.error('Error saving variation:', error);
    }
  };

  const handleDelete = async () => {
    if (!variazioneId) return;

    if (confirm('Sei sicuro di voler eliminare questa variazione?')) {
      deleteVariazione(variazioneId, {
        onSuccess: () => {
          onSubmitSuccess?.();
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {variazione?.id ? `Variazione ${variazione.sku}` : 'Nuova variazione'}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {variazione?.id && (
            <Grid container spacing={2} sx={{ mt: 1, mb: 1 }}>
              <Grid item xs={12} md={12}>
                <TextField fullWidth label="ID" value={variazione?.id} disabled />
              </Grid>
            </Grid>
          )}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
              <Typography>Attributi </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {isLoadingVariazione ? (
                <CircularProgress />
              ) : (
                <Grid container spacing={2}>
                  <Controller
                    name="attributes"
                    control={control}
                    render={({ field }) => (
                      <>
                        {field.value?.map((attributo: any, index: number) => (
                          <Grid item xs={12} md={6} key={index}>
                            <FormControl fullWidth>
                              <InputLabel>{attributo.name}</InputLabel>
                              <Select
                                value={attributo.option || ''}
                                onChange={(e) => {
                                  const newValue = [...field.value];
                                  newValue[index] = {
                                    ...newValue[index],
                                    option: e.target.value,
                                  };
                                  field.onChange(newValue);
                                }}
                                label={attributo.name}
                              >
                                {attributo.options?.map((opzione: string, opzioneIndex: number) => (
                                  <MenuItem key={opzioneIndex} value={opzione}>
                                    {opzione}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        ))}
                      </>
                    )}
                  />
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }} defaultExpanded>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
              <Typography>Specifiche Variazione</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => {
                      // Se lo SKU della variazione è uguale a quello del prodotto, mostralo solo come placeholder
                      const isSkuFromParent = field.value === prodotto?.sku;
                      const displayValue = isSkuFromParent ? '' : field.value;

                      return (
                        <TextField
                          {...field}
                          fullWidth
                          label="SKU Variazione"
                          value={displayValue}
                          placeholder={
                            prodotto?.sku
                              ? `Eredita: ${prodotto.sku}`
                              : 'Lascia vuoto per ereditare'
                          }
                          helperText="Lascia vuoto per usare lo SKU del prodotto padre"
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="shippingClass"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Classe di spedizione" />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="regularPrice"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField}
                        fullWidth
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        label="Prezzo Listino"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="salePrice"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField}
                        fullWidth
                        label="Prezzo Scontato"
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {STOCK_ENABLED === '1' && (
            <Accordion sx={{ mt: 2 }} defaultExpanded>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography>Magazzino</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Controller
                      name="manageStock"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label="Gestione magazzino"
                        />
                      )}
                    />
                  </Grid>

                  {manageStock ? (
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="stockQuantity"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            fullWidth
                            label="Quantità magazzino"
                          />
                        )}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="stockStatus"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Stato Stock</InputLabel>
                            <Select {...field} label="Stato Stock">
                              {stockStati.map((stato) => (
                                <MenuItem key={stato.value} value={stato.value}>
                                  {stato.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            {variazioneId ? (
              <Button
                variant="outlined"
                onClick={handleDelete}
                color="error"
                disabled={isDeleteLoading}
                startIcon={
                  isDeleteLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Iconify icon="eva:trash-2-fill" />
                  )
                }
              >
                Elimina variazione
              </Button>
            ) : (
              <Box></Box>
            )}
            <Box>
              <Button onClick={onClose} sx={{ mr: 1 }}>
                Annulla
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isStoreLoading || isUpdateLoading}
                startIcon={
                  isStoreLoading || isUpdateLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Iconify icon="eva:save-fill" />
                  )
                }
              >
                {isStoreLoading || isUpdateLoading ? 'Salvataggio...' : 'Salva variazione'}
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
