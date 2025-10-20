import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePutCategoria() {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async (data: Categoria) => {
            const { data: response } = await axiosInstance.patch<Categoria>(`${API_BASE_PREFIX}/${ecommerceId}/products/categories/${data.id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorie'] });
        },
    });
} 