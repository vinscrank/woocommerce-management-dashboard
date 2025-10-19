import { useQuery } from '@tanstack/react-query';
import { Variazione } from 'src/types/Variazione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

export const useGetVariazione = (prodotto_id: number, id_variazione: number) => {
    return useQuery({
        queryKey: ['variazione', prodotto_id.toString(), id_variazione?.toString() || ''],
        queryFn: async (): Promise<Variazione> => {
            const response = await axiosInstance.get(`${API_BASE_PREFIX}/products/${prodotto_id}/variations/${id_variazione}`);
            return response.data.data;
        },
        enabled: !!prodotto_id && !!id_variazione,
    });
}; 