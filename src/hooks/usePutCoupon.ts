import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Coupon } from 'src/types/Coupon';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

export function usePutCoupon() {
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();

  return useMutation({
    mutationFn: async (data: Coupon) => {
      const { data: response } = await axiosInstance.patch<Coupon>(`${API_BASE_PREFIX}/${ecommerceId}/coupons/${data.id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

