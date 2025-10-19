import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Attributo } from 'src/types/Attributo';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

interface PostAttributoVariables {
    name: string;
    slug?: string;
    orderBy?: string;
    hasArchives?: boolean;
}

export function usePostAttributo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (variables: PostAttributoVariables) => {
            const payload = {
                name: variables.name,
                slug: variables.slug || variables.name.toLowerCase().replace(/\s+/g, '-'),
                orderBy: variables.orderBy || 'menu_order',
                hasArchives: variables.hasArchives ?? false,
            };
            const { data } = await axiosInstance.post<Attributo>(`${API_BASE_PREFIX}/products/attributes`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attributi'] });
        },
    });
} 