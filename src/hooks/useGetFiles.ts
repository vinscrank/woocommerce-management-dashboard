import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { File as FileType } from 'src/types/File';
const fetchFiles = async (): Promise<FileType[]> => {
    const { data } = await axiosInstance.get('files');
    return data;
};

export const useGetFiles = () => {
    return useQuery<FileType[], Error>({
        queryKey: ['files'],
        queryFn: fetchFiles,
    });
}; 