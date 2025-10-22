import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';
import { useGetCategories } from 'src/hooks/useGetCategorie';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { PaginatedSelectLoadMore } from 'src/components/PaginatedSelectLoadMore';
import { Categoria } from 'src/types/Categoria';
import { useFlattenedCategoryTree } from 'src/hooks/useCategoryTree';

interface ProdottoCategoriesSelectProps {
  /**
   * Valore corrente delle categorie selezionate
   * Può essere un array di categorie o un oggetto Record<string, CategoryState>
   */
  value: any;

  /**
   * Callback chiamato quando cambia la selezione
   */
  onChange: (categories: Array<{ id: number; name: string; slug: string }>) => void;

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
 * Componente per la selezione multipla e paginata delle categorie di un prodotto
 *
 * @example
 * ```tsx
 * <ProdottoCategoriesSelect
 *   value={watch('categories')}
 *   onChange={(categories) => setValue('categories', categories)}
 * />
 * ```
 */
export function ProdottoCategoriesSelect({
  value,
  onChange,
  error,
  helperText,
  perPage = 25,
}: ProdottoCategoriesSelectProps) {
  // Gestione paginazione categorie con hook generico
  const [categoriesPage, setCategoriesPage] = useState(1);
  const { data: categoriesData, isFetching: isFetchingCategories } = useGetCategories(
    categoriesPage,
    perPage,
    ''
  );

  const {
    allItems: allCategorie,
    hasMore: hasMoreCategories,
    loadMore: loadMoreCategories,
  } = usePaginatedSelect<Categoria>(categoriesData, isFetchingCategories, () =>
    setCategoriesPage((prev) => prev + 1)
  );

  // Usa il hook per flatten con livelli di profondità
  const categoriesWithLevels = useFlattenedCategoryTree(allCategorie);

  // Estrae gli ID selezionati dal valore corrente
  const getSelectedIds = (): string[] => {
    // Se è un array, estrai gli ID
    if (Array.isArray(value)) {
      return value.map((cat: any) => cat.id?.toString()).filter(Boolean);
    }

    // Se è un oggetto Record<string, CategoryState>, estrai le chiavi con checked=true
    if (value && typeof value === 'object') {
      return Object.entries(value)
        .filter(([_, state]: [string, any]) => state.checked)
        .map(([id, _]) => id);
    }

    return [];
  };

  // Handler per il cambio di selezione
  const handleChange = (selectedIds: string[]) => {
    const selectedCategories = selectedIds
      .map((id) => allCategorie.find((cat) => cat.id?.toString() === id))
      .filter(Boolean)
      .map((cat) => ({
        id: cat!.id!,
        name: cat!.name!,
        slug: cat!.slug!,
      }));

    onChange(selectedCategories);
  };

  // Render dei chip con i nomi delle categorie
  const renderSelectedCategories = (selected: string[]) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((selectedId: string) => {
          // Prima cerca nelle categorie già presenti nel valore
          let categoriaName = selectedId; // default to ID

          if (Array.isArray(value)) {
            const cat = value.find((c: any) => c.id?.toString() === selectedId);
            if (cat?.name) categoriaName = cat.name;
          }

          // Se non trovata, cerca in allCategorie (categorie caricate)
          if (categoriaName === selectedId) {
            const categoria = allCategorie.find((cat) => cat.id?.toString() === selectedId);
            if (categoria?.name) categoriaName = categoria.name;
          }

          return <Chip key={selectedId} label={categoriaName} size="small" />;
        })}
      </Box>
    );
  };

  const selectedIds = getSelectedIds();

  return (
    <FormControl fullWidth error={error}>
      <InputLabel id="categories-label">Categorie</InputLabel>
      <Select
        labelId="categories-label"
        id="categories"
        label="Categorie"
        multiple
        value={selectedIds}
        onChange={(e) => handleChange(e.target.value as string[])}
        renderValue={renderSelectedCategories}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
            },
          },
        }}
      >
        {categoriesWithLevels.map((categoria) => {
          // Mostra il nome con indentazione basata sul livello
          const indent = '—'.repeat(categoria.level);
          const displayName = categoria.level > 0 ? `${indent} ${categoria.name}` : categoria.name;

          return (
            <MenuItem key={categoria.id} value={categoria.id?.toString() || ''}>
              {displayName}
            </MenuItem>
          );
        })}

        <PaginatedSelectLoadMore
          hasMore={hasMoreCategories}
          isLoading={isFetchingCategories}
          onLoadMore={loadMoreCategories}
          loadMoreText="Carica altre categorie"
        />
      </Select>
      {helperText && (
        <Box sx={{ mt: 0.5, fontSize: '0.75rem', color: 'error.main' }}>{helperText}</Box>
      )}
    </FormControl>
  );
}
