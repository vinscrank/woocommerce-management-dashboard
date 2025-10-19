import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

export function usePutCategoria() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Categoria) => {
            const { data: response } = await axiosInstance.put<Categoria>(`${API_BASE_PREFIX}/products/categories/${data.id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorie'] });
        },
    });
} 