import { useQuery } from '@tanstack/react-query';
import { Prodotto } from 'src/types/Prodotto';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

const fetchProdotti = async (): Promise<Prodotto[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/products?page=1&perPage=25&_fields=id,name,sku,price,regular_price,sale_price,images`);
    console.log(data.data.items);
    return data.data.items;
};

export const useGetProdotti = () => {
    return useQuery<Prodotto[], Error>({
        queryKey: ['prodotti'],
        queryFn: fetchProdotti,
    });
}; 