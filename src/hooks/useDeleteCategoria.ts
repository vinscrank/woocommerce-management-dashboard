import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

export const useDeleteCategoria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (categoriaId: number) => {
            const response = await axiosInstance.delete(`${API_BASE_PREFIX}/products/categories/${categoriaId}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalida la query dei tags per forzare un refresh
            queryClient.invalidateQueries({ queryKey: ['categorie'] });
        },
    });
}; 