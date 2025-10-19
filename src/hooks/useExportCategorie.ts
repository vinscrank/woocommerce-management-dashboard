import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

export function useExportCategorie() {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get('/categorie-essenziali-export', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'categories-export.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    });
} 