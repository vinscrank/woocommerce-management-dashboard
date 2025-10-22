import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { sanitizeVariazioneData } from 'src/utils/prodotto-utils';

export function usePostVariazione(prodotto_id: number) {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async (data: any) => {
            // Sanitizza i dati (pulisce campi, converte tipi, rimuove null/empty)
            const cleanedData = sanitizeVariazioneData(data);

            console.log('Variazione create - dati sanitizzati:', cleanedData);

            const { data: { data: responseData } } = await axiosInstance.post(`${API_BASE_PREFIX}/${ecommerceId}/products/${prodotto_id}/variations`, cleanedData);
            return responseData;
        },
        onSuccess: async (newVariazione) => {
            queryClient.invalidateQueries({ queryKey: ['variazioni', prodotto_id.toString()] });
    
        },
        onError: async (error: any) => {
            return Object.values(error.response.data.errors).flat();
        }
    });
} 