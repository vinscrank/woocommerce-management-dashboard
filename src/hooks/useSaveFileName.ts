import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';

export function useSaveFileName() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ filename, newFilename }: { filename: string; newFilename: string }) => {
            if (!newFilename) {
                throw new Error('Inserisci nuovo nome file');
            }

            const response = await axiosInstance.post('/file/save', {
                filename,
                new_filename: newFilename
            });
            return response.data;
        },
        onSuccess: () => {
            
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
        onError: () => {
           
        }
    });
} 