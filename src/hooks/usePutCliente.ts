import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cliente } from 'src/types/Cliente';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePutCliente() {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (data: Cliente) => {
      const { data: response } = await axiosInstance.patch<Cliente>(`${API_BASE_PREFIX}/${ecommerceId}/customers/${data.id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clienti'] });
    },
  });
}

