import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { useGetCategories } from 'src/hooks/useGetCategorie';
import { useGetCategoria } from 'src/hooks/useGetCategoria';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { PaginatedSelectLoadMore } from 'src/components/PaginatedSelectLoadMore';
import { Categoria } from 'src/types/Categoria';
import { useFlattenedCategoryTree } from 'src/hooks/useCategoryTree';

interface CategoriaParentSelectProps {
  /**
   * Valore corrente della categoria parent (ID)
   */
  value: number | null | undefined;

  /**
   * Callback chiamato quando cambia la selezione
   */
  onChange: (parentId: number | null) => void;

  /**
   * ID della categoria corrente (per escluderla dalla lista e prevenire loop)
   */
  currentCategoriaId?: number;

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
   * Label del campo
   */
  label?: string;
}

/**
 * Componente per la selezione singola e paginata della categoria genitore
 *
 * @example
 * ```tsx
 * <CategoriaParentSelect
 *   value={watch('parent')}
 *   onChange={(parentId) => setValue('parent', parentId)}
 *   currentCategoriaId={categoria?.id}
 * />
 * ```
 */
export function CategoriaParentSelect({
  value,
  onChange,
  currentCategoriaId,
  error,
  helperText,
  perPage = 10,
  label = 'Categoria Genitore',
}: CategoriaParentSelectProps) {
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

  // Carica direttamente la categoria parent (React Query gestisce la cache)
  // Solo se value è un numero valido (> 0)
  const parentId = value && value > 0 ? value : 0;
  const { data: parentCategoriaArray, isLoading: isLoadingParent } = useGetCategoria(parentId);
  const parentCategoria = parentCategoriaArray?.[0];

  // Combina le categorie paginate con la categoria parent
  const [mergedCategories, setMergedCategories] = useState<Categoria[]>([]);

  useEffect(() => {
    let categories: Categoria[] = [...allCategorie];

    // Aggiungi la categoria parent se caricata e non è già nella lista
    if (parentCategoria && value) {
      const isParentInList = categories.some((cat) => cat.id === value);
      if (!isParentInList) {
        categories = [parentCategoria as Categoria, ...categories];
      }
    }

    setMergedCategories(categories);
  }, [allCategorie, parentCategoria, value]);

  // Usa il hook per flatten con livelli di profondità
  const categoriesWithLevels = useFlattenedCategoryTree(mergedCategories);

  // Filtra la categoria corrente per prevenire loop circolari
  const availableCategories = categoriesWithLevels.filter((cat) => cat.id !== currentCategoriaId);

  // Handler per il cambio di selezione
  const handleChange = (selectedId: string) => {
    if (selectedId === '') {
      onChange(null);
    } else {
      onChange(Number(selectedId));
    }
  };

  // Trova il nome della categoria selezionata per il display
  const getSelectedCategoryName = (): string => {
    if (!value) return '';

    // Usa direttamente parentCategoria (sempre disponibile se in cache)
    if (parentCategoria?.name) {
      return parentCategoria.name;
    }

    // Altrimenti cerca in mergedCategories
    const selectedCat = mergedCategories.find((cat) => cat.id === value);
    if (selectedCat?.name) return selectedCat.name;

    // Fallback vuoto (React Query sta caricando)
    return '';
  };

  return (
    <Box>
      {/* Mostra il nome della categoria genitore selezionata */}
      {value && value > 0 && (
        <Box sx={{ mb: 3, p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Categoria genitore attuale:
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {isLoadingParent ? 'Caricamento...' : getSelectedCategoryName() || `ID: ${value}`}
          </Typography>
        </Box>
      )}

      <FormControl fullWidth error={error}>
        <InputLabel id="parent-label">{label}</InputLabel>
        <Select
          labelId="parent-label"
          id="parent"
          label={label}
          value={value?.toString() || ''}
          onChange={(e) => handleChange(e.target.value)}
          renderValue={(selected) => {
            if (!selected) return <em>Nessuna (Categoria principale)</em>;
            return getSelectedCategoryName();
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          <MenuItem value="">
            <em>Nessuna (Categoria principale)</em>
          </MenuItem>

          {availableCategories.map((categoria) => {
            // Mostra il nome con indentazione basata sul livello
            // Ogni livello aggiunge "— "
            const indent = '—'.repeat(categoria.level);
            const displayName =
              categoria.level > 0 ? `${indent} ${categoria.name}` : categoria.name;

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
    </Box>
  );
}
