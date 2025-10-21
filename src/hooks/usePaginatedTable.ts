import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from './useDebounce';

interface UsePaginatedTableOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
  debounceDelay?: number;
}

export function usePaginatedTable(options: UsePaginatedTableOptions = {}) {
  const {
    initialPage = 0,
    initialRowsPerPage = 10,
    debounceDelay = 1000,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce della ricerca
  const debouncedSearchQuery = useDebounce(searchQuery, debounceDelay);

  // Reset della pagina quando cambia la ricerca
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setPage(initialPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(initialPage);
  }, [initialPage]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const resetPage = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const resetAll = useCallback(() => {
    setPage(initialPage);
    setRowsPerPage(initialRowsPerPage);
    setSearchQuery('');
  }, [initialPage, initialRowsPerPage]);

  return {
    // Stati
    page,
    rowsPerPage,
    searchQuery,
    debouncedSearchQuery,

    // Setters diretti (se servono)
    setPage,
    setRowsPerPage,
    setSearchQuery,

    // Handlers
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,

    // Utility
    resetPage,
    resetSearch,
    resetAll,
  };
}

