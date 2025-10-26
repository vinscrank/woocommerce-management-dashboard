import { Box, Button, Typography } from '@mui/material';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { useState } from 'react';
import { Column } from '../../user/view/user-view';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { CouponTableRow } from '../coupon-table-row';
import { useGetCoupons } from 'src/hooks/useGetCoupons';
import { useDeleteCoupon } from 'src/hooks/useDeleteCoupon';
import { Iconify } from 'src/components/iconify';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { Coupon } from 'src/types/Coupon';
import { useSnackbar } from 'src/context/SnackbarContext';
import { usePaginatedTable } from 'src/hooks/usePaginatedTable';
import { CouponForm } from '../coupon-form';

const columns: Column[] = [
  { id: 'code', label: 'Codice' },
  { id: 'amount', label: 'Importo' },
  { id: 'discountType', label: 'Tipo' },
  { id: 'description', label: 'Descrizione' },
  { id: 'usageCount', label: 'Utilizzi' },
  { id: 'actions', label: 'Azioni' },
];

export function CouponsView() {
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

  const { data, isFetching, isRefetching } = useGetCoupons(
    page + 1,
    rowsPerPage,
    debouncedSearchQuery
  );
  const coupons = data?.items || [];
  const totalItems = data?.totalItems || 0;

  const { isPending: isDeleting } = useDeleteCoupon();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { showMessage } = useSnackbar();

  const handleOpenModal = (coupon?: Coupon) => {
    setSelectedCoupon(coupon || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleSubmit = async (data: any) => {
    handleCloseModal();
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Lista Coupon ({totalItems})
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            Nuovo Coupon
          </Button>
        </Box>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCoupon ? `Coupon: ${selectedCoupon.code}` : 'Nuovo Coupon'}
        onConfirm={handleSubmit}
        maxWidth="md"
      >
        <CouponForm coupon={selectedCoupon as Coupon} onSubmit={handleSubmit} />
      </GenericModal>

      <GenericTable
        isLoading={isFetching || isRefetching || isDeleting}
        data={(coupons || []) as Array<Coupon & { id: number }>}
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
          <CouponTableRow
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
