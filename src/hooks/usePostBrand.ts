import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Brand } from 'src/types/Brand';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

interface PostBrandVariables {
    name: string;
    slug?: string;
}

export function usePostBrand() {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (variables: PostBrandVariables) => {
            const { data } = await axiosInstance.post<Brand>(`${API_BASE_PREFIX}/${ecommerceId}/products/brands`, variables);
            return data;
        },
        onSuccess: () => {
            // Invalida la query dei tag per forzare un refresh
            queryClient.invalidateQueries({ queryKey: ['brands'] });

        },
    });
} 