import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Prodotto } from 'src/types/Prodotto';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePutProdotto(prodottoId: number) {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Prodotto }) => {
            const { data: responseData } = await axiosInstance.patch<Prodotto>(`${API_BASE_PREFIX}/${ecommerceId}/products/${id}`, data);
            return responseData;
        },
        onSuccess: async () => {

           
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodottoId.toString()] });
            queryClient.invalidateQueries({ queryKey: ['prodotti'] });
        },
        onError: async (error: any) => {
            return Object.values(error.response.data.errors).flat();
        }
    });
} 