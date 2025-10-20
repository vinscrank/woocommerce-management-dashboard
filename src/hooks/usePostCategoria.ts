import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

interface PostCategoriaVariables {
    name: string;
    slug?: string;
}

export function usePostCategoria() {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (variables: PostCategoriaVariables) => {
            const { data } = await axiosInstance.post<Categoria>(`${API_BASE_PREFIX}/${ecommerceId}/products/categories`, variables);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorie'] });
        },
    });
} 