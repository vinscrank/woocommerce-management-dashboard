/**
 * Enum per gli stati del prodotto in WooCommerce
 * 
 * @see https://developer.wordpress.org/reference/functions/get_post_status/
 */
export enum ProdottoStatus {
  /** Prodotto pubblicato e visibile al pubblico */
  PUBLISH = 'publish',

  /** Bozza - non visibile al pubblico */
  DRAFT = 'draft',

  /** In attesa di revisione - richiede approvazione da ruoli superiori */
  PENDING = 'pending',

  /** Visibile solo agli utenti con permessi specifici */
  PRIVATE = 'private',

  /** Programmato per pubblicazione futura */
  FUTURE = 'future',

  /** Cestinato - può essere ripristinato o eliminato definitivamente */
  TRASH = 'trash',

  /** Bozza automatica creata dal sistema */
  AUTO_DRAFT = 'auto-draft',

  /** Stato ereditato dal post parent */
  INHERIT = 'inherit',
}

/**
 * Enum per i tipi di prodotto in WooCommerce
 */
export enum ProdottoType {
  /** Prodotto semplice */
  SIMPLE = 'simple',

  /** Prodotto variabile con variazioni */
  VARIABLE = 'variable',

  /** Prodotto raggruppato */
  GROUPED = 'grouped',

  /** Prodotto esterno/affiliato */
  EXTERNAL = 'external',
}

/**
 * Enum per lo stato dello stock in WooCommerce
 */
export enum StockStatus {
  /** Disponibile in magazzino */
  IN_STOCK = 'instock',

  /** Esaurito */
  OUT_OF_STOCK = 'outofstock',

  /** Permette ordini arretrati */
  ON_BACKORDER = 'onbackorder',
}

/**
 * Enum per la visibilità del catalogo in WooCommerce
 */
export enum CatalogVisibility {
  /** Visibile ovunque (catalogo e ricerca) */
  VISIBLE = 'visible',

  /** Visibile solo nel catalogo */
  CATALOG = 'catalog',

  /** Visibile solo nei risultati di ricerca */
  SEARCH = 'search',

  /** Nascosto (non visibile nel catalogo né nella ricerca) */
  HIDDEN = 'hidden',
}

/**
 * Utility per ottenere il label italiano dello stato del prodotto
 */
export const ProdottoStatusLabel: Record<ProdottoStatus, string> = {
  [ProdottoStatus.PUBLISH]: 'Pubblicato',
  [ProdottoStatus.DRAFT]: 'Bozza',
  [ProdottoStatus.PENDING]: 'In attesa di revisione',
  [ProdottoStatus.PRIVATE]: 'Privato',
  [ProdottoStatus.FUTURE]: 'Programmato',
  [ProdottoStatus.TRASH]: 'Cestinato',
  [ProdottoStatus.AUTO_DRAFT]: 'Bozza automatica',
  [ProdottoStatus.INHERIT]: 'Ereditato',
};

/**
 * Utility per ottenere il label italiano del tipo di prodotto
 */
export const ProdottoTypeLabel: Record<ProdottoType, string> = {
  [ProdottoType.SIMPLE]: 'Semplice',
  [ProdottoType.VARIABLE]: 'Variabile',
  [ProdottoType.GROUPED]: 'Raggruppato',
  [ProdottoType.EXTERNAL]: 'Esterno',
};

/**
 * Utility per ottenere il label italiano dello stato dello stock
 */
export const StockStatusLabel: Record<StockStatus, string> = {
  [StockStatus.IN_STOCK]: 'Disponibile',
  [StockStatus.OUT_OF_STOCK]: 'Esaurito',
  [StockStatus.ON_BACKORDER]: 'Ordini arretrati',
};

/**
 * Utility per ottenere il label italiano della visibilità del catalogo
 */
export const CatalogVisibilityLabel: Record<CatalogVisibility, string> = {
  [CatalogVisibility.VISIBLE]: 'Visibile ovunque',
  [CatalogVisibility.CATALOG]: 'Solo nel catalogo',
  [CatalogVisibility.SEARCH]: 'Solo nella ricerca',
  [CatalogVisibility.HIDDEN]: 'Nascosto',
};

/**
 * Utility per ottenere il colore associato allo stato del prodotto
 */
export const ProdottoStatusColor: Record<ProdottoStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  [ProdottoStatus.PUBLISH]: 'success',
  [ProdottoStatus.DRAFT]: 'warning',
  [ProdottoStatus.PENDING]: 'info',
  [ProdottoStatus.PRIVATE]: 'default',
  [ProdottoStatus.FUTURE]: 'info',
  [ProdottoStatus.TRASH]: 'error',
  [ProdottoStatus.AUTO_DRAFT]: 'default',
  [ProdottoStatus.INHERIT]: 'default',
};

