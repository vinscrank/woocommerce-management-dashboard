import { useState } from 'react';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import {
  TableRow,
  TableCell,
  IconButton,
  Checkbox,
  CircularProgress,
  MenuItem,
  MenuList,
  Popover,
  menuItemClasses,
  Button,
  Stack,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Label } from 'src/components/label';
import { AttributoOpzioneModal } from './attributo-opzione-modal';
import { useGetAttributoOpzioni } from 'src/hooks/useGetAttributoOpzioni';
import { useDeleteAttributoOpzione } from 'src/hooks/useDeleteAttributoOpzione';

interface AttributoOpzioniTableProps {
  attributoId: number;
  onEdit: (opzione: AttributoOpzione) => void;
  onDelete: (opzione: AttributoOpzione) => void;
  attributoOpzioni: AttributoOpzione[];
  onCreate: (opzione: Partial<AttributoOpzione>) => void;
  onRefresh?: () => void;
  isDeleting: boolean;
  isLoadingParent: boolean;
}

export function AttributoOpzioniTable({
  attributoId,
  onEdit,
  onDelete,
  attributoOpzioni,
  onCreate,
  onRefresh,
  isDeleting,
  isLoadingParent,
}: AttributoOpzioniTableProps) {
  const [openPopover, setOpenPopover] = useState<{
    element: HTMLButtonElement;
    opzione: AttributoOpzione;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOpzione, setSelectedOpzione] = useState<AttributoOpzione | undefined>(undefined);
  const { data, isLoading, error } = useGetAttributoOpzioni(attributoId);

  const handleOpenPopover = (
    event: React.MouseEvent<HTMLButtonElement>,
    opzione: AttributoOpzione
  ) => {
    setOpenPopover({ element: event.currentTarget, opzione });
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenModal = (opzione?: AttributoOpzione) => {
    setSelectedOpzione(opzione);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOpzione(undefined);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Nome' },
    { id: 'actions', label: 'Azioni' },
  ];

  const renderRow = (opzione: AttributoOpzione, selected: boolean, onSelectRow: () => void) => (
    <TableRow key={opzione.id} hover selected={selected}>
      <TableCell width="80px">{opzione.id}</TableCell>
      <TableCell width="100px">{opzione.name}</TableCell>

      <TableCell width="100px">
        <IconButton onClick={(e) => handleOpenPopover(e, opzione)}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenModal()}
        >
          Nuova Opzione
        </Button>
      </Stack>

      <GenericTable
        data={(data || []).filter(
          (opt): opt is AttributoOpzione & { id: number } => opt.id !== undefined
        )}
        columns={columns}
        renderRow={renderRow}
        filterField="name"
        noSearch
        isLoading={isDeleting || isLoadingParent || isLoading}
      />

      <Popover
        open={!!openPopover}
        anchorEl={openPopover?.element}
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
          <MenuItem
            onClick={() => {
              handleOpenModal(openPopover!.opzione);
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Modifica
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDelete(openPopover!.opzione);
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
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

      <AttributoOpzioneModal
        open={modalOpen}
        onClose={handleCloseModal}
        opzione={selectedOpzione}
        attributoId={attributoId}
        onSubmitSuccess={handleRefresh}
      />
    </>
  );
}
