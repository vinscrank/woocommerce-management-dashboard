import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
}

const fetchCategories = async (
    ecommerceId: number | null,
    page: number = 1,
    perPage: number = 25,
    search: string = ''
): Promise<PaginatedResponse<Categoria>> => {
    const params: any = {
        page,
        perPage,
        orderBy: 'id',
        order: 'desc',
    };

    if (search) {
        params.search = search;
    }
    params.fields = 'id,name,slug,parent';

    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/categories`, {
        params,
    });

    return {
        items: data.data.items || [],
        totalItems: data.data.totalItems || data.data.items?.length || 0,
    };
};

// Hook paginato per le liste
export const useGetCategories = (page: number = 1, perPage: number = 25, search: string = '') => {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse<Categoria>, Error>({
        queryKey: ['categorie', page, perPage, search],
        queryFn: () => fetchCategories(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
};

// Hook per ottenere TUTTE le categorie (per dropdown/select) - retrocompatibilità
export const useGetAllCategories = () => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Categoria[], Error>({
        queryKey: ['categorie', 'all'],
        queryFn: async () => {
            const result = await fetchCategories(ecommerceId, 1, 100, '');
            return result.items;
        },
        enabled: !!ecommerceId,
    });
}; 