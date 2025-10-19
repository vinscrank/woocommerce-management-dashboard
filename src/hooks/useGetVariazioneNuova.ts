import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

interface VariazioneNuovaParams {
    prodotto_id: number;
 
}

export function useGetVariazioneNuova(params: VariazioneNuovaParams) {
    return useQuery({
        queryKey: ['variazioneNuova', params.prodotto_id.toString()],
        queryFn: async () => {
            const response = await axiosInstance.get('/variazione/nuova', {
                params: {
                    prodotto_id: params.prodotto_id,
                }
            });
            return response.data;
        }
    });
} 