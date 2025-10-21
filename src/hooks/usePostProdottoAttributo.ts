import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { removeReadOnlyFields } from 'src/utils/prodotto-utils';

export const usePostProdottoAttributo = (prodotto: any, prodottoType: string, attributi: any[], onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (data: any) => {
            // Valida che ci sia almeno un ID o un nome
            if (!data.id && !data.name) {
                throw new Error('Inserisci attributo');
            }

            const existingAttributes = prodotto?.attributes || [];

            // Determina se è un attributo interno o globale
            const isAttributoInterno = !data.id || data.id === 0;

            let attributeName = data.name;
            let attributeId = isAttributoInterno ? undefined : data.id;

            // Per attributi globali, se non c'è il nome, cercalo negli attributi disponibili
            if (!isAttributoInterno && data.id && !attributeName) {
                const attributoGlobale = attributi.find((attr: any) => attr.id === data.id);
                attributeName = attributoGlobale?.name || '';
            }

            const variationValue = prodottoType === 'simple'
                ? false
                : (data.variation ?? true);

            // Prepara il nuovo attributo nel formato WooCommerce
            const newAttribute = {
                id: attributeId, // undefined per attributi interni, numero per attributi globali
                name: attributeName,
                options: data.options || [],
                variation: variationValue,
                visible: data.visible !== false,
                position: data.position || existingAttributes.length,
            };

            // Se l'attributo esiste già, aggiornalo, altrimenti aggiungilo
            const updatedAttributes = existingAttributes.some((attr: any) =>
                (attr.id && attr.id === newAttribute.id) || (attr.name === newAttribute.name)
            )
                ? existingAttributes.map((attr: any) =>
                    ((attr.id && attr.id === newAttribute.id) || attr.name === newAttribute.name)
                        ? newAttribute
                        : attr
                )
                : [...existingAttributes, newAttribute];

            // Prepara i dati del prodotto completi con gli attributi aggiornati
            const prodottoData = {
                ...prodotto,
                attributes: updatedAttributes,
            };

            // Rimuovi campi read-only e problematici
            const cleanedData = removeReadOnlyFields(prodottoData);

            // Fai il PATCH al prodotto con tutti i campi più gli attributi aggiornati
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
            onSuccess?.();
        },

    });
}; 