import { useQuery } from '@tanstack/react-query';
import { Attributo } from 'src/types/Attributo';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

const fetchAttributo = async (id: number): Promise<Attributo> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/products/attributes/${id}`);
    return data.data;
};

export const useGetAttributo = (id: number | null) => {
    return useQuery<Attributo, Error>({
        queryKey: ['attributo', id],
        queryFn: () => fetchAttributo(id as number),
        enabled: !!id, // La query viene eseguita solo se l'id è presente
    });
}; 