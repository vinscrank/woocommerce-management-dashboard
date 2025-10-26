import { Box, Button, Typography } from '@mui/material';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { useState } from 'react';
import { Column } from '../../user/view/user-view';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { OrdineTableRow } from '../ordine-table-row';
import { useGetOrdini } from 'src/hooks/useGetOrdini';
import { useDeleteOrdine } from 'src/hooks/useDeleteOrdine';
import { Iconify } from 'src/components/iconify';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { Ordine } from 'src/types/Ordine';
import { useSnackbar } from 'src/context/SnackbarContext';
import { usePaginatedTable } from 'src/hooks/usePaginatedTable';
import { OrdineForm } from '../ordine-form';

const columns: Column[] = [
  { id: 'number', label: 'N. Ordine' },
  { id: 'customer', label: 'Cliente' },
  { id: 'email', label: 'Email' },
  { id: 'status', label: 'Stato' },
  { id: 'total', label: 'Totale' },
  { id: 'actions', label: 'Azioni' },
];

export function OrdiniView() {
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
    initialRowsPerPage: 25,
  });

  const { data, isFetching, isRefetching } = useGetOrdini(
    page + 1,
    rowsPerPage,
    debouncedSearchQuery
  );
  const ordini = data?.items || [];
  const totalItems = data?.totalItems || 0;

  const { isPending: isDeleting } = useDeleteOrdine();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrdine, setSelectedOrdine] = useState<Ordine | null>(null);
  const { showMessage } = useSnackbar();

  const handleOpenModal = (ordine?: Ordine) => {
    setSelectedOrdine(ordine || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrdine(null);
  };

  const handleSubmit = async (data: any) => {
    handleCloseModal();
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Lista Ordini ({totalItems})
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            Nuovo Ordine
          </Button>
        </Box>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedOrdine ? `Ordine: ${selectedOrdine.number || selectedOrdine.id}` : 'Nuovo Ordine'
        }
        onConfirm={handleSubmit}
        maxWidth="lg"
      >
        <OrdineForm ordine={selectedOrdine as Ordine} onSubmit={handleSubmit} />
      </GenericModal>

      <GenericTable
        isLoading={isFetching || isRefetching || isDeleting}
        data={(ordini || []) as Array<Ordine & { id: number }>}
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
          <OrdineTableRow
            key={row.id}
            row={row as any}
            selected={selected}
            onEdit={handleOpenModal}
          />
        )}
      />
    </DashboardContent>
  );
}
