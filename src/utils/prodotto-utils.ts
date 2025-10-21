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

