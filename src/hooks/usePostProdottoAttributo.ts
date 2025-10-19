import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';

export const usePostProdottoAttributo = (prodotto_id: number, prodottoType: string, onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {



            if (data.attributo_id == null && data.attributo.name == null) {
                throw new Error('Inserisci attributo');
            }

            if (prodottoType === 'simple') {
                data.abilitato_per_variazioni = false;
            }
            return axiosInstance.post('/prodotto/attributo/salva', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto_id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto_id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['variazioneNuova', prodotto_id.toString()] });
            onSuccess?.();
        },

    });
}; 