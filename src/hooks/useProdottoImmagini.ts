import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';

type UploadImmaginiParams = {
    prodotto_id: string;
    files: File[];
};

export function useProdottoImmagini(prodotto_id: number) {
    const queryClient = useQueryClient();

    const uploadImmaginiMutation = useMutation({
        mutationFn: async ({ prodotto_id, files }: UploadImmaginiParams) => {
            const formData = new FormData();
            formData.append('prodotto_id', prodotto_id);

            files.forEach(file => {
                formData.append('prodotto_immagini[]', file);
            });

            const response = await axios.post('/prodotti/salva-immagini', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto_id.toString()] });
        }
    });

    const rimuoviImmagineMutation = useMutation({
        mutationFn: async (immagineId: string) => {
            const response = await axiosInstance.get(`/prodotto/immagine/${immagineId}/rimuovi`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto_id.toString()] });
        }
    });

    return {
        uploadImmagini: uploadImmaginiMutation.mutateAsync,
        rimuoviImmagine: rimuoviImmagineMutation.mutateAsync,
        isLoading: uploadImmaginiMutation.isPending || rimuoviImmagineMutation.isPending
    };
} 