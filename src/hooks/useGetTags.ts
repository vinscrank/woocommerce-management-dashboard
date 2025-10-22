import { useQuery } from '@tanstack/react-query';
import { Tag } from 'src/types/Tag';
import { PaginatedResponse } from 'src/types/PaginetedResponse';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

const fetchTags = async (
    ecommerceId: number | null,
    page: number = 1,
    perPage: number = 25,
    search: string = ''
): Promise<PaginatedResponse<Tag>> => {
    const params: any = {
        page,
        perPage,
        orderBy: 'id',
        order: 'desc',
    };

    if (search) {
        params.search = search;
    }

    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/tags`, {
        params,
    });

    const items = data.data.items || [];
    const totalItems = data.data.totalItems || items.length || 0;
    const totalPages = Math.ceil(totalItems / perPage);

    return {
        items,
        currentPage: page,
        itemsInPage: items.length,
        totalItems,
        totalPages,
    };
};

// Hook paginato per le liste
export const useGetTags = (page: number = 1, perPage: number = 25, search: string = '') => {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse<Tag>, Error>({
        queryKey: ['tags', page, perPage, search],
        queryFn: () => fetchTags(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
};

// Hook per ottenere TUTTI i tags (per dropdown/select) - retrocompatibilità
export const useGetAllTags = () => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Tag[], Error>({
        queryKey: ['tags', 'all'],
        queryFn: async () => {
            const result = await fetchTags(ecommerceId, 1, 3, '');
            return result.items;
        },
        enabled: !!ecommerceId,
    });
}; 