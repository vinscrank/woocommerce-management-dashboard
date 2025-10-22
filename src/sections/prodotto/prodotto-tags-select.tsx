import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';
import { useGetTags } from 'src/hooks/useGetTags';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { PaginatedSelectLoadMore } from 'src/components/PaginatedSelectLoadMore';
import { Tag } from 'src/types/Tag';

interface ProdottoTagsSelectProps {
  /**
   * Valore corrente dei tag selezionati
   * Array di tag con id, name, slug
   */
  value: any;

  /**
   * Callback chiamato quando cambia la selezione
   */
  onChange: (tags: Array<{ id: number; name: string; slug: string }>) => void;

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
 * Componente per la selezione multipla e paginata dei tag di un prodotto
 *
 * @example
 * ```tsx
 * <ProdottoTagsSelect
 *   value={watch('tags')}
 *   onChange={(tags) => setValue('tags', tags)}
 * />
 * ```
 */
export function ProdottoTagsSelect({
  value,
  onChange,
  error,
  helperText,
  perPage = 25,
}: ProdottoTagsSelectProps) {
  // Gestione paginazione tag con hook generico
  const [tagsPage, setTagsPage] = useState(1);
  const { data: tagsData, isFetching: isFetchingTags } = useGetTags(tagsPage, perPage, '');

  const {
    allItems: allTags,
    hasMore: hasMoreTags,
    loadMore: loadMoreTags,
  } = usePaginatedSelect<Tag>(tagsData, isFetchingTags, () => setTagsPage((prev) => prev + 1));

  // Estrae gli ID selezionati dal valore corrente
  const getSelectedIds = (): string[] => {
    if (Array.isArray(value)) {
      return value.map((tag: any) => tag.id?.toString()).filter(Boolean);
    }
    return [];
  };

  // Handler per il cambio di selezione
  const handleChange = (selectedIds: string[]) => {
    const selectedTags = selectedIds
      .map((id) => allTags.find((tag) => tag.id?.toString() === id))
      .filter(Boolean)
      .map((tag) => ({
        id: tag!.id!,
        name: tag!.name!,
        slug: tag!.slug!,
      }));

    onChange(selectedTags);
  };

  // Render dei chip con i nomi dei tag
  const renderSelectedTags = (selected: string[]) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((selectedId: string) => {
          // Prima cerca nei tag già presenti nel valore
          let tagName = selectedId; // default to ID

          if (Array.isArray(value)) {
            const tag = value.find((t: any) => t.id?.toString() === selectedId);
            if (tag?.name) tagName = tag.name;
          }

          // Se non trovato, cerca in allTags (tag caricati)
          if (tagName === selectedId) {
            const tag = allTags.find((t) => t.id?.toString() === selectedId);
            if (tag?.name) tagName = tag.name;
          }

          return <Chip key={selectedId} label={tagName} size="small" />;
        })}
      </Box>
    );
  };

  const selectedIds = getSelectedIds();

  return (
    <FormControl fullWidth error={error}>
      <InputLabel id="tags-label">Tags</InputLabel>
      <Select
        labelId="tags-label"
        id="tags"
        label="Tags"
        multiple
        value={selectedIds}
        onChange={(e) => handleChange(e.target.value as string[])}
        renderValue={renderSelectedTags}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
            },
          },
        }}
      >
        {allTags.map((tag) => (
          <MenuItem key={tag.id} value={tag.id?.toString() || ''}>
            {tag.name}
          </MenuItem>
        ))}

        <PaginatedSelectLoadMore
          hasMore={hasMoreTags}
          isLoading={isFetchingTags}
          onLoadMore={loadMoreTags}
          loadMoreText="Carica altri tag"
        />
      </Select>
      {helperText && (
        <Box sx={{ mt: 0.5, fontSize: '0.75rem', color: 'error.main' }}>{helperText}</Box>
      )}
    </FormControl>
  );
}
