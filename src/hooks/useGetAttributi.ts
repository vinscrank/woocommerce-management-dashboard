import { useQuery } from '@tanstack/react-query';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { Attributo } from 'src/types/Attributo';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
}

const fetchAttributi = async (
    ecommerceId: number | null,
    page: number = 1,
    perPage: number = 25,
    search: string = ''
): Promise<PaginatedResponse<Attributo>> => {
    const params: any = {
        page,
        perPage,
        orderBy: 'id',
        order: 'desc',
    };

    if (search) {
        params.search = search;
    }

    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/attributes`, {
        params,
    });

    return {
        items: data.data.items || [],
        totalItems: data.data.totalItems || data.data.items?.length || 0,
    };
};

// Hook paginato per le liste
export const useGetAttributi = (page: number = 1, perPage: number = 25, search: string = '') => {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse<Attributo>, Error>({
        queryKey: ['attributi', page, perPage, search],
        queryFn: () => fetchAttributi(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
};

// Hook per ottenere TUTTI gli attributi (per dropdown/select) - retrocompatibilità
export const useGetAllAttributi = () => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Attributo[], Error>({
        queryKey: ['attributi', 'all'],
        queryFn: async () => {
            const result = await fetchAttributi(ecommerceId, 1, 100, '');
            return result.items;
        },
        enabled: !!ecommerceId,
    });
}; 