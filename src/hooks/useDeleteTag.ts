import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export const useDeleteTag = () => {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (tagId: number) => {
            const response = await axiosInstance.delete(`${API_BASE_PREFIX}/${ecommerceId}/products/tags/${tagId}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalida la query dei tags per forzare un refresh
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
}; 