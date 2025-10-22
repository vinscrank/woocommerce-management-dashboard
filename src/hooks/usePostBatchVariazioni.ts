import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Variazione } from 'src/types/Variazione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { sanitizeVariazioneData } from 'src/utils/prodotto-utils';

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

            // Sanitizza ogni variazione (pulisce campi, converte tipi, rimuove null/empty)
            const cleanedVariazioni = variables.variazioni.map((variazione) =>
                sanitizeVariazioneData(variazione)
            );


            const { data } = await axiosInstance.post<BatchVariazioniResponse>(
                API_BASE_PREFIX + '/' + ecommerceId + '/products/' + id_macro + '/variations/batch',
                {
                    update: cleanedVariazioni
                }
            );

            return data;
        },
        onSuccess: () => {
            // Invalida E refetch immediato della query delle variazioni
            queryClient.invalidateQueries({ queryKey: ['variazioni', id_macro.toString()] })
        },
    });
} 