import { useQuery } from '@tanstack/react-query';
import { Prodotto } from 'src/types/Prodotto';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

const fetchProdotti = async (ecommerceId: number | null): Promise<Prodotto[]> => {
    if (!ecommerceId) return [];
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products?page=1&perPage=25&fields=id,name,sku,price,regularPrice,salePrice,images,date_created,date_modified,status,stock_status,type`);
    return data.data.items;
};

export const useGetProdotti = () => {
    const { ecommerceId } = useWorkspace();

    return useQuery<Prodotto[], Error>({
        queryKey: ['prodotti', ecommerceId],
        queryFn: () => fetchProdotti(ecommerceId),
        enabled: !!ecommerceId,
    });
}; 