import { useQuery } from '@tanstack/react-query';
import { Attributo } from 'src/types/Attributo';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

const fetchAttributo = async (id: number, ecommerceId: number | null): Promise<Attributo> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/attributes/${id}`);
    return data.data;
};

export const useGetAttributo = (id: number | null) => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Attributo, Error>({
        queryKey: ['attributo', id],
        queryFn: () => fetchAttributo(id as number, ecommerceId),
        enabled: !!id && !!ecommerceId,
    });
}; 