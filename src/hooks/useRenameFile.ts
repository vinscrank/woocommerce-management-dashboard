import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useRenameFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ oldName, newName }: { oldName: string; newName: string }) => {
            const response = await axios.post(`${import.meta.env.VITE_GEST_URL}/files/rename`, {
                oldName,
                newName,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
} 