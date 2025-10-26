import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (clienteId: number) => {
      const response = await axiosInstance.delete(`${API_BASE_PREFIX}/${ecommerceId}/customers/${clienteId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalida la query dei clienti per forzare un refresh
      queryClient.invalidateQueries({ queryKey: ['clienti'] });
    },
  });
};

