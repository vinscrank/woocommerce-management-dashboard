import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

export function usePutAttributoOpzione({ attributo_id }: { attributo_id: number }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (opzione: AttributoOpzione) => {
            const { data } = await axiosInstance.patch<AttributoOpzione>(
                `${API_BASE_PREFIX}/products/attributes/${attributo_id}/terms/${opzione.id}`,
                opzione
            );
            return data;
        },
        onSuccess: (updatedOpzione) => {
            queryClient.invalidateQueries({
                queryKey: ['attributoOpzioni', attributo_id]
            });

            queryClient.invalidateQueries({
                queryKey: ['attributo', attributo_id]
            });
        },
    });
} 