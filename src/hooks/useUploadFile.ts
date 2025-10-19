import { useMutation, useQueryClient } from '@tanstack/react-query';
import { File as FileType } from 'src/types/File';
import axiosInstance from 'src/utils/axios';

export function useUploadFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axiosInstance.post<File>('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
} 