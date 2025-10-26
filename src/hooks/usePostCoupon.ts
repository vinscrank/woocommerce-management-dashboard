import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Coupon } from 'src/types/Coupon';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePostCoupon() {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (variables: any) => {
      const { data } = await axiosInstance.post<Coupon>(`${API_BASE_PREFIX}/${ecommerceId}/coupons`, variables);
      return data;
    },
    onSuccess: (newCoupon) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

