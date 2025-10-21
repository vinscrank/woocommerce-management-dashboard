import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePostVariazione(prodotto_id: number) {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async (data: any) => {

            const { data: { data: responseData } } = await axiosInstance.post(`${API_BASE_PREFIX}/${ecommerceId}/products/${prodotto_id}/variations`, data);
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