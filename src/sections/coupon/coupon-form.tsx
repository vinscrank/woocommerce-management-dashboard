import {
  Grid,
  TextField,
  Typography,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Coupon } from 'src/types/Coupon';
import { usePostCoupon } from 'src/hooks/usePostCoupon';
import { useForm, Controller } from 'react-hook-form';
import { usePutCoupon } from 'src/hooks/usePutCoupon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface CouponFormProps {
  coupon: Coupon;
  onSubmit: (data: any) => void;
}

const DISCOUNT_TYPES = [
  { value: 'percent', label: 'Percentuale' },
  { value: 'fixed_cart', label: 'Importo Fisso (carrello)' },
  { value: 'fixed_product', label: 'Importo Fisso (prodotto)' },
];

export function CouponForm({ coupon, onSubmit }: CouponFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      code: coupon?.code || '',
      amount: coupon?.amount || '',
      discountType: coupon?.discountType || 'percent',
      description: coupon?.description || '',
      usageLimit: coupon?.usageLimit || '',
      usageLimitPerUser: coupon?.usageLimitPerUser || '',
      individualUse: coupon?.individualUse || false,
      freeShipping: coupon?.freeShipping || false,
      excludeSaleItems: coupon?.excludeSaleItems || false,
      minimumAmount: coupon?.minimumAmount || '',
      maximumAmount: coupon?.maximumAmount || '',
      dateExpires: coupon?.dateExpires ? dayjs(coupon.dateExpires) : null,
    },
  });

  const { mutate: createCoupon, isPending: isPosting } = usePostCoupon();
  const { mutate: updateCoupon, isPending: isUpdating } = usePutCoupon();

  const onSubmitForm = async (data: any) => {
    const couponData: any = {
      code: data.code,
      amount: data.amount,
      discountType: data.discountType,
      description: data.description,
      individualUse: data.individualUse,
      freeShipping: data.freeShipping,
      excludeSaleItems: data.excludeSaleItems,
    };

    if (data.usageLimit && data.usageLimit !== '') {
      couponData.usageLimit = parseInt(data.usageLimit);
    }

    if (data.usageLimitPerUser && data.usageLimitPerUser !== '') {
      couponData.usageLimitPerUser = parseInt(data.usageLimitPerUser);
    }

    if (data.minimumAmount && data.minimumAmount !== '') {
      couponData.minimumAmount = data.minimumAmount;
    }

    if (data.maximumAmount && data.maximumAmount !== '') {
      couponData.maximumAmount = data.maximumAmount;
    }

    if (data.dateExpires && dayjs(data.dateExpires).isValid()) {
      const dateExpires = dayjs(data.dateExpires).toISOString();
      couponData.dateExpires = dateExpires;
      couponData.dateExpiresGmt = dateExpires;
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

      return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    };

    const cleanCouponData = removeEmptyValues(couponData);

    console.log('📤 Coupon data da inviare:', JSON.stringify(cleanCouponData, null, 2));

    if (coupon) {
      updateCoupon(
        {
          ...cleanCouponData,
          id: coupon.id,
        } as any,
        {
          onSuccess: () => onSubmit(couponData),
          onError: (error) => {
            console.error('Errore durante il salvataggio del coupon:', error);
          },
        }
      );
    } else {
      createCoupon(cleanCouponData as any, {
        onSuccess: () => onSubmit(couponData),
        onError: (error) => {
          console.error('Errore durante il salvataggio del coupon:', error);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={2}>
        {coupon?.id && (
          <Grid item xs={12}>
            <TextField fullWidth label="ID" value={coupon.id} disabled />
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Informazioni Coupon
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Codice *"
            {...register('code', { required: true })}
            error={!!errors.code}
            helperText={errors.code && 'Il codice è obbligatorio'}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Importo *"
            {...register('amount', { required: true })}
            error={!!errors.amount}
            helperText={errors.amount && "L'importo è obbligatorio"}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="discountType"
            control={control}
            defaultValue={coupon?.discountType || 'percent'}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Tipo Sconto</InputLabel>
                <Select {...field} value={field.value || 'percent'} label="Tipo Sconto">
                  {DISCOUNT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Descrizione" {...register('description')} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Limite Utilizzi" type="number" {...register('usageLimit')} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Limite Utilizzi per Utente"
            type="number"
            {...register('usageLimitPerUser')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Importo Minimo" {...register('minimumAmount')} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Importo Massimo" {...register('maximumAmount')} />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="dateExpires"
            control={control}
            defaultValue={coupon?.dateExpires ? dayjs(coupon.dateExpires) : null}
            render={({ field }) => (
              <DatePicker
                label="Data Scadenza"
                value={field.value}
                onChange={(date) => field.onChange(date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Opzioni
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="individualUse"
            control={control}
            defaultValue={coupon?.individualUse || false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Uso Individuale"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="freeShipping"
            control={control}
            defaultValue={coupon?.freeShipping || false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Spedizione Gratuita"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="excludeSaleItems"
            control={control}
            defaultValue={coupon?.excludeSaleItems || false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Escludi Prodotti in Saldo"
              />
            )}
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
            {isPosting || isUpdating ? 'Salvataggio...' : 'Salva Coupon'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
