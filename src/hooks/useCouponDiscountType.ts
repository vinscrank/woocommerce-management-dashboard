import { useMemo } from 'react';

export interface DiscountTypeInfo {
  value: string;
  label: string;
  color: 'success' | 'info' | 'warning' | 'default';
}

export const useCouponDiscountType = () => {
  const types = useMemo<DiscountTypeInfo[]>(
    () => [
      { value: 'percent', label: 'Percentuale', color: 'success' },
      { value: 'fixed_cart', label: 'Importo Fisso (carrello)', color: 'info' },
      { value: 'fixed_product', label: 'Importo Fisso (prodotto)', color: 'info' },
    ],
    []
  );

  const getTypeInfo = (type: string | undefined): DiscountTypeInfo | undefined => {
    return types.find((t) => t.value === type);
  };

  return {
    types,
    getTypeInfo,
  };
};

