import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Prodotto } from 'src/types/Prodotto';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { sanitizeProdottoData } from 'src/utils/prodotto-utils';

export function usePutProdotto(prodottoId: number) {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Prodotto }) => {
            // Sanitizza i dati prima dell'invio
            const sanitizedData = sanitizeProdottoData(data);
            const { data: responseData } = await axiosInstance.patch<Prodotto>(`${API_BASE_PREFIX}/${ecommerceId}/products/${id}`, sanitizedData);
            return responseData;
        },
        onSuccess: async () => {

           
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodottoId.toString()] });
            queryClient.invalidateQueries({ queryKey: ['prodotti'] });
            queryClient.invalidateQueries({ queryKey: ['variazioni', prodottoId.toString()] });
        },
        onError: async (error: any) => {
            return Object.values(error.response.data.errors).flat();
        }
    });
} 