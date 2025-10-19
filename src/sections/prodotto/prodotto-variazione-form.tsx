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
      prodotto_attributi_con_variazioni: [],
    },
  });

  const manageStock = watch('manageStock');
  const variazioneId = watch('id');

  const { mutate: storeVariazione, isPending: isStoreLoading } = usePostVariazione(prodotto_id);
  const { mutate: updateVariazione, isPending: isUpdateLoading } = usePutVariazione(
    prodotto_id,
    variazioneId as number
  );
  console.log('prodotto_id', prodotto_id);
  console.log('variazione?.id', variazione?.id);
  const { mutate: deleteVariazione, isPending: isDeleteLoading } = useDeleteVariazione();
  const { data: variazioneSelezionata } = useGetVariazione(prodotto_id, variazione?.id);

  useEffect(() => {
    const initForm = async () => {
      if (open) {
        try {
          // Reset completo del form prima di impostare nuovi valori
          reset({
            id: undefined,
            sku: '',
            shippingClass: '',
            regularPrice: '',
            salePrice: '',
            manageStock: false,
            stockQuantity: 0,
            stockStatus: 'instock',
            prodotto_attributi_con_variazioni: [],
          });

          if (variazione) {
            reset(variazioneSelezionata);
          } else {
            // reset(variazioneNuova, {
            //   keepDefaultValues: true,
            // });
          }
        } catch (error) {
          console.error("Errore durante l'inizializzazione del form:", error);
        }
      }
    };

    initForm();
  }, [open, variazione, prodotto_id, variazioneSelezionata, reset]);

  const onSubmit = async (data: any) => {
    try {
      onClose();
      if (data.id) {
        updateVariazione(
          { id: data.id, data },
          {
            onSuccess: () => {
              onSubmitSuccess?.();
              // onClose();
            },
          }
        );
      } else {
        storeVariazione(data, {
          onSuccess: () => {
            onSubmitSuccess?.();
            //onClose();
          },
        });
      }
    } catch (error) {
      console.error('Error saving variation:', error);
    }
  };

  const handleDelete = async () => {
    if (!variazioneId) return;

    try {
      if (confirm('Sei sicuro di voler eliminare questa variazione?')) {
        deleteVariazione(variazioneId, {
          onSuccess: () => {
            onSubmitSuccess?.();
            onClose();
          },
        });
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione della variazione:", error);
    }
  };

  const stockStati = [
    { name: 'Disponibile', value: 'instock' },
    { name: 'Esaurito', value: 'outofstock' },
    { name: 'Permette ordini arretrati', value: 'onbackorder' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {variazione?.id ? `Variazione ${variazione.name}` : 'Nuova variazione'}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
              <Typography>Attributi </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Controller
                  name="attributes"
                  control={control}
                  render={({ field }) => (
                    <>
                      {field.value?.map((attributo: any, index: number) => (
                        <Grid item xs={12} md={3} key={index}>
                          {JSON.stringify(attributo)}
                          <FormControl fullWidth>
                            <InputLabel>{attributo.name}</InputLabel>
                            <Select
                              value={attributo.option || ''}
                              onChange={(e) => {
                                const newValue = [...field.value];
                                newValue[index].option = e.target.value;
                                field.onChange(newValue);
                              }}
                              label={attributo.name}
                            >
                              {attributo.options?.map((opzione: any) => (
                                <MenuItem key={opzione.id} value={opzione.id}>
                                  {opzione.name}
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
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="SKU" value={field.value} />
                    )}
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
