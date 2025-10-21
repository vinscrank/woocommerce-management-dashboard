import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { keepOnlyWritableFields } from 'src/utils/prodotto-utils';

export function usePostVariazione(prodotto_id: number) {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async (data: any) => {
            // Pulisci i dati mantenendo solo i campi scrivibili
            const cleanedData = keepOnlyWritableFields(data);

            console.log('Variazione create - dati puliti:', cleanedData);

            const { data: { data: responseData } } = await axiosInstance.post(`${API_BASE_PREFIX}/${ecommerceId}/products/${prodotto_id}/variations`, cleanedData);
            return responseData;
        },
        onSuccess: async (newVariazione) => {
            queryClient.invalidateQueries({ queryKey: ['variazioni', prodotto_id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['variazioni'] });
        },
        onError: async (error: any) => {
            return Object.values(error.response.data.errors).flat();
        }
    });
} 