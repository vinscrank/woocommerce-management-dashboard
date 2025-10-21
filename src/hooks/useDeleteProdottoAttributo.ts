import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { removeReadOnlyFields } from 'src/utils/prodotto-utils';

export const useDeleteProdottoAttributo = (prodotto: any) => {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (attributoToDelete: any) => {
            // Filtra gli attributi rimuovendo quello da eliminare
            const updatedAttributes = (prodotto?.attributes || []).filter((attr: any) =>
                !((attr.id && attr.id === attributoToDelete.id) ||
                    (attr.name && attr.name === attributoToDelete.name))
            );

            // Prepara i dati del prodotto completi con gli attributi aggiornati
            const prodottoData = {
                ...prodotto,
                attributes: updatedAttributes,
            };

            // Rimuovi campi read-only e problematici
            const cleanedData = removeReadOnlyFields(prodottoData);

            // Fai il PATCH al prodotto con tutti i campi meno l'attributo eliminato
            const response = await axiosInstance.patch(
                `${API_BASE_PREFIX}/${ecommerceId}/products/${prodotto.id}`,
                cleanedData
            );
            return response.data;
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto.id.toString()] });
            
            queryClient.invalidateQueries({ queryKey: ['variazioni', prodotto.id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['variazioneNuova', prodotto.id.toString()] });
        },
    });
}; 