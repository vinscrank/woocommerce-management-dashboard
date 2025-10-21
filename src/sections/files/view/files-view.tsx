import { Box, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { useGetFiles } from 'src/hooks/useGetFiles';
import { useSnackbar } from 'src/context/SnackbarContext';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { usePaginatedTable } from 'src/hooks/usePaginatedTable';

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

  // Hook per gestire paginazione, ricerca e debounce
  const {
    page,
    rowsPerPage,
    searchQuery,
    debouncedSearchQuery,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    resetPage,
  } = usePaginatedTable({
    initialPage: 0,
    initialRowsPerPage: 10,
    debounceDelay: 1000,
  });

  const { data, isFetching } = useGetFiles(page + 1, rowsPerPage, debouncedSearchQuery);

  const handleUploadSuccess = () => {
    showMessage({ text: 'File caricato con successo', type: 'success' });
    resetPage(); // Torna alla prima pagina dopo l'upload
  };

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
