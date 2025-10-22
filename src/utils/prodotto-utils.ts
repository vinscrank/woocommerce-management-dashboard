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

/**
 * Sanitizza i dati di una variazione prima dell'invio all'API
 * @param variazioneData - Dati della variazione da sanitizzare
 * @returns Oggetto variazione sanitizzato
 */
export const sanitizeVariazioneData = (variazioneData: any): any => {
  const sanitized = keepOnlyWritableFields(variazioneData);

  // Converti i prezzi in stringhe se sono numeri
  if (typeof sanitized.regularPrice === 'number') {
    sanitized.regularPrice = sanitized.regularPrice.toFixed(2).toString();
  }
  if (typeof sanitized.salePrice === 'number') {
    sanitized.salePrice = sanitized.salePrice.toFixed(2).toString();
  }

  // NOTA: Mantieni le stringhe vuote per i prezzi - possono essere usate per rimuovere i prezzi
  // Rimuovi solo null/undefined
  if (sanitized.salePrice === null || sanitized.salePrice === undefined) {
    delete sanitized.salePrice;
  }
  if (sanitized.regularPrice === null || sanitized.regularPrice === undefined) {
    delete sanitized.regularPrice;
  }

  // Rimuovi campi null che potrebbero causare problemi
  if (sanitized.manageStock === null || sanitized.manageStock === undefined) {
    delete sanitized.manageStock;
  }

  // Assicurati che weight e shippingClass siano stringhe o rimossi se null/undefined
  // Mantieni le stringhe vuote
  if (sanitized.weight === null || sanitized.weight === undefined) {
    delete sanitized.weight;
  }
  if (sanitized.shippingClass === null || sanitized.shippingClass === undefined) {
    delete sanitized.shippingClass;
  }

  // Assicurati che stockQuantity sia un numero
  if (typeof sanitized.stockQuantity === 'string') {
    sanitized.stockQuantity = parseInt(sanitized.stockQuantity, 10);
  }

  return sanitized;
};

/**
 * Sanitizza e valida i dati del prodotto prima dell'invio all'API
 * @param prodottoData - Dati del prodotto da sanitizzare
 * @returns Oggetto prodotto sanitizzato
 */
export const sanitizeProdottoData = (prodottoData: any): any => {
  const sanitized = { ...prodottoData };

  // Assicurati che i campi critici siano presenti
  if (!sanitized.status || sanitized.status.trim() === '') {
    sanitized.status = 'draft'; // Default a bozza se non specificato
  }
  if (!sanitized.type || sanitized.type.trim() === '') {
    sanitized.type = 'simple'; // Default a semplice se non specificato
  }

  // Assicurati che brands sia nel formato corretto (array di oggetti con solo id)
  // NOTA: Mantieni l'array vuoto [] se presente per indicare la rimozione di tutti i brands
  if (Array.isArray(sanitized.brands)) {
    if (sanitized.brands.length > 0) {
      sanitized.brands = sanitized.brands.map((brand: any) => ({ id: brand.id }));
    }
    // Se brands.length === 0, l'array vuoto viene mantenuto così com'è
  }

  // Pulisci i metaData rimuovendo quelli con valori vuoti o solo spazi
  if (sanitized.metaData && Array.isArray(sanitized.metaData)) {
    sanitized.metaData = sanitized.metaData
      .filter((meta: any) => {
        // Mantieni solo i metaData con valori non vuoti (e non solo spazi)
        const value = typeof meta.value === 'string' ? meta.value.trim() : meta.value;
        return value !== null && value !== undefined && value !== '';
      })
      .map((meta: any) => ({
        ...meta,
        // Fai trim del valore se è stringa
        value: typeof meta.value === 'string' ? meta.value.trim() : meta.value,
      }));

    // Se non ci sono metaData validi, rimuovi completamente l'array
    if (sanitized.metaData.length === 0) {
      delete sanitized.metaData;
    }
  }

  return sanitized;
};

