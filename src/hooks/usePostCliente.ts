import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cliente } from 'src/types/Cliente';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

interface PostClienteVariables {
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  billing?: any;
  shipping?: any;
  metaData?: any[];
}

export function usePostCliente() {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (variables: PostClienteVariables) => {
      const { data } = await axiosInstance.post<Cliente>(`${API_BASE_PREFIX}/${ecommerceId}/customers`, variables);
      return data;
    },
    onSuccess: (newCliente) => {
      // Invalida la query dei clienti per forzare un refresh
      queryClient.invalidateQueries({ queryKey: ['clienti'] });
    },
  });
}

