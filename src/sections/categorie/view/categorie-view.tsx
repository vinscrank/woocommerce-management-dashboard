import { Button, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { Iconify } from 'src/components/iconify';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { UserTableRow } from 'src/sections/user/user-table-row';
import { useGetCategories } from 'src/hooks/useGetCategorie';
import { CategoriaTableRow } from 'src/sections/categorie/categorie-table-row';
import { useState } from 'react';
import { useSnackbar } from 'src/context/SnackbarContext';

import { Categoria } from 'src/types/Categoria';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { CategoriaForm } from '../categoria-form';
import { useExportCategorie } from 'src/hooks/useExportCategorie';

export default function CategorieView() {
  const { data: categories } = useGetCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);

  const { mutate: exportCategories, isPending: isExporting } = useExportCategorie();
  const { showMessage } = useSnackbar();

  const handleOpenModal = (categoria?: Categoria) => {
    setSelectedCategoria(categoria || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoria(null);
  };

  const handleSubmit = async (data: any) => {
    handleCloseModal();
  };

  const handleExportCategories = () => {
    exportCategories(undefined, {
      onSuccess: () => {
        showMessage({ text: 'Categorie esportate con successo', type: 'success' });
      },
    });
  };

  const columns = [
    {
      id: 'id',
      label: 'ID',
    },
    {
      id: 'name',
      label: 'Nome',
    },
    {
      id: 'slug',
      label: 'Slug',
    },
    {
      id: 'image',
      label: 'Immagine',
    },
    {
      id: 'actions',
      label: 'Azioni',
    },
  ];
  return (
    <DashboardContent>
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={1}
      >
        <Typography variant="h4" flexGrow={1}>
          Categorie ({categories?.length || 0})
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={1}>
          <Button
            sx={{ width: { xs: '100%', md: 'auto' } }}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            Nuova categoria
          </Button>
        </Box>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategoria ? `Categoria: ${selectedCategoria.name}` : 'Nuova Categoria'}
        onConfirm={handleSubmit}
        maxWidth="xs"
      >
        <CategoriaForm categoria={selectedCategoria as Categoria} onSubmit={handleSubmit} />
      </GenericModal>

      <GenericTable
        data={(categories || []) as Array<Categoria & { id: number }>}
        columns={columns}
        renderRow={(row) => (
          <CategoriaTableRow
            key={row.id}
            row={row}
            selected={false}
            onOpenProducts={() => {
              alert('open products');
            }}
            onEdit={(categoria) => {
              handleOpenModal(categoria);
            }}
          />
        )}
      />
    </DashboardContent>
  );
}
