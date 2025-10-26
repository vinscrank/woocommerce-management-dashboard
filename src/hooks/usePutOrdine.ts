import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ordine } from 'src/types/Ordine';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePutOrdine() {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (data: Ordine) => {
      const { data: response } = await axiosInstance.patch<Ordine>(`${API_BASE_PREFIX}/${ecommerceId}/orders/${data.id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordini'] });
    },
  });
}

