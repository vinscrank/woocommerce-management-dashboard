import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from 'src/context/WorkspaceContext';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { sanitizeVariazioneData } from 'src/utils/prodotto-utils';

export function usePutVariazione(prodotto_id: number, id_variazione: number) {
    const queryClient = useQueryClient();

    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            // Sanitizza i dati (pulisce campi, converte tipi, rimuove null/empty)
            const cleanedData = sanitizeVariazioneData(data);

            const { data: responseData } = await axiosInstance.patch(`${API_BASE_PREFIX}/${ecommerceId}/products/${prodotto_id}/variations/${id}`, cleanedData);
            return responseData.data;
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['variazione', prodotto_id.toString(), id_variazione.toString()] });
            queryClient.invalidateQueries({ queryKey: ['variazioni', prodotto_id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto_id.toString()] });
        },
        onError: async (error: any) => {
            return Object.values(error.response.data.errors).flat();
        }
    });
} 