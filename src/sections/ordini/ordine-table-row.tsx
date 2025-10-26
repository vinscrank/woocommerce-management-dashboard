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
import { Ordine } from 'src/types/Ordine';
import { useCallback, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { useDeleteOrdine } from 'src/hooks/useDeleteOrdine';

type OrdineTableRowProps = {
  row: Ordine;
  selected: boolean;
  onEdit: (ordine: Ordine) => void;
};

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  completed: 'success',
  pending: 'warning',
  processing: 'info',
  cancelled: 'error',
  refunded: 'error',
  failed: 'error',
  'on-hold': 'warning',
};

export function OrdineTableRow({ row, selected, onEdit }: OrdineTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { mutate: deleteOrdine, isPending: isDeleting } = useDeleteOrdine();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare questo ordine?')) {
      deleteOrdine(row.id as number);
    }
  };

  const handleEdit = () => {
    handleClosePopover();
    onEdit(row);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{row.number || row.id}</TableCell>
        <TableCell>
          {row.billing?.firstName} {row.billing?.lastName}
        </TableCell>
        <TableCell>{row.billing?.email || '-'}</TableCell>
        <TableCell>
          <Chip
            label={row.status || '-'}
            color={statusColors[row.status || ''] || 'default'}
            size="small"
          />
        </TableCell>
        <TableCell>
          {row.total} {row.currency}
        </TableCell>
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
