import { useQuery } from '@tanstack/react-query';
import { Variazione } from 'src/types/Variazione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';



const fetchVariazioni = async (prodotto_id: string, ecommerceId: number): Promise<Variazione[]> => {
    const response = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/${prodotto_id}/variations`, {
    });

    return response.data.data.items as Variazione[] || [];
};

export function useGetVariazioni(prodotto_id: string) {
    const { ecommerceId } = useWorkspace();
    return useQuery({
        queryKey: ['variazioni', prodotto_id.toString()],
        queryFn: () => fetchVariazioni(prodotto_id, ecommerceId as number),
        enabled: !!ecommerceId && !!prodotto_id,
    });
} 