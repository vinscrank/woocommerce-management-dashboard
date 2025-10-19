import { Box } from '@mui/material';
import { useGetAttributo } from 'src/hooks/useGetAttributo';
import { useDeleteAttributoOpzione } from 'src/hooks/useDeleteAttributoOpzione';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import { AttributoOpzioniTable } from './attributo-opzioni-table';
import { usePutAttributoOpzione } from 'src/hooks/usePutAttributoOpzione';
import { usePostAttributoOpzione } from 'src/hooks/usePostAttributoOpzione';

interface AttributoOpzioniContainerProps {
    attributoId: string
}

export default function AttributoOpzioniContainer({ attributoId }: AttributoOpzioniContainerProps) {
    const { data, isLoading, error } = useGetAttributo(Number(attributoId));

    const createMutation = usePostAttributoOpzione({ attributo_id: Number(attributoId) });
    const updateMutation = usePutAttributoOpzione({ attributo_id: Number(attributoId) });
    const deleteMutation = useDeleteAttributoOpzione({ attributo_id: Number(attributoId) });

    if (isLoading) return <Box>Caricamento in corso...</Box>;
    if (error) return <Box>Errore nel caricamento delle opzioni</Box>;
    if (!data) return null;

    // Handler per la creazione di una nuova opzione
    const handleCreate = (nuovaOpzione: Partial<AttributoOpzione>) => {
        createMutation.mutate({
            ...nuovaOpzione,
            name: nuovaOpzione.name,
        });
    };

    // Handler per la modifica di un'opzione
    const handleEdit = (opzione: AttributoOpzione) => {
        updateMutation.mutate(opzione);
    };

    // Handler per l'eliminazione di un'opzione
    const handleDelete = (opzione: AttributoOpzione) => {
        if (confirm('Sei sicuro di voler eliminare questa opzione? Questa azione non può essere annullata.')) {
            deleteMutation.mutate({
                id: opzione.id as number,
                attributo_id: Number(attributoId)
            });
        }
    };

    // Passiamo le opzioni dell'attributo al componente
    return (
        <AttributoOpzioniTable
            attributoId={Number(attributoId)}
            attributoOpzioni={data.options as AttributoOpzione[]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            isDeleting={deleteMutation.isPending}
        />
    );
} 