import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';

export const useDeleteTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tagId: number) => {
            const response = await axiosInstance.delete(`/tags/${tagId}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalida la query dei tags per forzare un refresh
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
}; 