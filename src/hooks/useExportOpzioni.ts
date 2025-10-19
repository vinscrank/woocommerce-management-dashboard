import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';
import { downloadFile } from 'src/utils/downloadFile';
export const useExportOpzioni = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get('/opzioni-essenziali-export', {
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split(';')[1].split('=')[1].replace(/"/g, '')
                : 'opzioni-export.xlsx';

            downloadFile(response.data, fileName);
            return response.data;
        },
    });
}; 