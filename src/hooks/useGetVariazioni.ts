import { useQuery } from '@tanstack/react-query';
import { Variazione } from 'src/types/Variazione';
import { PaginatedResponse } from 'src/types/PaginetedResponse';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

const fetchVariazioni = async (
    prodotto_id: string,
    ecommerceId: number | null,
    page: number = 1,
    perPage: number = 25
): Promise<PaginatedResponse<Variazione>> => {
    const params: any = {
        page,
        perPage,
        orderBy: 'menu_order',
        order: 'asc',
    };

    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/${prodotto_id}/variations`, {
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

// Hook paginato per la lista delle variazioni
export function useGetVariazioni(prodotto_id: string, page: number = 1, perPage: number = 25) {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse<Variazione>, Error>({
        queryKey: ['variazioni', prodotto_id.toString(), page, perPage],
        queryFn: () => fetchVariazioni(prodotto_id, ecommerceId, page, perPage),
        enabled: !!ecommerceId && !!prodotto_id,
    });
}
