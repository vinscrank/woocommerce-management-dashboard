import { Box, Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Iconify } from 'src/components/iconify';
import { ProdottoVariazioneTableRow } from './prodotto-variazione-table-row';
import { ProdottoVariazioneForm } from './prodotto-variazione-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { useGetVariazioni } from 'src/hooks/useGetVariazioni';
import { useDeleteVariazione } from 'src/hooks/useDeleteVariazione';
import { usePostBatchVariazioni } from 'src/hooks/usePostBatchVariazioni';
import { Variazione } from 'src/types/Variazione';
import { STOCK_ENABLED } from 'src/utils/const';

type ProdottoVariazioniDatatableProps = {
  prodotto_id: number;
  prodotto: any;
};

export function ProdottoVariazioniDatatable({
  prodotto_id,
  prodotto,
}: ProdottoVariazioniDatatableProps) {
  const [openForm, setOpenForm] = useState(false);
  const [selectedVariazione, setSelectedVariazione] = useState<any>(null);

  const { data: variazioni, isLoading: isLoadingVariazioni } = useGetVariazioni(
    prodotto_id.toString()
  );
  const { mutate: batchUpdate, isPending: isBatchUpdatePending } =
    usePostBatchVariazioni(prodotto_id);
  const { mutate: destroyVariazione, isPending: isDeleteVariazionePending } =
    useDeleteVariazione(prodotto_id);

  const [localVariazioni, setLocalVariazioni] = useState<Variazione[]>(variazioni || []);

  useEffect(() => {
    if (variazioni) {
      setLocalVariazioni(variazioni);
    }
  }, [variazioni]);

  // Configurazione sensori per DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOpenForm = (variazione?: any) => {
    setSelectedVariazione(variazione || null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedVariazione(null);
    setOpenForm(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Sei sicuro di voler eliminare questa variazione?')) {
      destroyVariazione(id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !localVariazioni) return;

    const oldIndex = localVariazioni.findIndex((item) => item.id === active.id);
    const newIndex = localVariazioni.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedVariazioni = arrayMove(localVariazioni, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          menu_order: index + 1,
        })
      );

      // Aggiorna lo stato locale immediatamente
      setLocalVariazioni(updatedVariazioni);
      // Invia l'aggiornamento al server
      //batchUpdate({ variazioni: updatedVariazioni });
    }
  };

  const handleSaveAll = async () => {
    batchUpdate({ variazioni: localVariazioni });
  };

  const handleUpdateVariazione = (id: number, updates: Partial<Variazione>) => {
    setLocalVariazioni((prevVariazioni) =>
      prevVariazioni.map((variazione) =>
        variazione.id === id ? { ...variazione, ...updates } : variazione
      )
    );
  };

  const columns = [
    { id: 'ordinamento', label: '' },
    { id: 'id', label: 'ID' },
    { id: 'attributi', label: 'Attributi' },
    { id: 'sku', label: 'SKU' },
    ...(STOCK_ENABLED === '1' ? [{ id: 'stock_quantity', label: 'Qt. magazzino' }] : []),
    { id: 'regular_price', label: 'Prezzo Listino' },
    { id: 'sale_price', label: 'Prezzo Saldo' },
    { id: 'on_sale', label: 'Saldo' },
    { id: 'purchasable', label: 'Vendita' },
    { id: 'actions', label: 'Azioni' },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          mt: 5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6">
            Variazioni {prodotto?.name} ({variazioni?.length})
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:save-fill" />}
            onClick={handleSaveAll}
            disabled={variazioni?.length === 0}
            sx={{ mr: 1 }}
          >
            Salva variazioni
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => handleOpenForm()}
          >
            Nuova variazione
          </Button>
        </Box>
      </Box>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {localVariazioni && localVariazioni.length > 0 && (
          <SortableContext
            items={localVariazioni.map((v) => v.id as number)}
            strategy={verticalListSortingStrategy}
          >
            <GenericTable
              noOrder
              data={localVariazioni.filter((v): v is Variazione & { id: number } => v.id !== null)}
              columns={columns}
              isLoading={isLoadingVariazioni || isBatchUpdatePending || isDeleteVariazionePending}
              showCheckbox={false}
              showPagination={false}
              renderRow={(variazione) => (
                <ProdottoVariazioneTableRow
                  key={variazione.id}
                  id={variazione.id as number}
                  row={variazione}
                  onEdit={() => handleOpenForm(variazione)}
                  onDelete={() => handleDelete(variazione.id as number)}
                  onUpdate={(updates: Partial<Variazione>) =>
                    handleUpdateVariazione(variazione.id as number, updates)
                  }
                />
              )}
            />
          </SortableContext>
        )}
      </DndContext>

      <ProdottoVariazioneForm
        open={openForm}
        onClose={handleCloseForm}
        variazione={selectedVariazione}
        prodotto_id={prodotto_id}
        prodotto={prodotto}
        onSubmitSuccess={() => {
          //handleCloseForm();
        }}
      />
    </Box>
  );
}
