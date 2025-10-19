import { useQuery } from '@tanstack/react-query';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

const fetchAttributoOpzioni = async (attributoId: number): Promise<AttributoOpzione[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/products/attributes/${attributoId}/terms`);
    return data.data.items;
};

export const useGetAttributoOpzioni = (attributoId: number) => {
    return useQuery<AttributoOpzione[], Error>({
        queryKey: ['attributoOpzioni', attributoId],
        queryFn: () => fetchAttributoOpzioni(attributoId),
        enabled: !!attributoId,
    });
}; 