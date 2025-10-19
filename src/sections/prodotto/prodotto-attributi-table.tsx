import { useEffect, useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';

import { ProdottoAttributoTableRow } from './prodotto-attributo-table-row';
import { ProdottoAttributoForm } from './prodotto-attributo-form';
import { Iconify } from 'src/components/iconify';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { usePostProdottoAttributo } from 'src/hooks/usePostProdottoAttributo';
import { useDeleteProdottoAttributo } from 'src/hooks/useDeleteProdottoAttributo';

type ProdottoAttributiDatatableProps = {
  attributi_id?: number[];
  prodotto_id: number;
  prodotto: any;
  prodotto_attributi: any[];
  isLoading: boolean;
};

const columns = [
  { id: 'attributo.name', label: 'Nome Attributo' },
  // { id: 'attributo.slug', label: 'Slug Attributo' },
  // { id: 'abilitato_per_variazioni', label: 'Usato nelle variazioni' },
  // { id: 'visibile', label: 'Visibile nella pagina prodotto' },
  // { id: 'opzioni_id', label: 'Opzioni' },
  { id: 'actions', label: 'Azioni' },
];

export function ProdottoAttributiDatatable({
  prodotto_id,
  prodotto,

  isLoading,
}: ProdottoAttributiDatatableProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedProdottoAttributo, setSelectedProdottoAttributo] = useState<any | null>(null);
  const [attributiLocali, setAttributiLocali] = useState<any[]>([]);
  const { mutate: deleteProdottoAttributo, isPending: isDeletingProdottoAttributo } =
    useDeleteProdottoAttributo(prodotto_id as number);

  const handleOpenModal = (attributo: any = null) => {
    setSelectedProdottoAttributo(
      attributo
        ? {
            ...attributo,
            prodotto_id,
  
          }
        : {
            id: null,
            prodotto_id,
            
            attributo: {
              name: null,
              is_specifico: false,
              attributoOpzioni: [],
            },
            abilitato_per_variazioni: true,
            visibile: true,
            opzioni_id: [],
          }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProdottoAttributo(null);
    setOpenModal(false);
  };

  const { mutate: salvaProdottoAttributo, isPending: isSaving } = usePostProdottoAttributo(
    prodotto.id,
    prodotto?.type,
    () => {
      handleCloseModal();
    }
  );

  //salva il prodotto attributo
  const handleSubmit = async (data: any) => {
    handleCloseModal();
    salvaProdottoAttributo(data);
  };

  //elimina il prodotto attributo
  const handleDelete = async (data: any) => {
    if (confirm('Sei sicuro di voler eliminare questo attributo dal prodotto?')) {
      deleteProdottoAttributo(data, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  if (prodotto?.deleted) {
    return null;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Attributi prodotto</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenModal()}
        >
          Nuovo attributo
        </Button>
      </Box>

      <GenericTable
        isLoading={isLoading}
        data={prodotto?.attributes || []}
        columns={columns}
        renderRow={(row, selected) => (
          <ProdottoAttributoTableRow
            isLoading={isDeletingProdottoAttributo}
            key={row.id}
            row={row}
            selected={selected}
            onEdit={() => handleOpenModal(row)}
            onDelete={() => handleDelete(row)}
          />
        )}
      />

      <GenericModal
        onConfirm={handleSubmit}
        open={openModal}
        onClose={handleCloseModal}
        title={selectedProdottoAttributo?.id ? 'Modifica attributo' : 'Nuovo attributo'}
        confirmButtonText="Salva"
        maxWidth="md"
        isLoading={isSaving}
      >
        <ProdottoAttributoForm
          isLoading={isSaving}
          open={openModal}
          onClose={handleCloseModal}
          prodotto_attributo={selectedProdottoAttributo as any}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          prodottoType={prodotto.type}
          prodotto_id={prodotto.id}
          prodotto={prodotto}
        />
      </GenericModal>
    </Box>
  );
}
