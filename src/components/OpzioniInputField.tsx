import { Autocomplete, TextField, Chip } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface OpzioniInputFieldProps {
  control: Control<any>;
  name: string;
  attributo_id?: number;
}

/**
 * Componente per inserire manualmente le opzioni di un attributo interno/custom.
 * Utilizzato quando l'attributo è specifico del prodotto (non globale).
 * Permette di digitare liberamente le opzioni senza selezionare da una lista predefinita.
 */
export function OpzioniInputField({ control, name, attributo_id }: OpzioniInputFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          multiple
          freeSolo
          value={field.value || []}
          onChange={(_, newValue) => {
            // Converte tutto in stringhe e rimuove duplicati
            const values = newValue.map((item) => String(item).trim()).filter(Boolean);
            const uniqueValues = [...new Set(values)];
            field.onChange(uniqueValues);
          }}
          options={[]} // Nessuna opzione predefinita per attributi interni
          getOptionLabel={(option) => String(option)}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Valori opzioni"
              placeholder="Digita il valore e premi Invio per aggiungere"
              fullWidth
              helperText="Scrivi i valori delle opzioni e premi Invio dopo ciascuno per aggiungerli"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={String(option)} {...getTagProps({ index })} sx={{ margin: '2px' }} />
            ))
          }
        />
      )}
    />
  );
}
