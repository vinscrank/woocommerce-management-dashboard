import { useQuery } from '@tanstack/react-query';
import { Coupon } from 'src/types/Coupon';
import { PaginatedResponse } from 'src/types/PaginetedResponse';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { useWorkspace } from 'src/context/WorkspaceContext';

const fetchCoupons = async (
  ecommerceId: number | null,
  page: number = 1,
  perPage: number = 25,
  search: string = ''
): Promise<PaginatedResponse<Coupon>> => {
  const params: any = {
    page,
    perPage,
    orderBy: 'id',
    order: 'desc',
  };

  if (search) {
    params.search = search;
  }

  const { data } = await axiosInstance.get(`${API_BASE_PREFIX}/${ecommerceId}/coupons`, {
    params,
  });

  const items = data.data.items || [];
  const totalItems = data.data.totalItems || items.length || 0;
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    items,
    currentPage: page,
    itemsInPage: items.length,
    totalItems,
    totalPages,
  };
};

// Hook paginato per le liste
export const useGetCoupons = (page: number = 1, perPage: number = 25, search: string = '') => {
  const { ecommerceId } = useWorkspace();
  return useQuery<PaginatedResponse<Coupon>, Error>({
    queryKey: ['coupons', page, perPage, search],
    queryFn: () => fetchCoupons(ecommerceId, page, perPage, search),
    enabled: !!ecommerceId,
  });
};

