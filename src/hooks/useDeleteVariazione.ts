import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

export function useDeleteVariazione() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await axiosInstance.delete(`/variazioni/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variazioni'] });
        },
        onError: async (error: any) => {
            return ['Errore durante l\'eliminazione della variazione'];
        }
    });
} 