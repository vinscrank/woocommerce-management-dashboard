import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';


const fetchCategoria = async (id: number): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/products/categories/${id}`);
    return data.data;
};

export const useGetCategoria = (id: number) => {
    return useQuery<Categoria[], Error>({
        queryKey: ['categoria', id],
        queryFn: () => fetchCategoria(id),
        enabled: !!id,
    });
}; 