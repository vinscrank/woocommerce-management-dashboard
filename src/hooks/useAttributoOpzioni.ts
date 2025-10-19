// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { AttributoOpzione } from '../types/AttributoOpzione';
// import axiosInstance from 'src/utils/axios';
// import { API_BASE_PREFIX } from 'src/utils/const';

// export const useGetAttributoOpzioni = (attributoId: number) => {
//     return useQuery({
//         queryKey: ['attributoOpzioni', attributoId],
//         queryFn: async () => {
//             const { data } = await axiosInstance.get(API_BASE_PREFIX + '/products/attributes/' + attributoId + '/terms', {
//                 params: {
//                     attributo_id: attributoId
//                 }
//             });
//             return data.data.items as AttributoOpzione[];
//         },
//         enabled: !!attributoId
//     });
// };

// export const usePostAttributoOpzione = ({ attributo_id }: {  attributo_id: number }) => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (options: any) => {
//             const { attributo_id: _, ...rest } = options;
//             const payload = {
//                 name: rest.name,
//                 slug: rest.slug || rest.name.toLowerCase().replace(/\s+/g, '-'),
//                 description: rest.description || '',
//                 menuOrder: rest.menuOrder || 0,
//             };
//             const { data } = await axiosInstance.post(API_BASE_PREFIX + '/products/attributes/' + attributo_id + '/terms', payload);
//             return data;
//         },
//         onSuccess: (data, variables) => {
//             // Invalida la cache delle opzioni dell'attributo
//             queryClient.invalidateQueries({ queryKey: ['attributoOpzioni', attributo_id] });
//             // Invalida anche la cache del singolo attributo
//             queryClient.invalidateQueries({ queryKey: ['attributo', attributo_id] });
//         }
//     });
// };

// export const usePutAttributoOpzione = ({ attributo_id }: { attributo_id: number }) => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (opzione: AttributoOpzione) => {
//             const { data } = await axiosInstance.patch(`attributoOpzioni/${opzione.id}`, opzione);
//             return data;
//         },
//         onSuccess: (data, variables) => {
//             // Invalida la cache delle opzioni dell'attributo
//             queryClient.invalidateQueries({ queryKey: ['attributoOpzioni', attributo_id] });
//             // Invalida anche la cache del singolo attributo
//             queryClient.invalidateQueries({ queryKey: ['attributo', attributo_id] });
//         }
//     });
// };

// export const useDeleteAttributoOpzione = ( attributo_id: number ) => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async ({ id }: { id: number }) => {
//             await axiosInstance.delete(API_BASE_PREFIX + '/products/attributes/' + attributo_id + '/terms/' + id);
//             return id;
//         },
//         onSuccess: (data, variables) => {
//             queryClient.invalidateQueries({ queryKey: ['attributoOpzioni', attributo_id] });
//             queryClient.invalidateQueries({ queryKey: ['attributo', attributo_id] });
//         }
    
//     });
// };

// export const useUpdateAttributoOpzioneBatch = () => {
//     return useMutation({
//         mutationFn: async (data: any) => {
//             const { data: responseData } = await axiosInstance.post('/attributoOpzioni-batch-update', data);
//             return responseData.data;
//         },
//         onSuccess: () => {

//         },
//         onError: (error: any) => {

//             return Object.values(error.response.data.errors).flat();
//         }
//     });
// }; 