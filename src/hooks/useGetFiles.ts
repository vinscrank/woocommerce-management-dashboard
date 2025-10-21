import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { Media } from 'src/types/File';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';
import { PaginatedResponse } from 'src/types/PaginetedResponse';

const fetchFiles = async (ecommerceId: number | null, page: number = 1, perPage: number = 10, search?: string): Promise<PaginatedResponse<Media>> => {
    // Trim della ricerca e verifica che non sia vuota
    const trimmedSearch = search?.trim();
    const searchParam = trimmedSearch && trimmedSearch.length > 0 ? trimmedSearch : undefined;

    const { data } = await axiosInstance.get(API_BASE_PREFIX + '/' + ecommerceId + '/media', {
        params: {
            page,
            perPage,
            ...(searchParam && { search: searchParam }),
        },
    });

    return data.data;
};

export const useGetFiles = (page: number = 1, perPage: number = 10, search?: string) => {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse<Media>, Error>({
        queryKey: ['files', ecommerceId, page, perPage, search],
        queryFn: () => fetchFiles(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
}; 