// ----------------------------------------------------------------------

import { Iconify } from 'src/components/iconify';
import { useGetUserEcommerce, type UserEcommerce } from 'src/hooks/useGetUserEcommerce';

// Colori per i diversi ecommerce
const colors = ['#1976d2', '#2e7d32', '#d32f2f', '#f57c00', '#7b1fa2', '#0097a7'];

// Hook per ottenere i workspace dall'API
export const useWorkspaces = () => {
  const { data: userEcommerce, isLoading, error } = useGetUserEcommerce();

  const workspaces = (userEcommerce || []).map((item: UserEcommerce, index: number) => ({
    id: `ecommerce-${item.ecommerce.id}`,
    name: item.ecommerce.name,
    logo: <Iconify icon="mdi:circle" color={colors[index % colors.length]} width={24} />,
    href: item.ecommerce.url || '#',
    plan: 'Vai',
  }));

  return { workspaces, isLoading, error };
};

// Workspace di default per fallback
export const _workspaces = [
  // {
  //   id: 'woocommerce-default',
  //   name: 'WooCommerce',
  //   logo: <Iconify icon="mdi:circle" color="#1976d2" width={24} />,
  //   href: '#',
  //   plan: 'Vai',
  // },
];
