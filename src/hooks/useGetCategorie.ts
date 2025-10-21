import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';


const fetchCategories = async (ecommerceId: number | null): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/categories?perPage=100`);
    return data.data.items;
};

export const useGetCategories = () => {
    const { ecommerceId } = useWorkspace();
    return useQuery<Categoria[], Error>({
        queryKey: ['categorie'],
        queryFn: () => fetchCategories(ecommerceId),
        enabled: !!ecommerceId,
    });
}; 