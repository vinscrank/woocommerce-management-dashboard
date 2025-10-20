import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from 'src/context/WorkspaceContext';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

export const useDeleteAttributo = () => {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (attributoId: number) => {
            const response = await axiosInstance.delete(`${API_BASE_PREFIX}/${ecommerceId}/products/attributes/${attributoId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attributi'] });
        },
    });
}; 