import {
  ProdottoStatus,
  ProdottoType,
  StockStatus,
  CatalogVisibility,
  ProdottoStatusLabel,
  ProdottoTypeLabel,
  StockStatusLabel,
  CatalogVisibilityLabel,
  ProdottoStatusColor,
} from 'src/types/ProdottoEnums';

interface StatusInfo {
  label: string;
  color: 'success' | 'warning' | 'error' | 'info' | 'default' | 'primary' | 'secondary';
  icon?: string;
}

/**
 * Hook per gestire in modo centralizzato tutti gli stati dei prodotti WooCommerce
 * 
 * @example
 * const { getStatusInfo, getStockInfo, getTypeInfo } = useProdottoStatus();
 * const statusInfo = getStatusInfo(prodotto.status);
 * 
 * <Label color={statusInfo.color}>
 *   {statusInfo.label}
 * </Label>
 */
export function useProdottoStatus() {
  /**
   * Ottiene informazioni sullo stato del prodotto (publish, draft, trash, etc.)
   */
  const getStatusInfo = (status: string | undefined): StatusInfo => {
    const statusEnum = status as ProdottoStatus;

    // Gestisce anche valori non presenti nell'enum
    if (!Object.values(ProdottoStatus).includes(statusEnum)) {
      return {
        label: status || 'Sconosciuto',
        color: 'default',
      };
    }

    return {
      label: ProdottoStatusLabel[statusEnum] || status || 'Sconosciuto',
      color: ProdottoStatusColor[statusEnum] || 'default',
    };
  };

  /**
   * Ottiene informazioni sullo stato dello stock (instock, outofstock, onbackorder)
   */
  const getStockInfo = (stockStatus: string | undefined | null): StatusInfo => {
    if (!stockStatus) {
      return {
        label: 'Non disponibile',
        color: 'error',
        icon: 'eva:alert-triangle-fill',
      };
    }

    switch (stockStatus) {
      case StockStatus.IN_STOCK:
        return {
          label: StockStatusLabel[StockStatus.IN_STOCK],
          color: 'success',
          icon: 'eva:checkmark-fill',
        };
      case StockStatus.OUT_OF_STOCK:
        return {
          label: StockStatusLabel[StockStatus.OUT_OF_STOCK],
          color: 'error',
          icon: 'eva:alert-triangle-fill',
        };
      case StockStatus.ON_BACKORDER:
        return {
          label: StockStatusLabel[StockStatus.ON_BACKORDER],
          color: 'warning',
          icon: 'eva:clock-outline',
        };
      default:
        return {
          label: stockStatus,
          color: 'default',
          icon: 'eva:question-mark-circle-outline',
        };
    }
  };

  /**
   * Ottiene informazioni sul tipo di prodotto (simple, variable, etc.)
   */
  const getTypeInfo = (type: string | undefined): StatusInfo => {
    const typeEnum = type as ProdottoType;

    if (!Object.values(ProdottoType).includes(typeEnum)) {
      return {
        label: type || 'Sconosciuto',
        color: 'default',
      };
    }

    // Colori personalizzati per ogni tipo
    const typeColors: Record<ProdottoType, StatusInfo['color']> = {
      [ProdottoType.SIMPLE]: 'secondary',
      [ProdottoType.VARIABLE]: 'info',
      [ProdottoType.GROUPED]: 'warning',
      [ProdottoType.EXTERNAL]: 'primary',
    };

    return {
      label: ProdottoTypeLabel[typeEnum] || type || 'Sconosciuto',
      color: typeColors[typeEnum] || 'default',
    };
  };

  /**
   * Ottiene informazioni sulla visibilità del catalogo
   */
  const getCatalogVisibilityInfo = (visibility: string | undefined): StatusInfo => {
    const visibilityEnum = visibility as CatalogVisibility;

    if (!Object.values(CatalogVisibility).includes(visibilityEnum)) {
      return {
        label: visibility || 'Sconosciuto',
        color: 'default',
      };
    }

    const visibilityColors: Record<CatalogVisibility, StatusInfo['color']> = {
      [CatalogVisibility.VISIBLE]: 'success',
      [CatalogVisibility.CATALOG]: 'info',
      [CatalogVisibility.SEARCH]: 'warning',
      [CatalogVisibility.HIDDEN]: 'error',
    };

    return {
      label: CatalogVisibilityLabel[visibilityEnum] || visibility || 'Sconosciuto',
      color: visibilityColors[visibilityEnum] || 'default',
    };
  };

  /**
   * Verifica se un prodotto è pubblicato
   */
  const isPublished = (status: string | undefined): boolean => {
    return status === ProdottoStatus.PUBLISH;
  };

  /**
   * Verifica se un prodotto è nel cestino
   */
  const isTrashed = (status: string | undefined): boolean => {
    return status === ProdottoStatus.TRASH;
  };

  /**
   * Verifica se un prodotto è in bozza
   */
  const isDraft = (status: string | undefined): boolean => {
    return status === ProdottoStatus.DRAFT;
  };

  /**
   * Verifica se un prodotto è disponibile
   */
  const isInStock = (stockStatus: string | undefined | null): boolean => {
    return stockStatus === StockStatus.IN_STOCK;
  };

  /**
   * Verifica se un prodotto è esaurito
   */
  const isOutOfStock = (stockStatus: string | undefined | null): boolean => {
    return stockStatus === StockStatus.OUT_OF_STOCK || !stockStatus;
  };

  return {
    // Funzioni per ottenere info formattate
    getStatusInfo,
    getStockInfo,
    getTypeInfo,
    getCatalogVisibilityInfo,

    // Funzioni helper per verifiche
    isPublished,
    isTrashed,
    isDraft,
    isInStock,
    isOutOfStock,

    // Esporta anche gli enum per comodità
    ProdottoStatus,
    ProdottoType,
    StockStatus,
    CatalogVisibility,
  };
}

