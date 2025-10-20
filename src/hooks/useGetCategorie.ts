import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';


const fetchCategories = async (): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/products/categories`);
    return data.data.items;
};

export const useGetCategories = () => {
    return useQuery<Categoria[], Error>({
        queryKey: ['categorie'],
        queryFn: fetchCategories,
    });
}; 