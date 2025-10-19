import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';

export const useDeleteProdottoAttributo = (prodotto_id :number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (prodottoAttributo:any) => {
            const response = await axiosInstance.post('/prodotto/attributo/rimuovi',prodottoAttributo);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto_id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['variazioni', prodotto_id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['variazioneNuova', prodotto_id.toString()] });
        },
    });
}; 