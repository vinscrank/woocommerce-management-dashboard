import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Tag } from 'src/types/Tag';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePutTag() {
    const queryClient = useQueryClient();

    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async (data: Tag) => {
            const { data: response } = await axiosInstance.put<Tag>(`${API_BASE_PREFIX}/${ecommerceId}/products/tags/${data.id}`, data);
            return response;
        },
        onSuccess: (updatedTag) => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
} 