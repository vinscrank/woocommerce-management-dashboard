import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

interface DeleteAttributoOpzioneVariables {
    id: number;
    attributo_id: number;
}

export function useDeleteAttributoOpzione({ attributo_id }: { attributo_id: number }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, attributo_id }: DeleteAttributoOpzioneVariables) => {
            await axiosInstance.delete(API_BASE_PREFIX + '/products/attributes/' + attributo_id + '/terms/' + id);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['attributoOpzioni',attributo_id]
            });

            queryClient.invalidateQueries({
                queryKey: ['attributo', attributo_id]
            });
        },
    });
} 