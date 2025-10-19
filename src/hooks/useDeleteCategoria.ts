import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';

export const useDeleteCategoria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (categoriaId: number) => {
            const response = await axiosInstance.delete(`/categorie/${categoriaId}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalida la query dei tags per forzare un refresh
            queryClient.invalidateQueries({ queryKey: ['categorie'] });
        },
    });
}; 