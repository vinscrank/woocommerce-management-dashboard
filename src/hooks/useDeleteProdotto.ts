import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export const useDeleteProdotto = (id: number) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async ({ force }: { force: boolean }) => {
            // Gestione delle conferme
            const message = force
                ? 'Sei sicuro di voler eliminare definitivamente questo prodotto?'
                : 'Sei sicuro di voler spostare questo prodotto nel cestino?';

            if (confirm(message)) {
                const response = await axiosInstance.delete(`${API_BASE_PREFIX}/${ecommerceId}/products/${id}`, {
                    data: { force: force ? 1 : 0 }
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