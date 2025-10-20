import { useQuery } from '@tanstack/react-query';
import { Attributo } from 'src/types/Attributo';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

const fetchAttributi = async (): Promise<Attributo[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/products/attributes`);
    return data.data.items;
};

export const useGetAttributi = () => {
    return useQuery<Attributo[], Error>({
        queryKey: ['attributi'],
        queryFn: fetchAttributi,
    });
}; 