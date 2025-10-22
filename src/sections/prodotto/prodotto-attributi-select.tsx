import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useGetAttributi } from 'src/hooks/useGetAttributi';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { PaginatedSelectLoadMore } from 'src/components/PaginatedSelectLoadMore';
import { Attributo } from 'src/types/Attributo';

interface ProdottoAttributiSelectProps {
  /**
   * Valore corrente dell'attributo selezionato (ID)
   */
  value: number | string | null | undefined;

  /**
   * Callback chiamato quando cambia la selezione
   */
  onChange: (attributoId: number | null) => void;

  /**
   * Lista di attributi già assegnati al prodotto (da disabilitare)
   */
  prodottoAttributes?: any[];

  /**
   * Se true, il campo è disabilitato
   */
  disabled?: boolean;

  /**
   * Se true, il campo è in errore
   */
  error?: boolean;

  /**
   * Messaggio di errore da mostrare
   */
  helperText?: string;

  /**
   * Numero di elementi per pagina (default: 25)
   */
  perPage?: number;

  /**
   * Label del campo (default: "Attributo")
   */
  label?: string;
}

/**
 * Componente per la selezione singola e paginata di un attributo
 *
 * @example
 * ```tsx
 * <ProdottoAttributiSelect
 *   value={watch('id')}
 *   onChange={(id) => setValue('id', id)}
 *   prodottoAttributes={prodotto.attributes}
 *   disabled={!!prodotto_attributo}
 * />
 * ```
 */
export function ProdottoAttributiSelect({
  value,
  onChange,
  prodottoAttributes = [],
  disabled = false,
  error,
  helperText,
  perPage = 25,
  label = 'Attributo',
}: ProdottoAttributiSelectProps) {
  // Gestione paginazione attributi con hook generico
  const [attributiPage, setAttributiPage] = useState(1);
  const { data: attributiData, isFetching: isFetchingAttributi } = useGetAttributi(
    attributiPage,
    perPage,
    ''
  );

  const {
    allItems: allAttributi,
    hasMore: hasMoreAttributi,
    loadMore: loadMoreAttributi,
  } = usePaginatedSelect<Attributo>(attributiData, isFetchingAttributi, () =>
    setAttributiPage((prev) => prev + 1)
  );

  // Debug
  console.log('ProdottoAttributiSelect - attributiPage:', attributiPage);
  console.log('ProdottoAttributiSelect - perPage:', perPage);
  console.log('ProdottoAttributiSelect - attributiData:', attributiData);
  console.log('ProdottoAttributiSelect - allAttributi.length:', allAttributi.length);
  console.log('ProdottoAttributiSelect - hasMoreAttributi:', hasMoreAttributi);

  // Handler per il cambio di selezione
  const handleChange = (selectedId: string) => {
    if (selectedId === '') {
      onChange(null);
    } else {
      onChange(Number(selectedId));
    }
  };

  return (
    <Box>
      <FormControl fullWidth error={error}>
        <InputLabel id="attributo-label">{label}</InputLabel>
        <Select
          labelId="attributo-label"
          id="attributo"
          label={label}
          value={value?.toString() || ''}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          <MenuItem value="">
            <em>Nessuno</em>
          </MenuItem>

          {allAttributi.map((attributo) => {
            // Disabilita se già presente nel prodotto
            const isAlreadyUsed = prodottoAttributes.some((attr: any) => attr.id === attributo.id);

            return (
              <MenuItem
                key={attributo.id}
                value={attributo.id?.toString() || ''}
                disabled={isAlreadyUsed}
              >
                {attributo.name}
                {isAlreadyUsed && ' (già assegnato)'}
              </MenuItem>
            );
          })}

          <PaginatedSelectLoadMore
            hasMore={hasMoreAttributi}
            isLoading={isFetchingAttributi}
            onLoadMore={loadMoreAttributi}
            loadMoreText="Carica altri attributi"
          />
        </Select>
        {helperText && (
          <Box sx={{ mt: 0.5, fontSize: '0.75rem', color: 'error.main' }}>{helperText}</Box>
        )}
      </FormControl>
    </Box>
  );
}
