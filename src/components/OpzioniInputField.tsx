import { useState } from 'react';
import { TextField, Chip } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { useGetAttributoOpzioni } from 'src/hooks/useGetAttributoOpzioni';

interface OpzioniInputFieldProps {
  control: Control<any>;
  name: string;
  attributo_id: number;
}

export function OpzioniInputField({ control, name, attributo_id }: OpzioniInputFieldProps) {
  const { data: attributoOpzioni } = useGetAttributoOpzioni(attributo_id);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const [inputValue, setInputValue] = useState('');
        return (
          <TextField
            {...field}
            fullWidth
            label="Valori opzioni"
            placeholder="Digita e premi virgola per aggiungere"
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValue(newValue);

              if (newValue.endsWith(',')) {
                const valueToAdd = newValue.slice(0, -1).trim();
                if (valueToAdd) {
                  const newValues = [...field.value, valueToAdd];
                  field.onChange(newValues);
                }
                setInputValue('');
              }
            }}
            InputProps={{
              startAdornment: field.value.map((value: string, index: number) => (
                <Chip
                  key={index}
                  label={value}
                  onDelete={() => {
                    const newValues = [...field.value];
                    newValues.splice(index, 1);
                    field.onChange(newValues);
                  }}
                  style={{ margin: '2px' }}
                />
              )),
            }}
          />
        );
      }}
    />
  );
}
