import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Tag } from 'src/types/Tag';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

interface PostTagVariables {
    name: string;
    slug?: string;
}

export function usePostTag() {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (variables: PostTagVariables) => {
            const { data } = await axiosInstance.post<Tag>(`${API_BASE_PREFIX}/${ecommerceId}/products/tags`, variables);
            return data;
        },
        onSuccess: (newTag) => {
            // Invalida la query dei tag per forzare un refresh
            queryClient.invalidateQueries({ queryKey: ['tags'] });

        },
    });
} 