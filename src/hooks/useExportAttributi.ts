import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { downloadFile } from 'src/utils/downloadFile';


export const useExportAttributi = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get('/attributi-essenziali-export', {
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split(';')[1].split('=')[1].replace(/"/g, '')
                : 'attributi-export.xlsx';

            downloadFile(response.data, fileName);
            return response.data;
        },
    });
}; 