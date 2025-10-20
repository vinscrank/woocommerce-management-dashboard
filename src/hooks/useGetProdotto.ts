import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Prodotto } from 'src/types/Prodotto';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export const useGetProdotto = (id: string) => {
    const { ecommerceId } = useWorkspace();
    return useQuery({
        queryKey: ['prodotto', id],
        queryFn: async (): Promise<Prodotto> => {

            const response = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/${id}`);
            return response.data.data;

        },
        enabled: !!id && !!ecommerceId, 
    });
}; 