import { useQuery } from '@tanstack/react-query';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

const fetchAttributoOpzioni = async (attributoId: number, ecommerceId: number | null): Promise<AttributoOpzione[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/attributes/${attributoId}/terms`);
    return data.data.items;
};

export const useGetAttributoOpzioni = (attributoId: number) => {
    const { ecommerceId } = useWorkspace();
    return useQuery<AttributoOpzione[], Error>({
        queryKey: ['attributoOpzioni', attributoId],
        queryFn: () => fetchAttributoOpzioni(attributoId, ecommerceId),
        enabled: !!attributoId,
    });
}; 