import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Categoria } from 'src/types/Categoria';
import { Button, CircularProgress } from '@mui/material';
import { useDeleteCategoria } from 'src/hooks/useDeleteCategoria';
import { useDevUrl } from 'src/hooks/useDevUrl';

// ----------------------------------------------------------------------

type CategoriaTableRowProps = {
  row: Categoria;
  key: number;
  selected: boolean;
  onSelectRow?: () => void;
  onOpenProducts?: (id: string, name: string) => void;
  onEdit: (categoria: Categoria) => void;
};

export function CategoriaTableRow({
  key,
  row,
  selected,
  onSelectRow,
  onOpenProducts,
  onEdit,
}: CategoriaTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { mutate: deleteCategoria, isPending: isDeleting } = useDeleteCategoria();
  const { convertUrl } = useDevUrl();
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare questa categoria?')) {
      deleteCategoria(row.id as number);
    }
  };

  const handleEdit = () => {
    handleClosePopover();
    onEdit(row);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {onSelectRow && (
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
          </TableCell>
        )}

        <TableCell>{row.id}</TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.slug}</TableCell>
        <TableCell>
          {row.image && (
            <img
              src={convertUrl(row.image?.src)}
              alt={row.name}
              style={{ width: '30px', height: 'auto' }}
            />
          )}
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
