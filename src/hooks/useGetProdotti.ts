import { useQuery } from '@tanstack/react-query';
import { Prodotto } from 'src/types/Prodotto';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { PaginatedResponse } from 'src/types/PaginetedResponse';


const fetchProdotti = async (
    ecommerceId: number | null,
    page: number = 1,
    perPage: number = 25,
    search?: string
): Promise<PaginatedResponse<Prodotto>> => {
    if (!ecommerceId) {
        return {
            items: [],
            currentPage: 1,
            itemsInPage: 0,
            totalItems: 0,
            totalPages: 0,
        };
    }

    // Trim della ricerca e verifica che non sia vuota
    const trimmedSearch = search?.trim();
    const searchParam = trimmedSearch && trimmedSearch.length > 0 ? trimmedSearch : undefined;


    const response = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products`, {
        params: {
            page,
            perPage,
            fields: 'id,name,sku,price,regularPrice,salePrice,images,date_created,date_modified,status,stock_status,type',
            status: 'any', // Include tutti gli stati: publish, draft, pending, private, trash, etc.
            ...(searchParam && { search: searchParam }),
        },
    });

    return response.data.data;
};

export const useGetProdotti = (page: number = 1, perPage: number = 25, search?: string) => {
    const { ecommerceId } = useWorkspace();

    return useQuery<PaginatedResponse<Prodotto>, Error>({
        queryKey: ['prodotti', ecommerceId, page, perPage, search],
        queryFn: () => fetchProdotti(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
}; 