import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function useDeleteVariazione(prodotto_id: number) {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await axiosInstance.delete(`${API_BASE_PREFIX}/${ecommerceId}/products/${prodotto_id}/variations/${id}`, {
                data: { force: 0 }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variazioni', prodotto_id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['variazioni'] });
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto_id.toString()] });
        },
        onError: async (error: any) => {
            return ['Errore durante l\'eliminazione della variazione'];
        }
    });
} 