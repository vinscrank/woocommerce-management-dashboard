import { useMemo } from 'react';

export interface OrderStatusInfo {
  value: string;
  label: string;
  color: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export const useOrderStatus = () => {
  const statuses = useMemo<OrderStatusInfo[]>(
    () => [
      { value: 'pending', label: 'In attesa', color: 'warning' },
      { value: 'processing', label: 'In elaborazione', color: 'info' },
      { value: 'on-hold', label: 'In sospeso', color: 'warning' },
      { value: 'completed', label: 'Completato', color: 'success' },
      { value: 'cancelled', label: 'Cancellato', color: 'error' },
      { value: 'refunded', label: 'Rimborsato', color: 'error' },
      { value: 'failed', label: 'Fallito', color: 'error' },
      { value: 'trash', label: 'Cestinato', color: 'default' },
    ],
    []
  );

  const getStatusInfo = (status: string | undefined): OrderStatusInfo | undefined => {
    return statuses.find((s) => s.value === status);
  };

  return {
    statuses,
    getStatusInfo,
  };
};

