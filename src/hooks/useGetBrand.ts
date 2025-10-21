import { useQuery } from '@tanstack/react-query';
import { Brand } from 'src/types/Brand';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
}

const fetchBrands = async (
    ecommerceId: number | null,
    page: number = 1,
    perPage: number = 25,
    search: string = ''
): Promise<PaginatedResponse<Brand>> => {
    const params: any = {
        page,
        perPage,
        orderBy: 'id',
        order: 'desc',
    };

    if (search) {
        params.search = search;
    }

    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/brands`, {
        params,
    });

    return {
        items: data.data.items || [],
        totalItems: data.data.totalItems || data.data.items?.length || 0,
    };
};

// Hook paginato per le liste
export const useGetBrands = (page: number = 1, perPage: number = 25, search: string = '') => {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse<Brand>, Error>({
        queryKey: ['brands', page, perPage, search],
        queryFn: () => fetchBrands(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
};

// Hook per ottenere TUTTI i brands (per dropdown/select) - retrocompatibilità
export const useGetAllBrands = () => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Brand[], Error>({
        queryKey: ['brands', 'all'],
        queryFn: async () => {
            const result = await fetchBrands(ecommerceId, 1, 100, '');
            return result.items;
        },
        enabled: !!ecommerceId,
    });
}; 