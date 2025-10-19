import { Autocomplete, TextField, Chip } from '@mui/material';
import { Control, Controller } from 'react-hook-form';


interface AttributoAutocompleteProps {
  control: Control<any>;
  attributoDetails: any; // Puoi definire un tipo più specifico se necessario
}

export function AttributoAutocomplete({ control, attributoDetails }: AttributoAutocompleteProps) {
  return (
    <Controller
      name="opzioni_id"
      control={control}
      render={({ field }) => (
        <Autocomplete
          multiple
          value={field.value}
          onChange={(_, newValue) => {
            const values = newValue.map((item) => (typeof item === 'string' ? item : item.slug));
            const uniqueValues = [...new Set(values)];
            field.onChange(uniqueValues);
          }}
          options={attributoDetails?.attributoOpzioni || []}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option?.name || '')}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Valore Attributo"
              placeholder="Seleziona valore opzioni"
              fullWidth
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
