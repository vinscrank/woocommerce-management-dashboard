import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

interface CreateAttributoOpzioneVariables {
    name: string;
    slug?: string;
    description?: string;
    menuOrder?: number;
}

export function usePostAttributoOpzione({ attributo_id }: { attributo_id: number }) {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();

    return useMutation({
        mutationFn: async (variables: any) => {
            // Prepara payload per WooCommerce (rimuovi attributo_id se presente)
            const { attributo_id: _, ...rest } = variables;
            const payload = {
                name: rest.name,
                slug: rest.slug || rest.name.toLowerCase().replace(/\s+/g, '-'),
                description: rest.description || '',
                menuOrder: rest.menuOrder || 0,
            };
            const { data } = await axiosInstance.post<AttributoOpzione>(
                `${API_BASE_PREFIX}/${ecommerceId}/products/attributes/${attributo_id}/terms`,
                payload
            );
            return data;
        },
        onSuccess: (newOpzione) => {
            queryClient.invalidateQueries({
                queryKey: ['attributoOpzioni', attributo_id]
            });

            queryClient.invalidateQueries({
                queryKey: ['attributo', attributo_id]
            });
        },
    });
} 