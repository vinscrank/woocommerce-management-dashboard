import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Prodotto } from 'src/types/Prodotto';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

export const useGetProdotto = (id: string) => {
    return useQuery({
        queryKey: ['prodotto', id],
        queryFn: async (): Promise<Prodotto> => {

            const response = await axiosInstance.get(`${API_BASE_PREFIX}/products/${id}`);
            return response.data.data;

        },
        enabled: !!id, 
    });
}; 