import { useState, useEffect, useCallback } from 'react';
import { PaginatedResponse } from 'src/types/PaginetedResponse';

interface UsePaginatedSelectResult<T> {
  // Stato
  allItems: T[];
  hasMore: boolean;

  // Funzioni di controllo
  loadMore: () => void;
  reset: () => void;
}

/**
 * Hook generico per gestire l'accumulazione di elementi paginati per select/multiselect
 * 
 * @template T - Il tipo di elemento da gestire (es. Categoria, Tag, Brand)
 * @param data - La risposta paginata dall'API
 * @param isFetching - Flag che indica se è in corso un caricamento
 * @param onLoadMore - Callback per caricare più elementi (es. incrementare currentPage)
 * @returns Oggetto con gli elementi accumulati e funzioni di controllo
 * 
 * @example
 * ```tsx
 * // Nel componente:
 * const [currentPage, setCurrentPage] = useState(1);
 * const { data: categorie, isFetching } = useGetCategories(currentPage, 25, '');
 * 
 * const {
 *   allItems: allCategorie,
 *   hasMore,
 *   loadMore,
 * } = usePaginatedSelect(
 *   categorie,
 *   isFetching,
 *   () => setCurrentPage(prev => prev + 1)
 * );
 * 
 * // Nel JSX:
 * <Button onClick={loadMore}>Carica altre categorie</Button>
 * ```
 */
export function usePaginatedSelect<T extends { id?: number | string }>(
  data: PaginatedResponse<T> | undefined,
  isFetching: boolean,
  onLoadMore: () => void
): UsePaginatedSelectResult<T> {
  const [allItems, setAllItems] = useState<T[]>([]);

  // Accumula gli elementi quando arrivano nuove pagine
  useEffect(() => {
    if (data?.items) {
      setAllItems((prev) => {
        // Evita duplicati basandosi sull'id
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = data.items.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  // Verifica se ci sono più pagine da caricare
  const hasMore = data ? data.currentPage < data.totalPages : false;

  // Funzione per caricare la pagina successiva
  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      onLoadMore();
    }
  }, [isFetching, hasMore, onLoadMore]);

  // Funzione per resettare lo stato
  const reset = useCallback(() => {
    setAllItems([]);
  }, []);

  return {
    allItems,
    hasMore,
    loadMore,
    reset,
  };
}


