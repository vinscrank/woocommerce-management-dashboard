import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';


interface CategoriaImmagineData {
    categoria_id: string;
    categoria_immagine_principale: File | null;
    categoria_immagini?: File[];
}

export const useUploadCategoriaImmagine = () => {

    const queryClient = useQueryClient();
    
    const uploadMutation = useMutation({
        mutationFn: async (data: CategoriaImmagineData) => {
            const formData = new FormData();
            formData.append('categoria_id', data.categoria_id);

            if (data.categoria_immagine_principale) {
                formData.append('immagine_principale', data.categoria_immagine_principale);
            }

            if (data.categoria_immagini?.length) {
                data.categoria_immagini.forEach((img) => {
                    formData.append('categoria_immagini[]', img);
                });
            }

            const headers = { 'Content-Type': 'multipart/form-data' };
            return axiosInstance.post('/categoria/immagini/salva', formData, { headers });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorie'] });

        },
        onError: () => {

        },
    });

    return uploadMutation;
}; 