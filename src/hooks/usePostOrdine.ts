import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ordine } from 'src/types/Ordine';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePostOrdine() {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (variables: any) => {
      const { data } = await axiosInstance.post<Ordine>(`${API_BASE_PREFIX}/${ecommerceId}/orders`, variables);
      return data;
    },
    onSuccess: (newOrdine) => {
      // Invalida la query degli ordini per forzare un refresh
      queryClient.invalidateQueries({ queryKey: ['ordini'] });
    },
  });
}

