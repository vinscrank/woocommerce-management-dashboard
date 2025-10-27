import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  CircularProgress,
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
  Chip,
} from '@mui/material';
import { Coupon } from 'src/types/Coupon';
import { useCallback, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { useDeleteCoupon } from 'src/hooks/useDeleteCoupon';
import { useCouponDiscountType } from 'src/hooks/useCouponDiscountType';

type CouponTableRowProps = {
  row: Coupon;
  selected: boolean;
  onEdit: (coupon: Coupon) => void;
};

export function CouponTableRow({ row, selected, onEdit }: CouponTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { mutate: deleteCoupon, isPending: isDeleting } = useDeleteCoupon();
  const { getTypeInfo } = useCouponDiscountType();

  const typeInfo = getTypeInfo(row.discountType);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare questo coupon?')) {
      deleteCoupon(row.id as number);
    }
  };

  const handleEdit = () => {
    handleClosePopover();
    onEdit(row);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{row.code}</TableCell>
        <TableCell>{row.amount || '-'}</TableCell>
        <TableCell>
          <Chip
            label={typeInfo?.label || row.discountType || '-'}
            color={typeInfo?.color || 'default'}
            size="small"
          />
        </TableCell>
        <TableCell>{row.description || '-'}</TableCell>
        <TableCell>{row.usageCount || 0}</TableCell>
        <TableCell>
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Modifica
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            {isDeleting ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Iconify icon="solar:trash-bin-trash-bold" />
                Elimina
              </>
            )}
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
