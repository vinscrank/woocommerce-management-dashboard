import { useQuery } from '@tanstack/react-query';
import { Categoria } from 'src/types/Categoria';
import axiosInstance from 'src/utils/axios';

const fetchCategorieConFiglie = async (): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get('/categorie-genitori-con-figlie');
    return data.data;
};

export const useGetCategorieConFiglie = () => {
    return useQuery<Categoria[], Error>({
        queryKey: ['categorieConFiglie'],
        queryFn: fetchCategorieConFiglie,
    });
}; 