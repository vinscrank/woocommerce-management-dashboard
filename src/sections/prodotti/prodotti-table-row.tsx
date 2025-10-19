import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import he from 'he';

import {
  Checkbox,
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
import { useDeleteProdotto } from 'src/hooks/useDeleteProdotto';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'src/context/SnackbarContext';
import { Prodotto } from 'src/types/Prodotto';
import { formatDate, formatDateTime } from 'src/hooks/use-format-date';

type ProdottoTableRowProps = {
  row: Prodotto;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: (prodotto: Prodotto) => void;
  onViewDetails?: (prodotto: Prodotto) => void;
  onSelectAll?: () => void;
  allSelected?: boolean;
  showCheckbox?: boolean;
  refetchProdotti?: () => void;
};

export function ProdottoTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onViewDetails,
  onSelectAll,
  allSelected,
  showCheckbox,
  refetchProdotti,
}: ProdottoTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { mutate: deleteProdotto, isPending: isDeleting } = useDeleteProdotto(row.id as number);
  const { showMessage } = useSnackbar();
  const navigate = useNavigate();
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = (force: boolean) => {
    deleteProdotto(
      { force },
      {
        onSuccess: () => {
          handleClosePopover();
        },
        onError: () => {
          handleClosePopover();
        },
      }
    );
  };

  const handleEdit = () => {
    handleClosePopover();
    navigate(`/prodotti/${row.id}`);
  };

  const handleViewDetails = () => {
    handleClosePopover();
    onEdit(row);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow();
            }}
          />
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>{row.id}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>{row.sku || '-'}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>{row.name}</TableCell>
        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
          {row.images && row.images.length > 0 ? (
            <img
              src={row.images?.[0]?.src?.replace('https://', 'http://')}
              alt={row.name}
              style={{ width: '30px', height: 'auto' }}
            />
          ) : (
            '-'
          )}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Label color={row.type === 'simple' ? 'secondary' : 'info'}>{row.type}</Label>
        </TableCell>
        {/* {JSON.stringify(row)} */}
        <TableCell onClick={(e) => e.stopPropagation()}>{formatDateTime(row.dateCreated)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>{formatDateTime(row.dateModified)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Label
            color={
              row.status === 'publish' ? 'success' : row.status === 'draft' ? 'warning' : 'error'
            }
          >
            {row.status === 'publish' ? 'Pubblicato' : row.status === 'draft' ? 'Bozza' : 'Cestino'}
          </Label>
        </TableCell>
        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
          <Label
            color={
              row.stockStatus === 'instock'
                ? 'success'
                : row.stockStatus === 'onbackorder'
                  ? 'warning'
                  : 'error'
            }
          >
            <Iconify
              icon={
                row.stockStatus === 'outofstock' || row.stockStatus === null
                  ? 'eva:alert-triangle-fill'
                  : 'eva:checkmark-fill'
              }
            />
          </Label>
        </TableCell>
        {/* <TableCell align="center" onClick={(e) => e.stopPropagation()}>
          {row.onSale} {row.onSale || row.onSale === null ? <Label color="info">SI</Label> : '-'}
        </TableCell> */}
        <TableCell
          sx={{
            position: 'sticky',
            right: 0,
            backgroundColor: (theme) => `rgba(${theme.palette.background.paper}, 0.8)`,
            backdropFilter: 'blur(6px)',
            boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
            zIndex: 1,
            width: '30px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
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
            width: 200,
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
          {/* <MenuItem onClick={handleViewDetails}>
                        <Iconify icon="solar:eye-bold" />
                        Visualizza
                    </MenuItem> */}

          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Modifica
          </MenuItem>

          {row.status === 'trash' ? (
            <MenuItem onClick={() => handleDelete(true)} sx={{ color: 'error.main' }}>
              {isDeleting ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Elimina definitivamente
                </>
              )}
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleDelete(false)} sx={{ color: 'warning.main' }}>
              {isDeleting ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Sposta nel cestino
                </>
              )}
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
