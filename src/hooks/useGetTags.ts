import { useQuery } from '@tanstack/react-query';
import { Tag } from 'src/types/Tag';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

const fetchTags = async (ecommerceId: number | null): Promise<Tag[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/tags`);
    return data.data.items;
};

export const useGetTags = () => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Tag[], Error>({
        queryKey: ['tags'],
        queryFn: () => fetchTags(ecommerceId),
        enabled: !!ecommerceId,
    });
}; 