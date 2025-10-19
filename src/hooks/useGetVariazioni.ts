import { useQuery } from '@tanstack/react-query';
import { Variazione } from 'src/types/Variazione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';



const fetchVariazioni = async (prodotto_id: string): Promise<Variazione[]> => {
    const response = await axiosInstance.get(API_BASE_PREFIX + '/products/' + prodotto_id + '/variations', {
    });
    return response.data.data.items as Variazione[] || [];
};

export function useGetVariazioni(prodotto_id: string) {
    return useQuery({
        queryKey: ['variazioni', prodotto_id.toString()],
        queryFn: () => fetchVariazioni(prodotto_id),
    });
} 