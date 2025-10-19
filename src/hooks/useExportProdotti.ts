import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { useState } from 'react';

export function useExportProdotti() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statistiche, setStatistiche] = useState<any | null>(null);

    const mutation = useMutation({
        mutationFn: async (prodottiIds: string[]) => {
            const response = await axiosInstance.get('/prodotti-essenziali-export', {
                responseType: 'blob',
                params: {
                    arrayProdottiSelezionatiId: JSON.stringify(prodottiIds)
                }
            });

          
            // Estrai le statistiche dall'header x-export-statistics
            const statistiche = JSON.parse(response.headers['x-export-statistics'] || '{}')
            setStatistiche(statistiche);
            setIsModalOpen(true);

            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'export.xlsx'; // Nome predefinito

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.split(';')[1]?.split('=')[1]?.replace(/\"/g, '');
                if (fileNameMatch) {
                    fileName = fileNameMatch;
                }
            }

            // Crea un URL per il blob e scarica il file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Rimuovi il link dopo il download
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            return { success: true, statistiche };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prodotti'] });
        },
    });

    return {
        ...mutation,
        isModalOpen,
        statistiche,
        closeModal: () => setIsModalOpen(false)
    };
} 