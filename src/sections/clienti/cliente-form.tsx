import {
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { Cliente } from 'src/types/Cliente';
import { usePostCliente } from 'src/hooks/usePostCliente';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { usePutCliente } from 'src/hooks/usePutCliente';
import { Iconify } from 'src/components/iconify';
import { useAccordionStyles } from 'src/hooks/useAccordionStyles';

interface ClienteFormProps {
  cliente: Cliente;
  onSubmit: (data: any) => void;
}

export function ClienteForm({ cliente, onSubmit }: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    defaultValues: {
      email: cliente?.email || '',
      firstName: cliente?.firstName || '',
      lastName: cliente?.lastName || '',
      username: cliente?.username || '',
      // Billing
      billingFirst: cliente?.billing?.firstName || '',
      billingLast: cliente?.billing?.lastName || '',
      billingCompany: cliente?.billing?.company || '',
      billingAddress1: cliente?.billing?.address_1 || '',
      billingAddress2: cliente?.billing?.address_2 || '',
      billingCity: cliente?.billing?.city || '',
      billingState: cliente?.billing?.state || '',
      billingPostcode: cliente?.billing?.postcode || '',
      billingCountry: cliente?.billing?.country || '',
      billingEmail: cliente?.billing?.email || '',
      billingPhone: cliente?.billing?.phone || '',
      // Shipping
      shippingFirst: cliente?.shipping?.firstName || '',
      shippingLast: cliente?.shipping?.lastName || '',
      shippingCompany: cliente?.shipping?.company || '',
      shippingAddress1: cliente?.shipping?.address_1 || '',
      shippingAddress2: cliente?.shipping?.address_2 || '',
      shippingCity: cliente?.shipping?.city || '',
      shippingState: cliente?.shipping?.state || '',
      shippingPostcode: cliente?.shipping?.postcode || '',
      shippingCountry: cliente?.shipping?.country || '',
    },
  });

  const { mutate: createCliente, isPending: isPosting } = usePostCliente();
  const { mutate: updateCliente, isPending: isUpdating } = usePutCliente();
  const getAccordionStyles = useAccordionStyles();

  const onSubmitForm = async (data: any) => {
    // Prepara i dati per l'API - Solo invia billing e shipping se hanno almeno un campo
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

    const clienteData: any = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
    };

    // Aggiungi billing solo se ci sono dati
    if (hasBillingData) {
      clienteData.billing = {};
      if (data.billingFirst) clienteData.billing.firstName = data.billingFirst;
      if (data.billingLast) clienteData.billing.lastName = data.billingLast;
      if (data.billingCompany) clienteData.billing.company = data.billingCompany;
      if (data.billingAddress1) clienteData.billing.address_1 = data.billingAddress1;
      if (data.billingAddress2) clienteData.billing.address_2 = data.billingAddress2;
      if (data.billingCity) clienteData.billing.city = data.billingCity;
      if (data.billingState) clienteData.billing.state = data.billingState;
      if (data.billingPostcode) clienteData.billing.postcode = data.billingPostcode;
      if (data.billingCountry) clienteData.billing.country = data.billingCountry;
      // Solo aggiungi email e phone se sono validi
      if (data.billingEmail && data.billingEmail.includes('@')) {
        clienteData.billing.email = data.billingEmail;
      }
      if (data.billingPhone) clienteData.billing.phone = data.billingPhone;
    }

    // Aggiungi shipping solo se ci sono dati
    if (hasShippingData) {
      clienteData.shipping = {};
      if (data.shippingFirst) clienteData.shipping.firstName = data.shippingFirst;
      if (data.shippingLast) clienteData.shipping.lastName = data.shippingLast;
      if (data.shippingCompany) clienteData.shipping.company = data.shippingCompany;
      if (data.shippingAddress1) clienteData.shipping.address_1 = data.shippingAddress1;
      if (data.shippingAddress2) clienteData.shipping.address_2 = data.shippingAddress2;
      if (data.shippingCity) clienteData.shipping.city = data.shippingCity;
      if (data.shippingState) clienteData.shipping.state = data.shippingState;
      if (data.shippingPostcode) clienteData.shipping.postcode = data.shippingPostcode;
      if (data.shippingCountry) clienteData.shipping.country = data.shippingCountry;
    }

    // Rimuovi oggetti billing/shipping vuoti dopo averli creati
    if (clienteData.billing && Object.keys(clienteData.billing).length === 0) {
      delete clienteData.billing;
    }
    if (clienteData.shipping && Object.keys(clienteData.shipping).length === 0) {
      delete clienteData.shipping;
    }

    // Pulizia aggiuntiva: rimuovi valori che sono stringhe vuote dopo trim
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

    if (clienteData.billing) {
      const cleaned = cleanObject(clienteData.billing);
      if (Object.keys(cleaned).length > 0) {
        clienteData.billing = cleaned;
      } else {
        delete clienteData.billing;
      }
    }

    if (clienteData.shipping) {
      const cleaned = cleanObject(clienteData.shipping);
      if (Object.keys(cleaned).length > 0) {
        clienteData.shipping = cleaned;
      } else {
        delete clienteData.shipping;
      }
    }

    // Rimuovi metaData se presente (sono read-only e possono causare errori se hanno valori vuoti)
    if (clienteData.metaData) {
      delete clienteData.metaData;
    }

    // Debug: log dei dati che stiamo inviando
    console.log('Cliente data da inviare:', JSON.stringify(clienteData, null, 2));

    if (cliente) {
      // In modalità update, rimuovi i campi read-only e metaData
      const { metaData, ...clienteClean } = cliente;

      // In modalità update, merge con i dati esistenti ma priorità ai nuovi dati
      const updateData: any = {
        ...clienteClean,
        ...clienteData,
        id: cliente.id,
      };

      // Rimuovi definitivamente metaData se presente
      if (updateData.metaData) {
        delete updateData.metaData;
      }

      // Se billing è vuoto ma esisteva prima, rimuovilo completamente
      if (!clienteData.billing && cliente.billing) {
        updateData.billing = null;
      }

      // Se shipping è vuoto ma esisteva prima, rimuovilo completamente
      if (!clienteData.shipping && cliente.shipping) {
        updateData.shipping = null;
      }

      updateCliente(updateData as any, {
        onSuccess: () => onSubmit(clienteData),
        onError: (error) => {
          console.error('Errore durante il salvataggio del cliente:', error);
        },
      });
    } else {
      createCliente(clienteData as any, {
        onSuccess: () => onSubmit(clienteData),
        onError: (error) => {
          console.error('Errore durante il salvataggio del cliente:', error);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={2}>
        {cliente?.id && (
          <>
            <Grid item xs={12}>
              <TextField fullWidth label="ID" value={cliente.id} disabled />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Informazioni Base
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email *"
            {...register('email', { required: true })}
            error={!!errors.email}
            helperText={errors.email && "L'email è obbligatoria"}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Username" {...register('username')} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Nome" {...register('firstName')} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Cognome" {...register('lastName')} />
        </Grid>

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
                  <TextField fullWidth label="Email Fatturazione" {...register('billingEmail')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Telefono" {...register('billingPhone')} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

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
            {isPosting || isUpdating ? 'Salvataggio...' : 'Salva Cliente'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
