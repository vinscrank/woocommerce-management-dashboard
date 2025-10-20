import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ecommerce {
  id: number;
  name: string;
  url: string;
  type: string;
  woocommerceApiVersion: string;
  wordpressApiVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserEcommerce {
  id: number;
  user: User;
  ecommerce: Ecommerce;
}

interface UserEcommerceResponse {
  success: boolean;
  data: UserEcommerce[];
}

const fetchUserEcommerce = async (): Promise<UserEcommerce[]> => {
  const { data } = await axiosInstance.get<UserEcommerceResponse>(`/api/user-ecommerce`);
  return data.data || [];
};

export const useGetUserEcommerce = () => {
  return useQuery<UserEcommerce[], Error>({
    queryKey: ['user-ecommerce'],
    queryFn: fetchUserEcommerce,
  });
};

