import { Autocomplete, TextField, Chip } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface AttributoOpzione {
  id: number;
  name: string;
  slug: string;
}

interface AttributoAutocompleteProps {
  control: Control<any>;
  attributoDetails?: any; // Opzionale per retrocompatibilità
  options?: (AttributoOpzione | string)[]; // Opzioni passate dall'esterno: possono essere stringhe o oggetti
}

export function AttributoAutocomplete({
  control,
  attributoDetails,
  options,
}: AttributoAutocompleteProps) {
  // Usa le options passate dall'esterno, altrimenti usa quelle di attributoDetails
  const availableOptions = options || attributoDetails?.options || [];

  return (
    <Controller
      name="options"
      control={control}
      render={({ field }) => (
        <Autocomplete
          multiple
          freeSolo
          value={field.value || []}
          onChange={(_, newValue) => {
            const values = newValue.map((item) => {
              if (typeof item === 'string') return item;
              if (typeof item === 'object') return item?.name || item?.slug || String(item);
              return String(item);
            });
            const uniqueValues = [...new Set(values)];
            field.onChange(uniqueValues);
          }}
          options={availableOptions}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option?.name || '')}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Valore Attributo"
              placeholder="Seleziona dalle opzioni o digita per aggiungere"
              fullWidth
              helperText="Seleziona dalle opzioni esistenti o scrivi per crearne di nuove"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={typeof option === 'string' ? option : option?.name || ''}
                {...getTagProps({ index })}
              />
            ))
          }
        />
      )}
    />
  );
}
