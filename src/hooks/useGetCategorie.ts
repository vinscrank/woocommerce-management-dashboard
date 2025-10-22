import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { Categoria } from 'src/types/Categoria';
import { PaginatedResponse } from 'src/types/PaginetedResponse';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

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
    params.fields = 'id,name,slug,parent,image';

    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/categories`, {
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
export const useGetCategories = (page: number = 1, perPage: number = 25, search: string = '') => {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse<Categoria>, Error>({
        queryKey: ['categorie', page, perPage, search],
        queryFn: () => fetchCategories(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
};

