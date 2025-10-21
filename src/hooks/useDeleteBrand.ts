import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (brandId: number) => {
            const response = await axiosInstance.delete(`${API_BASE_PREFIX}/${ecommerceId}/products/brands/${brandId}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalida la query dei brands per forzare un refresh
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
}; 