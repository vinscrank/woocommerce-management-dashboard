import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

export function usePostVariazione(prodotto_id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {

            const { data: { data: responseData } } = await axiosInstance.post('/variazioni', data);
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