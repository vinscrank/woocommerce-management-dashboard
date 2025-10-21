import { useQuery } from '@tanstack/react-query';
import { Brand } from 'src/types/Brand';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

const fetchBrands = async (ecommerceId: number | null): Promise<Brand[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/brands`);
    return data.data.items;
};

export const useGetBrands = () => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Brand[], Error>({
        queryKey: ['brands'],
        queryFn: () => fetchBrands(ecommerceId),
        enabled: !!ecommerceId,
    });
}; 