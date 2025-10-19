import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';

export function useExportTags() {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get('/tag-essenziali-export', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'tags-export.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    });
} 