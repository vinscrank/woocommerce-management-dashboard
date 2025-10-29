import {
  Grid,
  TextField,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Ordine } from 'src/types/Ordine';
import { usePostOrdine } from 'src/hooks/usePostOrdine';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { usePutOrdine } from 'src/hooks/usePutOrdine';
import { Iconify } from 'src/components/iconify';
import { useAccordionStyles } from 'src/hooks/useAccordionStyles';
import dayjs from 'dayjs';
import { useOrderStatus } from 'src/hooks/useOrderStatus';

interface OrdineFormProps {
  ordine: Ordine;
  onSubmit: (data: any) => void;
}

export function OrdineForm({ ordine, onSubmit }: OrdineFormProps) {
  const { statuses } = useOrderStatus();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      status: ordine?.status || 'pending',
      currency: ordine?.currency || 'EUR',
      customerId: ordine?.customerId || '',
      customerNote: ordine?.customerNote || '',
      // Billing
      billingFirst: ordine?.billing?.firstName || '',
      billingLast: ordine?.billing?.lastName || '',
      billingCompany: ordine?.billing?.company || '',
      billingAddress1: ordine?.billing?.address_1 || '',
      billingAddress2: ordine?.billing?.address_2 || '',
      billingCity: ordine?.billing?.city || '',
      billingState: ordine?.billing?.state || '',
      billingPostcode: ordine?.billing?.postcode || '',
      billingCountry: ordine?.billing?.country || '',
      billingEmail: ordine?.billing?.email || '',
      billingPhone: ordine?.billing?.phone || '',
      // Shipping
      shippingFirst: ordine?.shipping?.firstName || '',
      shippingLast: ordine?.shipping?.lastName || '',
      shippingCompany: ordine?.shipping?.company || '',
      shippingAddress1: ordine?.shipping?.address_1 || '',
      shippingAddress2: ordine?.shipping?.address_2 || '',
      shippingCity: ordine?.shipping?.city || '',
      shippingState: ordine?.shipping?.state || '',
      shippingPostcode: ordine?.shipping?.postcode || '',
      shippingCountry: ordine?.shipping?.country || '',
      // Payment
      paymentMethod: ordine?.paymentMethod || '',
      paymentMethodTitle: ordine?.paymentMethodTitle || '',
      transactionId: ordine?.transactionId || '',
    },
  });

  const { mutate: createOrdine, isPending: isPosting } = usePostOrdine();
  const { mutate: updateOrdine, isPending: isUpdating } = usePutOrdine();
  const getAccordionStyles = useAccordionStyles();

  const onSubmitForm = async (data: any) => {
    const hasBillingData =
      data.billingFirst ||
      data.billingLast ||
      data.billingCompany ||
      data.billingAddress1 ||
      data.billingAddress2 ||
      data.billingCity ||
      data.billingState ||
      data.billingPostcode ||
      data.billingCountry ||
      data.billingEmail ||
      data.billingPhone;

    const hasShippingData =
      data.shippingFirst ||
      data.shippingLast ||
      data.shippingCompany ||
      data.shippingAddress1 ||
      data.shippingAddress2 ||
      data.shippingCity ||
      data.shippingState ||
      data.shippingPostcode ||
      data.shippingCountry;

    const ordineData: any = {
      status: data.status,
      currency: data.currency,
      customerNote: data.customerNote || '',
    };

    console.log('🎯 Stato ordine da salvare:', data.status);

    // Solo aggiungi campi numerici se hanno valore
    if (data.customerId && data.customerId !== '') {
      ordineData.customerId = parseInt(data.customerId);
    }

    // Solo aggiungi campi se hanno valore
    if (data.paymentMethod && data.paymentMethod.trim()) {
      ordineData.paymentMethod = data.paymentMethod;
    }

    if (data.paymentMethodTitle && data.paymentMethodTitle.trim()) {
      ordineData.paymentMethodTitle = data.paymentMethodTitle;
    }

    if (data.transactionId && data.transactionId.trim()) {
      ordineData.transactionId = data.transactionId;
    }

    if (hasBillingData) {
      ordineData.billing = {};
      if (data.billingFirst) ordineData.billing.firstName = data.billingFirst;
      if (data.billingLast) ordineData.billing.lastName = data.billingLast;
      if (data.billingCompany) ordineData.billing.company = data.billingCompany;
      if (data.billingAddress1) ordineData.billing.address_1 = data.billingAddress1;
      if (data.billingAddress2) ordineData.billing.address_2 = data.billingAddress2;
      if (data.billingCity) ordineData.billing.city = data.billingCity;
      if (data.billingState) ordineData.billing.state = data.billingState;
      if (data.billingPostcode) ordineData.billing.postcode = data.billingPostcode;
      if (data.billingCountry) ordineData.billing.country = data.billingCountry;
      if (data.billingEmail && data.billingEmail.includes('@')) {
        ordineData.billing.email = data.billingEmail;
      }
      if (data.billingPhone) ordineData.billing.phone = data.billingPhone;
    }

    if (hasShippingData) {
      ordineData.shipping = {};
      if (data.shippingFirst) ordineData.shipping.firstName = data.shippingFirst;
      if (data.shippingLast) ordineData.shipping.lastName = data.shippingLast;
      if (data.shippingCompany) ordineData.shipping.company = data.shippingCompany;
      if (data.shippingAddress1) ordineData.shipping.address_1 = data.shippingAddress1;
      if (data.shippingAddress2) ordineData.shipping.address_2 = data.shippingAddress2;
      if (data.shippingCity) ordineData.shipping.city = data.shippingCity;
      if (data.shippingState) ordineData.shipping.state = data.shippingState;
      if (data.shippingPostcode) ordineData.shipping.postcode = data.shippingPostcode;
      if (data.shippingCountry) ordineData.shipping.country = data.shippingCountry;
    }

    // Pulizia finale
    const cleanObject = (obj: any) => {
      const cleaned: any = {};
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') {
          const trimmed = obj[key].trim();
          if (trimmed.length > 0) {
            cleaned[key] = trimmed;
          }
        } else if (obj[key] !== null && obj[key] !== undefined) {
          cleaned[key] = obj[key];
        }
      });
      return cleaned;
    };

    if (ordineData.billing) {
      const cleaned = cleanObject(ordineData.billing);
      if (Object.keys(cleaned).length > 0) {
        ordineData.billing = cleaned;
      } else {
        delete ordineData.billing;
      }
    }

    if (ordineData.shipping) {
      const cleaned = cleanObject(ordineData.shipping);
      if (Object.keys(cleaned).length > 0) {
        ordineData.shipping = cleaned;
      } else {
        delete ordineData.shipping;
      }
    }

    // Funzione per rimuovere valori vuoti ricorsivamente
    const removeEmptyValues = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj
          .map((item) => removeEmptyValues(item))
          .filter((item) => item !== null && item !== undefined);
      }

      if (obj === null || obj === undefined) {
        return undefined;
      }

      if (typeof obj !== 'object') {
        // Se è una stringa vuota, non includerla
        if (typeof obj === 'string' && obj.trim() === '') {
          return undefined;
        }
        return obj;
      }

      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = removeEmptyValues(value);
        if (cleanedValue !== undefined && cleanedValue !== null) {
          cleaned[key] = cleanedValue;
        }
      }

      // Ritorna undefined se l'oggetto è vuoto
      return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    };

    const cleanOrdineData = removeEmptyValues(ordineData);

    // Rimuovi campi read-only che non devono essere inviati
    const fieldsToRemove = [
      'id',
      'parentId',
      'number',
      'orderKey',
      'createdVia',
      'version',
      'dateCreated',
      'dateCreatedGmt',
      'dateModified',
      'dateModifiedGmt',
      'discountTotal',
      'discountTax',
      'shippingTotal',
      'shippingTax',
      'cartTax',
      'total',
      'totalTax',
      'pricesIncludeTax',
      'customerIpAddress',
      'customerUserAgent',
      'datePaid',
      'datePaidGmt',
      'dateCompleted',
      'dateCompletedGmt',
      'cartHash',
      'metaData',
      'lineItems',
      'taxLines',
      'shippingLines',
      'feeLines',
      'couponLines',
      'refunds',
      'createdAt',
      'updatedAt',
      'createdAtGmt',
      'updatedAtGmt',
    ];

    // Pulisci dai campi non inviabili
    const finalOrdineData = { ...cleanOrdineData };
    fieldsToRemove.forEach((field) => {
      delete finalOrdineData[field];
    });

    console.log('📤 Ordine data da inviare:', JSON.stringify(finalOrdineData, null, 2));
    console.log('📤 Stato nel payload finale:', finalOrdineData.status);

    if (ordine) {
      // Per update, aggiungi solo l'ID del ordine
      updateOrdine(
        {
          ...finalOrdineData,
          id: ordine.id,
        } as any,
        {
          onSuccess: () => onSubmit(ordineData),
          onError: (error) => {
            console.error("Errore durante il salvataggio dell'ordine:", error);
          },
        }
      );
    } else {
      createOrdine(finalOrdineData as any, {
        onSuccess: () => onSubmit(ordineData),
        onError: (error) => {
          console.error("Errore durante il salvataggio dell'ordine:", error);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={2}>
        {ordine?.id && (
          <>
            <Grid item xs={12}>
              <TextField fullWidth label="ID" value={ordine.id} disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Numero Ordine" value={ordine.number || '-'} disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data Creazione"
                value={
                  ordine.dateCreated ? dayjs(ordine.dateCreated).format('DD/MM/YYYY HH:mm') : '-'
                }
                disabled
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Informazioni Ordine
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="status"
            control={control}
            defaultValue={ordine?.status || 'pending'}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Stato Ordine</InputLabel>
                <Select
                  {...field}
                  value={field.value || ordine?.status || 'pending'}
                  label="Stato Ordine"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Valuta" {...register('currency')} defaultValue="EUR" />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="ID Cliente" type="number" {...register('customerId')} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Note Cliente"
            multiline
            rows={3}
            {...register('customerNote')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Metodo Pagamento" {...register('paymentMethod')} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Titolo Metodo Pagamento"
            {...register('paymentMethodTitle')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth label="ID Transazione" {...register('transactionId')} />
        </Grid>

        {/* Totale Ordine - Solo visualizzazione */}
        {ordine && (
          <Grid item xs={12}>
            <Accordion sx={getAccordionStyles('Totali Ordine')}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography>Totali Ordine</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Subtotale"
                      value={`${ordine.total || '0.00'} ${ordine.currency || 'EUR'}`}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Tasse"
                      value={`${ordine.totalTax || '0.00'} ${ordine.currency || 'EUR'}`}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Sconto"
                      value={`${ordine.discountTotal || '0.00'} ${ordine.currency || 'EUR'}`}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Spedizione"
                      value={`${ordine.shippingTotal || '0.00'} ${ordine.currency || 'EUR'}`}
                      disabled
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {/* Line Items - Prodotti Ordinati */}
        {ordine?.lineItems && ordine.lineItems.length > 0 && (
          <Grid item xs={12}>
            <Accordion sx={getAccordionStyles('Prodotti Ordinati')}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography>Prodotti Ordinati ({ordine.lineItems.length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {ordine.lineItems.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      key={index}
                      sx={{
                        borderBottom:
                          index < ordine.lineItems!.length - 1 ? '1px solid #e0e0e0' : 'none',
                        pb: 2,
                        mb: 2,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Prodotto"
                            value={`${item.name || '-'} (ID: ${item.productId || '-'})`}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Quantità"
                            value={item.quantity || '-'}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Subtotale"
                            value={`${item.subtotal || '0.00'} ${ordine.currency || 'EUR'}`}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Totale"
                            value={`${item.total || '0.00'} ${ordine.currency || 'EUR'}`}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {/* Tax Lines */}
        {ordine?.taxLines && ordine.taxLines.length > 0 && (
          <Grid item xs={12}>
            <Accordion sx={getAccordionStyles('Tasse')}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography>Tasse ({ordine.taxLines.length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {ordine.taxLines.map((tax, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Tipo Tassa"
                            value={tax.label || '-'}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Totale Tassa"
                            value={`${tax.taxTotal || '0.00'} ${ordine.currency || 'EUR'}`}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {/* Billing Address */}
        <Grid item xs={12}>
          <Accordion sx={getAccordionStyles('Indirizzo di Fatturazione')}>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
              <Typography>Indirizzo di Fatturazione</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Nome" {...register('billingFirst')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Cognome" {...register('billingLast')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Azienda" {...register('billingCompany')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Indirizzo" {...register('billingAddress1')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Indirizzo (seconda linea)"
                    {...register('billingAddress2')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Città" {...register('billingCity')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Stato/Provincia" {...register('billingState')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="CAP" {...register('billingPostcode')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Paese" {...register('billingCountry')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Email" {...register('billingEmail')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Telefono" {...register('billingPhone')} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Coupon Lines */}
        {ordine?.couponLines && ordine.couponLines.length > 0 && (
          <Grid item xs={12}>
            <Accordion sx={getAccordionStyles('Coupon Applicati')}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography>Coupon Applicati ({ordine.couponLines.length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {ordine.couponLines.map((couponLine, index) => (
                    <Grid item xs={12} key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Codice Coupon"
                            value={couponLine.code || '-'}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Sconto"
                            value={couponLine.discount || '0.00'}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Sconto Tax"
                            value={couponLine.discountTax || '0.00'}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {/* Shipping Address */}
        <Grid item xs={12}>
          <Accordion sx={getAccordionStyles('Indirizzo di Spedizione')}>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
              <Typography>Indirizzo di Spedizione</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Nome" {...register('shippingFirst')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Cognome" {...register('shippingLast')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Azienda" {...register('shippingCompany')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Indirizzo" {...register('shippingAddress1')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Indirizzo (seconda linea)"
                    {...register('shippingAddress2')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Città" {...register('shippingCity')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Stato/Provincia" {...register('shippingState')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="CAP" {...register('shippingPostcode')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Paese" {...register('shippingCountry')} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPosting || isUpdating}
          >
            {isPosting || isUpdating ? 'Salvataggio...' : 'Salva Ordine'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
