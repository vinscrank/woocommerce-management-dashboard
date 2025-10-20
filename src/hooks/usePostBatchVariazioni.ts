import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Variazione } from 'src/types/Variazione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

interface BatchVariazioniResponse {
    data: any[]; // Idealmente qui dovresti definire il tipo corretto
}

interface BatchVariazioniVariables {
    variazioni: Variazione[]; // Anche qui dovresti definire il tipo corretto
}

export function usePostBatchVariazioni(id_macro: number) {
    const queryClient = useQueryClient();

    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (variables: BatchVariazioniVariables) => {
          
            const { data } = await axiosInstance.post<BatchVariazioniResponse>(
                API_BASE_PREFIX + '/' + ecommerceId + '/products/' + id_macro + '/variations/batch',
                {
                    _rawValue: variables.variazioni
                }
            );
            return data;
        },
        onSuccess: () => {
          
          
            // Invalida la query delle variazioni per forzare un refresh
            queryClient.invalidateQueries({ queryKey: ['variazioni', id_macro.toString()] });
        },
    });
} 