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
import { useCallback, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { useDeleteAttributo } from 'src/hooks/useDeleteAttributo';
import { Attributo } from 'src/types/Attributo';

type AttributoTableRowProps = {
  row: Attributo;
  selected: boolean;
  onEdit: (attributo: Attributo) => void;
};

export function AttributoTableRow({ row, selected, onEdit }: AttributoTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { mutate: deleteAttributo, isPending: isDeleting } = useDeleteAttributo();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare questo attributo?')) {
      deleteAttributo(row.id as number);
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
        <TableCell>{row.name}</TableCell>
       
       
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
