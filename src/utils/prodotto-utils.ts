/**
 * Campi read-only e problematici da rimuovere prima di fare un PUT/PATCH del prodotto
 */
export const PRODOTTO_READONLY_FIELDS = [
  'permalink',
  'link',
  'dateCreated',
  'dateCreatedGmt',
  'dateModified',
  'dateModifiedGmt',
  'createdAt',
  'createdAtGmt',
  'updatedAt',
  'updatedAtGmt',
  'onSale',
  'purchasable',
  'totalSales',
  'averageRating',
  'ratingCount',
  'relatedIds',
  'backordersAllowed',
  'backordered',
  'variations',
  'priceHtml',
  'dimensions', // Rimuovi dimensions con tutti i suoi sottocampi
  'metaData', // Non inviare metadata nelle PATCH
  'meta_data', // Variante snake_case
];

/**
 * Campi read-only e problematici da rimuovere prima di fare un PUT/PATCH delle variazioni
 */
export const VARIAZIONE_READONLY_FIELDS = [
  'permalink',
  'link',
  'dateCreated',
  'dateCreatedGmt',
  'dateModified',
  'dateModifiedGmt',
  'createdAt',
  'createdAtGmt',
  'updatedAt',
  'updatedAtGmt',
  'onSale',
  'purchasable',
  'backordersAllowed',
  'backordered',
  'priceHtml',
  'dimensions',
  'image', // L'immagine delle variazioni è readonly
  'downloadable',
  'virtual',
  'downloads',
  'downloadLimit',
  'downloadExpiry',
];

/**
 * Campi essenziali da mantenere per le variazioni
 */
export const VARIAZIONE_WRITABLE_FIELDS = [
  'id',
  'sku',
  'regularPrice',
  'salePrice',
  'stockQuantity',
  'stockStatus',
  'manageStock',
  'attributes',
  'shippingClass',
  'weight',
  'taxStatus',
  'taxClass',
  'menuOrder',
];

/**
 * Rimuove i campi read-only da un oggetto prodotto
 * @param prodottoData - Dati del prodotto da pulire
 * @returns Oggetto prodotto senza i campi read-only
 */
export const removeReadOnlyFields = (prodottoData: any): any => {
  const cleanedData = { ...prodottoData };

  PRODOTTO_READONLY_FIELDS.forEach((field) => {
    if (cleanedData.hasOwnProperty(field)) {
      delete cleanedData[field];
    }
  });

  return cleanedData;
};

/**
 * Rimuove i campi read-only da una variazione
 * @param variazioneData - Dati della variazione da pulire
 * @returns Oggetto variazione senza i campi read-only
 */
export const removeVariazioneReadOnlyFields = (variazioneData: any): any => {
  const cleanedData = { ...variazioneData };

  VARIAZIONE_READONLY_FIELDS.forEach((field) => {
    if (cleanedData.hasOwnProperty(field)) {
      delete cleanedData[field];
    }
  });

  return cleanedData;
};

/**
 * Mantiene solo i campi essenziali/scrivibili di una variazione
 * @param variazioneData - Dati della variazione
 * @returns Oggetto con solo i campi scrivibili
 */
export const keepOnlyWritableFields = (variazioneData: any): any => {
  const cleanedData: any = {};

  VARIAZIONE_WRITABLE_FIELDS.forEach((field) => {
    if (variazioneData.hasOwnProperty(field) && variazioneData[field] !== undefined) {
      cleanedData[field] = variazioneData[field];
    }
  });

  return cleanedData;
};

