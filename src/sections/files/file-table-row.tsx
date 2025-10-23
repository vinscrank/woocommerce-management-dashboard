import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  IconButton,
  CircularProgress,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useState, useCallback } from 'react';
import { Iconify } from 'src/components/iconify';
import { useDeleteFile } from 'src/hooks/useDeleteFile';
import { useRenameFile } from 'src/hooks/useRenameFile';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { useSaveFileName } from 'src/hooks/useSaveFileName';
import { Media } from 'src/types/File';
import { formatDateTime } from 'src/hooks/use-format-date';
import { useDevUrl } from 'src/hooks/useDevUrl';

type FileTableRowProps = {
  row: Media;
};

export function FileTableRow({ row }: FileTableRowProps) {
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();
  const { mutate: renameFile, isPending: isRenaming } = useRenameFile();
  const { mutate: saveFileName, isPending: isSaving } = useSaveFileName();
  const { convertUrl } = useDevUrl();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [newName, setNewName] = useState('');

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = () => {
    handleClosePopover();
    if (confirm('Sei sicuro di voler eliminare questo file?')) {
      deleteFile(row.id as number);
    }
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(row.slug!);
  };

  const handleOpenRenameModal = () => {
    setOpenRenameModal(true);
    handleClosePopover();
  };

  const handleCloseRenameModal = () => {
    setOpenRenameModal(false);
    setNewName('');
  };

  const handleRename = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newName && newName !== row.name) {
      if (confirm('Vuoi rinominare il file?')) {
        saveFileName(
          { filename: row.name!, newFilename: newName },
          {
            onSuccess: () => {
              handleCloseRenameModal();
            },
          }
        );
      }
    }
  };

  const handleImageClick = () => {
    setOpenImagePreview(true);
  };

  const handleCloseImagePreview = () => {
    setOpenImagePreview(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          {/* <IconButton onClick={handleCopyName} size="small" sx={{ ml: 1 }}>
            <Iconify icon="solar:copy-bold" width={20} />
          </IconButton> */}
          <Typography variant="body2">{row.slug}</Typography>
        </TableCell>

        <TableCell>{row.mimeType}</TableCell>
        <TableCell>{row.mediaDetails?.filesize} KB</TableCell>

        <TableCell>{formatDateTime(row.createdAt)}</TableCell>
        <TableCell>
          <img
            src={convertUrl(row.sourceUrl)}
            alt={row.slug}
            style={{ maxWidth: '70px', height: 'auto', cursor: 'pointer' }}
            onClick={handleImageClick}
            title="Clicca per ingrandire"
          />
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
            },
          }}
        >
    

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

      <GenericModal
        open={openRenameModal}
        onClose={handleCloseRenameModal}
        title="Rinomina file"
        description={`Rinomina il file: ${row.name}`}
        confirmButtonText="Rinomina"
        onConfirm={handleRename}
        maxWidth="sm"
        disabled={isSaving}
      >
        <form onSubmit={handleRename}>
          <TextField
            fullWidth
            size="small"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Inserisci il nuovo nome..."
            sx={{ mt: 2 }}
            autoFocus
            disabled={isSaving}
            error={newName === row.name}
            helperText={
              newName === row.name ? "Il nuovo nome deve essere diverso dall'originale" : ''
            }
          />
          {isSaving && (
            <CircularProgress
              size={24}
              sx={{
                display: 'block',
                margin: '16px auto',
              }}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSaving || newName === row.name || !newName}
            sx={{ mt: 2 }}
          >
            {isSaving ? 'Rinominando...' : 'Rinomina'}
          </Button>
        </form>
      </GenericModal>

      {/* Modale per l'anteprima dell'immagine */}
      <GenericModal
        open={openImagePreview}
        onClose={handleCloseImagePreview}
        title={row.slug || 'Anteprima immagine'}
        maxWidth="md"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
        >
          <img
            src={convertUrl(row.sourceUrl)}
            alt={row.slug}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </GenericModal>
    </>
  );
}
