import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Brand } from 'src/types/Brand';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePutBrand() {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();
    return useMutation({
        mutationFn: async (data: Brand) => {
            const { data: response } = await axiosInstance.patch<Brand>(`${API_BASE_PREFIX}/${ecommerceId}/products/brands/${data.id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
} 