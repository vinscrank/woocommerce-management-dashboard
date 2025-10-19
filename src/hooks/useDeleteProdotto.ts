import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

export const useDeleteProdotto = (id: number) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: async ({ force }: { force: boolean }) => {
            // Gestione delle conferme
            const message = force
                ? 'Sei sicuro di voler eliminare definitivamente questo prodotto?'
                : 'Sei sicuro di voler spostare questo prodotto nel cestino?';

            if (confirm(message)) {
                // Chiamata API per eliminare il prodotto
                const response = await axiosInstance.delete(`/prodotti/${id}`, {
                    params: { force }
                });
                return response.data;
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['prodotti'] });
            if (!variables.force) {
                queryClient.invalidateQueries({ queryKey: ['prodotto', id.toString()] });
            }
            if (variables.force) {
                router.push('/prodotti');
            }
        }
    });
}; 