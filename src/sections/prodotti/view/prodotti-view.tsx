import { Box, Button, Typography } from '@mui/material';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { useState } from 'react';
import { Column } from '../../user/view/user-view';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { ProdottoTableRow } from '../prodotti-table-row';
import { useGetProdotti } from 'src/hooks/useGetProdotti';
import { Iconify } from 'src/components/iconify';
import { ProdottoForm } from '../../prodotto/prodotto-form';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { Prodotto } from 'src/types/Prodotto';
import { useSnackbar } from 'src/context/SnackbarContext';
import { usePaginatedTable } from 'src/hooks/usePaginatedTable';

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'sku', label: 'SKU' },
  { id: 'name', label: 'Nome' },
  { id: 'immagine', label: 'Immagine' },
  { id: 'type', label: 'Tipo' },

  { id: 'date_created', label: 'Data Creazione' },
  { id: 'date_modified', label: 'Data Modifica' },
  { id: 'stato', label: 'Stato' },
  { id: 'stock_status', label: 'Stock' },
  { id: 'actions', label: 'Azioni' },
];

export function ProdottiView() {
  // Hook per gestire paginazione, ricerca e debounce
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
    debounceDelay: 1000,
  });

  const {
    data,
    isFetching,
    isRefetching,
    refetch: refetchProdotti,
  } = useGetProdotti(page + 1, rowsPerPage, debouncedSearchQuery);
  const prodotti = data?.items || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProdotto, setSelectedProdotto] = useState<Prodotto | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleOpenModal = (prodotto?: Prodotto) => {
    setSelectedProdotto(prodotto || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProdotto(null);
  };

  const handleSubmit = async (data: any) => {
    handleCloseModal();
  };

  const handleSelectRow = (prodotto: Prodotto) => {
    setSelectedRows((prev) => {
      const prodottoId = prodotto.id?.toString() || '';

      if (prev.includes(prodottoId)) {
        return prev.filter((id) => id !== prodottoId);
      }
      return [...prev, prodottoId];
    });
  };

  const handleSelectAllRows = (checked: boolean) => {
    setSelectedRows(checked ? prodotti?.map((p) => p.id?.toString() || '') || [] : []);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Lista Prodotti ({prodotti?.length || 0})
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            Nuovo Prodotto
          </Button>
        </Box>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit}
        maxWidth="xl"
      >
        <ProdottoForm
          prodotto={selectedProdotto as Prodotto}
          prodottoId={selectedProdotto?.id?.toString() || ''}
          onSubmit={handleSubmit}
        />
      </GenericModal>



      <GenericTable
        onSelectAll={handleSelectAllRows}
        allSelected={selectedRows.length === (prodotti?.length || 0)}
        isLoading={isFetching || isRefetching}
        data={(prodotti || []) as Array<Prodotto & { id: number }>}
        columns={columns}
        noOrder={true}
        serverSidePagination
        totalItems={data?.totalItems || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        renderRow={(row) => (
          <ProdottoTableRow
            refetchProdotti={refetchProdotti}
            key={row.id}
            row={row}
            selected={selectedRows.includes(row.id.toString())}
            onEdit={handleOpenModal}
            onSelectRow={() => handleSelectRow(row)}
            showCheckbox={true}
          />
        )}
      />
    </DashboardContent>
  );
}
