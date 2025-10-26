import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export const useDeleteOrdine = () => {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (ordineId: number) => {
      const response = await axiosInstance.delete(`${API_BASE_PREFIX}/${ecommerceId}/orders/${ordineId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalida la query degli ordini per forzare un refresh
      queryClient.invalidateQueries({ queryKey: ['ordini'] });
    },
  });
};

