import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';


interface ProdottoImmagineData {
    prodotto_id: string;
    prodotto_immagine_principale: File | null;
    prodotto_immagini?: File[];
}

export const useUploadProdottoImmagini = (prodotto_id: number) => {
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: async (data: ProdottoImmagineData) => {
            const formData = new FormData();
            formData.append('prodotto_id', data.prodotto_id);

            if (data.prodotto_immagine_principale) {
                formData.append('immagine_principale', data.prodotto_immagine_principale);
            }

            if (data.prodotto_immagini != null && data.prodotto_immagini.length > 0) {
                for (let i = 0; i < data.prodotto_immagini.length; i++) {
                    if (data.prodotto_immagini[i]) {
                        formData.append(`immagini[${i}]`, data.prodotto_immagini[i]);
                    }
                }
            }

            // Verifichiamo se ci sono immagini da caricare
            if ((data.prodotto_immagini != null && data.prodotto_immagini.length > 0) || data.prodotto_immagine_principale != null) {
                const headers = { 'Content-Type': 'multipart/form-data' };
                return axiosInstance.post('/prodotto/immagini-salva', formData, { headers });
            }

            return Promise.resolve(); // Ritorniamo una promise vuota se non ci sono immagini
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prodotto', prodotto_id.toString()] });
        },
        onError: () => {

        },
    });

    return uploadMutation;
}; 