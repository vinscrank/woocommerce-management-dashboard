import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';


const fetchCategoria = async (id: number, ecommerceId: number | null): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/products/categories/${id}`);
    const categoria = data.data;
    return Array.isArray(categoria) ? categoria : [categoria];
};

export const useGetCategoria = (id: number) => {
    const { ecommerceId } = useWorkspace();

    return useQuery<Categoria[], Error>({
        queryKey: ['categoria', id, ecommerceId],
        queryFn: () => fetchCategoria(id, ecommerceId),
        enabled: !!id && !!ecommerceId,
    });
}; 