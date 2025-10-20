import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { useRouter } from 'src/routes/hooks';
import { Prodotto } from 'src/types/Prodotto';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';


export function usePostProdotto() {
    const queryClient = useQueryClient();
    const { ecommerceId } = useWorkspace();
    const router = useRouter();

    return useMutation({
        mutationFn: async (variables: Prodotto) => {
            const { data: { data } } = await axiosInstance.post<{ data: Prodotto }>(API_BASE_PREFIX+ '/' + ecommerceId + '/products', variables);
            return data;
        },
        onSuccess: async (newProdotto, variables) => {
            queryClient.invalidateQueries({ queryKey: ['prodotti'] });
            queryClient.invalidateQueries({ queryKey: ['prodotto', newProdotto.id] });
            router.push(`/prodotti/${newProdotto.id}`);
            return newProdotto;

        },
        onError: async (error: any) => {


            return Object.values(error.response.data.errors).flat();
        }
    });
}


