import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { useState } from 'react';
import { Column } from '../../user/view/user-view';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { Iconify } from 'src/components/iconify';
import { GenericModal } from 'src/components/generic-modal/GenericModal';

import { useSnackbar } from 'src/context/SnackbarContext';
import { Attributo } from 'src/types/Attributo';
import { useDeleteAttributo } from 'src/hooks/useDeleteAttributo';
import { AttributoTableRow } from '../attributo-table-row';
import { useGetAttributi } from 'src/hooks/useGetAttributi';
import { AttributoForm } from '../attributo-form';
import { useExportAttributi } from 'src/hooks/useExportAttributi';
import { useExportOpzioni } from 'src/hooks/useExportOpzioni';
import { useGetAttributo } from 'src/hooks/useGetAttributo';
import AttributoOpzioniContainer from './attributo-opzioni-container';
import { usePaginatedTable } from 'src/hooks/usePaginatedTable';

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nome' },
  { id: 'actions', label: 'Azioni' },
];

export function AttributiView() {
  // Hook per paginazione e ricerca
  const {
    page,
    rowsPerPage,
    searchQuery,
    debouncedSearchQuery,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
  } = usePaginatedTable({
    initialPage: 0,
    initialRowsPerPage: 999,
  });

  const { data, isFetching, isRefetching } = useGetAttributi(
    page + 1,
    rowsPerPage,
    debouncedSearchQuery
  );
  const attributi = data?.items || [];
  const totalItems = data?.totalItems || 0;

  const { isPending: isDeleting } = useDeleteAttributo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttributoId, setSelectedAttributoId] = useState<number | null>(null);
  const { data: selectedAttributo, isLoading: isLoadingAttributo } =
    useGetAttributo(selectedAttributoId);
  const { mutate: exportAttributi, isPending: isExportingAttributi } = useExportAttributi();
  const { mutate: exportOpzioni, isPending: isExportingOpzioni } = useExportOpzioni();
  const { showMessage } = useSnackbar();

  const handleExportAttributi = () => {
    exportAttributi(undefined, {
      onSuccess: () => {
        showMessage({ text: 'Attributi esportati con successo', type: 'success' });
      },
    });
  };

  const handleExportOptions = () => {
    exportOpzioni(undefined, {
      onSuccess: () => {
        showMessage({ text: 'Opzioni esportate con successo', type: 'success' });
      },
    });
  };

  const handleOpenModal = (attributoId?: number) => {
    setSelectedAttributoId(attributoId || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAttributoId(null);
  };

  const handleSubmit = async (data: any) => {
    handleCloseModal();
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Lista Attributi ({totalItems})
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            Nuovo attributo
          </Button>
        </Box>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedAttributo ? `Attributo: ${selectedAttributo.name}` : 'Nuovo Attributo'}
        onConfirm={handleSubmit}
        maxWidth="xs"
      >
        {isLoadingAttributo ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <AttributoForm attributo={selectedAttributo as Attributo} onSubmit={handleSubmit} />

            {selectedAttributo && selectedAttributo.id && (
              <Box mt={4}>
                <Typography variant="h6" mb={2}>
                  Opzioni dell'attributo
                </Typography>
                <AttributoOpzioniContainer attributoId={selectedAttributo.id.toString()} />
              </Box>
            )}
          </>
        )}
      </GenericModal>

      <GenericTable
        isLoading={isFetching || isRefetching || isDeleting}
        data={(attributi || []).filter(
          (attr): attr is Attributo & { id: number } => attr.id !== undefined
        )}
        columns={columns}
        showCheckbox={false}
        noOrder={true}
        serverSidePagination
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        renderRow={(row, selected) => (
          <AttributoTableRow
            key={row.id}
            row={row as Attributo}
            selected={selected}
            onEdit={(attributo) => handleOpenModal(attributo.id)}
          />
        )}
      />
    </DashboardContent>
  );
}
