import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Attributo } from 'src/types/Attributo';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePutAttributo() {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (data: Attributo) => {
            const { data: response } = await axiosInstance.patch<Attributo>(`${API_BASE_PREFIX}/${ecommerceId}/products/attributes/${data.id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attributi'] });
        },
    });
} 