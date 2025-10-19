import { useQuery } from '@tanstack/react-query';
import { Tag } from 'src/types/Tag';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

const fetchTags = async (): Promise<Tag[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/products/tags`);
    return data.data.items;
};

export const useGetTags = () => {
    return useQuery<Tag[], Error>({
        queryKey: ['tags'],
        queryFn: fetchTags,
    });
}; 