import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

export function usePutVariazione(prodotto_id: number, id_variazione: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            const { data: responseData } = await axiosInstance.patch(`/variazioni/${id}`, data);
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