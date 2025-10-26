import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  CircularProgress,
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
} from '@mui/material';
import { Label } from 'src/components/label';
import { Cliente } from 'src/types/Cliente';
import { useCallback, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { useDeleteCliente } from 'src/hooks/useDeleteCliente';

type ClienteTableRowProps = {
  row: Cliente;
  selected: boolean;
  onEdit: (cliente: Cliente) => void;
};

export function ClienteTableRow({ row, selected, onEdit }: ClienteTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { mutate: deleteCliente, isPending: isDeleting } = useDeleteCliente();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare questo cliente?')) {
      deleteCliente(row.id as number);
    }
  };

  const handleEdit = () => {
    handleClosePopover();
    onEdit(row);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{row.id}</TableCell>
        <TableCell>
          {row.firstName} {row.lastName}
        </TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.username}</TableCell>
        <TableCell>{row.role}</TableCell>
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
