import { Box, Button, Typography } from '@mui/material';
import { GenericTable } from 'src/components/generic-table/GenericTable';

import { useState } from 'react';

import { Column } from '../../user/view/user-view';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { BrandTableRow } from '../brand-table-row';
import { useDeleteBrand } from 'src/hooks/useDeleteBrand';
import { Iconify } from 'src/components/iconify';
import { BrandForm } from '../brand-form';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { useSnackbar } from 'src/context/SnackbarContext';
import { Brand } from 'src/types/Brand';
import { useGetBrands } from 'src/hooks/useGetBrand';
import { usePaginatedTable } from 'src/hooks/usePaginatedTable';

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nome' },
  { id: 'slug', label: 'Slug' },
  { id: 'actions', label: 'Azioni' },
];

export function BrandsView() {
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

  const { data, isFetching, isRefetching } = useGetBrands(
    page + 1,
    rowsPerPage,
    debouncedSearchQuery
  );
  const brands = data?.items || [];
  const totalItems = data?.totalItems || 0;

  const { isPending: isDeleting } = useDeleteBrand();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedbrand, setSelectedbrand] = useState<Brand | null>(null);
  const { showMessage } = useSnackbar();

  const handleOpenModal = (brand?: Brand) => {
    setSelectedbrand(brand || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedbrand(null);
  };

  const handleSubmit = async (data: any) => {
    handleCloseModal();
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Lista brands ({totalItems})
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            Nuovo brand
          </Button>
        </Box>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedbrand ? `brand: ${selectedbrand.name}` : 'Nuovo brand'}
        onConfirm={handleSubmit}
        maxWidth="xs"
      >
        <BrandForm brand={selectedbrand as Brand} onSubmit={handleSubmit} />
      </GenericModal>

      <GenericTable
        isLoading={isFetching || isRefetching || isDeleting}
        data={(brands || []) as Array<Brand & { id: number }>}
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
          <BrandTableRow
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
