import { Box, Button, Typography } from '@mui/material';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { useState } from 'react';
import { Column } from '../../user/view/user-view';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { ClienteTableRow } from '../cliente-table-row';
import { useGetClienti } from 'src/hooks/useGetClienti';
import { useDeleteCliente } from 'src/hooks/useDeleteCliente';
import { Iconify } from 'src/components/iconify';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { Cliente } from 'src/types/Cliente';
import { useSnackbar } from 'src/context/SnackbarContext';

import { usePaginatedTable } from 'src/hooks/usePaginatedTable';
import { ClienteForm } from '../cliente-form';

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nome Completo' },
  { id: 'email', label: 'Email' },
  { id: 'username', label: 'Username' },
  { id: 'role', label: 'Ruolo' },
  { id: 'actions', label: 'Azioni' },
];

export function ClientiView() {
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

  const { data, isFetching, isRefetching } = useGetClienti(
    page + 1,
    rowsPerPage,
    debouncedSearchQuery
  );
  const clienti = data?.items || [];
  const totalItems = data?.totalItems || 0;

  const { isPending: isDeleting } = useDeleteCliente();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const { showMessage } = useSnackbar();

  const handleOpenModal = (cliente?: Cliente) => {
    setSelectedCliente(cliente || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleSubmit = async (data: any) => {
    handleCloseModal();
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Lista Clienti ({totalItems})
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            Nuovo Cliente
          </Button>
        </Box>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedCliente
            ? `Cliente: ${selectedCliente.firstName} ${selectedCliente.lastName}`
            : 'Nuovo Cliente'
        }
        onConfirm={handleSubmit}
        maxWidth="md"
      >
        <ClienteForm cliente={selectedCliente as Cliente} onSubmit={handleSubmit} />
      </GenericModal>

      <GenericTable
        isLoading={isFetching || isRefetching || isDeleting}
        data={(clienti || []) as Array<Cliente & { id: number }>}
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
          <ClienteTableRow
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
