import { useQuery } from '@tanstack/react-query';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { Attributo } from 'src/types/Attributo';
import { PaginatedResponse } from 'src/types/PaginetedResponse';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

const fetchAttributi = async (
    ecommerceId: number | null,
    page: number = 1,
    perPage: number = 25,
    search: string = ''
): Promise<PaginatedResponse<Attributo>> => {
    const params: any = {
        page,
        perPage,
        //  orderBy: 'id',
        // order: 'desc',
    };

    if (search) {
        params.search = search;
    }

    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/attributes`, {
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
export const useGetAttributi = (page: number = 1, perPage: number = 25, search: string = '') => {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse<Attributo>, Error>({
        queryKey: ['attributi', ecommerceId, page, perPage, search],
        queryFn: () => fetchAttributi(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
};

// /**
//  * @deprecated Usa useGetAttributi con usePaginatedSelect invece
//  * Hook per ottenere TUTTI gli attributi (per dropdown/select) - retrocompatibilità
//  * Limitato a 100 items, usare useGetAttributi per paginazione completa
//  */
// export const useGetAllAttributi = () => {
//     const { ecommerceId } = useWorkspace();
//     return useQuery<Attributo[], Error>({
//         queryKey: ['attributi', 'all'],
//         queryFn: async () => {
//             const result = await fetchAttributi(ecommerceId, 1, 100, '');
//             return result.items;
//         },
//         enabled: !!ecommerceId,
//     });
// }; 