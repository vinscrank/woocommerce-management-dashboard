import { Box, Typography } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { useGetFiles } from 'src/hooks/useGetFiles';
import { useSnackbar } from 'src/context/SnackbarContext';
import { GenericTable } from 'src/components/generic-table/GenericTable';

import { FileTableRow } from '../file-table-row';
import { FileUploader } from '../file-uploader';

const columns = [
  { id: 'name', label: 'Nome File' },
  { id: 'mimeType', label: 'Tipo di File' },
  { id: 'size', label: 'Dimensione' },
  { id: 'creationTime', label: 'Data Creazione' },
  { id: 'preview', label: 'Anteprima' },
  { id: 'actions', label: 'Azioni' },
];

export function FilesView() {
  const { showMessage } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce della ricerca: aggiorna debouncedSearchQuery dopo 1 secondo
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Resetta la pagina quando la ricerca debouncata cambia
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setPage(0);
    }
  }, [debouncedSearchQuery]);

  const { data, isFetching } = useGetFiles(page + 1, rowsPerPage, debouncedSearchQuery);

  const handleUploadSuccess = () => {
    showMessage({ text: 'File caricato con successo', type: 'success' });
    setPage(0); // Torna alla prima pagina dopo l'upload
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const files = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Gestione media ({totalItems})
        </Typography>
      </Box>
      <Box mb={2} width={1}>
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      </Box>

      <GenericTable
        isLoading={isFetching}
        data={files.filter((f) => f.id != null).map((f) => ({ id: f.id!, ...f }))}
        columns={columns}
        showCheckbox={false}
        showToolbar={true}
        noSearch={false}
        noOrder={true}
        renderRow={(row) => <FileTableRow key={row.id} row={row} />}
        // Paginazione server-side
        serverSidePagination={true}
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        // Ricerca server-side
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />
    </DashboardContent>
  );
}
