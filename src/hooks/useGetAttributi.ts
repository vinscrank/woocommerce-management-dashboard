import { useQuery } from '@tanstack/react-query';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { Attributo } from 'src/types/Attributo';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

const fetchAttributi = async (ecommerceId: number | null): Promise<Attributo[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/attributes`);
    return data.data.items;
};

export const useGetAttributi = () => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Attributo[], Error>({
        queryKey: ['attributi'],
        queryFn: () => fetchAttributi(ecommerceId),
        enabled: !!ecommerceId,
    });
}; 