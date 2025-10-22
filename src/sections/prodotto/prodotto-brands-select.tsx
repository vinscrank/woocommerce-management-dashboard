import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';
import { useGetBrands } from 'src/hooks/useGetBrand';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { PaginatedSelectLoadMore } from 'src/components/PaginatedSelectLoadMore';
import { Brand } from 'src/types/Brand';

interface ProdottoBrandsSelectProps {
  /**
   * Valore corrente dei brand selezionati
   * Array di brand con id, name, slug
   */
  value: any;

  /**
   * Callback chiamato quando cambia la selezione
   */
  onChange: (brands: Array<{ id: number; name: string; slug: string }>) => void;

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
}

/**
 * Componente per la selezione multipla e paginata dei brand di un prodotto
 *
 * @example
 * ```tsx
 * <ProdottoBrandsSelect
 *   value={watch('brands')}
 *   onChange={(brands) => setValue('brands', brands)}
 * />
 * ```
 */
export function ProdottoBrandsSelect({
  value,
  onChange,
  error,
  helperText,
  perPage = 25,
}: ProdottoBrandsSelectProps) {
  // Gestione paginazione brand con hook generico
  const [brandsPage, setBrandsPage] = useState(1);
  const { data: brandsData, isFetching: isFetchingBrands } = useGetBrands(brandsPage, perPage, '');

  const {
    allItems: allBrands,
    hasMore: hasMoreBrands,
    loadMore: loadMoreBrands,
  } = usePaginatedSelect<Brand>(brandsData, isFetchingBrands, () =>
    setBrandsPage((prev) => prev + 1)
  );

  // Estrae gli ID selezionati dal valore corrente
  const getSelectedIds = (): string[] => {
    if (Array.isArray(value)) {
      return value.map((brand: any) => brand.id?.toString()).filter(Boolean);
    }
    return [];
  };

  // Handler per il cambio di selezione
  const handleChange = (selectedIds: string[]) => {
    const selectedBrands = selectedIds
      .map((id) => allBrands.find((brand) => brand.id?.toString() === id))
      .filter(Boolean)
      .map((brand) => ({
        id: brand!.id!,
        name: brand!.name!,
        slug: brand!.slug!,
      }));

    onChange(selectedBrands);
  };

  // Render dei chip con i nomi dei brand
  const renderSelectedBrands = (selected: string[]) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((selectedId: string) => {
          // Prima cerca nei brand già presenti nel valore
          let brandName = selectedId; // default to ID

          if (Array.isArray(value)) {
            const brand = value.find((b: any) => b.id?.toString() === selectedId);
            if (brand?.name) brandName = brand.name;
          }

          // Se non trovato, cerca in allBrands (brand caricati)
          if (brandName === selectedId) {
            const brand = allBrands.find((b) => b.id?.toString() === selectedId);
            if (brand?.name) brandName = brand.name;
          }

          return <Chip key={selectedId} label={brandName} size="small" />;
        })}
      </Box>
    );
  };

  const selectedIds = getSelectedIds();

  return (
    <FormControl fullWidth error={error}>
      <InputLabel id="brands-label">Brands</InputLabel>
      <Select
        labelId="brands-label"
        id="brands"
        label="Brands"
        multiple
        value={selectedIds}
        onChange={(e) => handleChange(e.target.value as string[])}
        renderValue={renderSelectedBrands}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
            },
          },
        }}
      >
        {allBrands.map((brand) => (
          <MenuItem key={brand.id} value={brand.id?.toString() || ''}>
            {brand.name}
          </MenuItem>
        ))}

        <PaginatedSelectLoadMore
          hasMore={hasMoreBrands}
          isLoading={isFetchingBrands}
          onLoadMore={loadMoreBrands}
          loadMoreText="Carica altri brand"
        />
      </Select>
      {helperText && (
        <Box sx={{ mt: 0.5, fontSize: '0.75rem', color: 'error.main' }}>{helperText}</Box>
      )}
    </FormControl>
  );
}
