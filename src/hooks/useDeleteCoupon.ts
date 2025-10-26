import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (couponId: number) => {
      const response = await axiosInstance.delete(`${API_BASE_PREFIX}/${ecommerceId}/coupons/${couponId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

