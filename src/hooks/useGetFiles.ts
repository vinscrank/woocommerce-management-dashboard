import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { Media } from 'src/types/File';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';


interface PaginatedResponse {
    items: Media[];
    currentPage: number;
    itemsInPage: number;
    totalItems: number;
    totalPages: number;
}

const fetchFiles = async (ecommerceId: number | null, page: number = 1, perPage: number = 10, search?: string): Promise<PaginatedResponse> => {
    const { data } = await axiosInstance.get(API_BASE_PREFIX + '/' + ecommerceId + '/media', {
        params: {
            page,
            perPage,
            ...(search && { search }),
        },
    });

    
    return data.data;
};

export const useGetFiles = (page: number = 1, perPage: number = 10, search?: string) => {
    const { ecommerceId } = useWorkspace();
    return useQuery<PaginatedResponse, Error>({
        queryKey: ['files', page, perPage, search],
        queryFn: () => fetchFiles(ecommerceId, page, perPage, search),
        enabled: !!ecommerceId,
    });
}; 