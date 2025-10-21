import { StockStatus, StockStatusLabel } from 'src/types/ProdottoEnums';

export type StockStato = {
  name: string;
  value: string;
};

export const useGetStockStati = () => {
  const stockStati: StockStato[] = [
    { name: StockStatusLabel[StockStatus.IN_STOCK], value: StockStatus.IN_STOCK },
    { name: StockStatusLabel[StockStatus.OUT_OF_STOCK], value: StockStatus.OUT_OF_STOCK },
    { name: StockStatusLabel[StockStatus.ON_BACKORDER], value: StockStatus.ON_BACKORDER },
  ];

  return stockStati;
};

