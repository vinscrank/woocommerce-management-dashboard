import { useCallback } from 'react';

// Campi che devono mantenere gli array vuoti per indicare la rimozione di elementi
const KEEP_EMPTY_ARRAYS = ['categories', 'tags', 'brands', 'images'];

/**
 * Funzione ricorsiva per pulire i campi vuoti
 */
function cleanEmptyFieldsRecursive(obj: any, keepEmptyArrays: string[] = []): any {
  const cleaned: any = {};

  Object.keys(obj).forEach((key) => {
    let value = obj[key];

    if (typeof value === 'string') {
      value = value.trim();
    }

    if (value === null || value === undefined || value === '') {
      return;
    }

    // Se è un array vuoto, mantienilo solo per i campi specifici
    if (Array.isArray(value) && value.length === 0) {
      if (keepEmptyArrays.includes(key)) {
        cleaned[key] = value;
      }
      return;
    }

    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      const cleanedNested = cleanEmptyFieldsRecursive(value, keepEmptyArrays);
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key] = cleanedNested;
      }
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

/**
 * Hook per pulire i campi vuoti da un oggetto in modo ricorsivo
 * Utile per preparare i dati prima di inviarli alle API che non accettano stringhe vuote
 * NOTA: Gli array vuoti per categories, tags, brands e images vengono mantenuti
 * per indicare all'API di rimuovere tutti gli elementi.
 * 
 * @returns Funzione per pulire i campi vuoti
 */
export function useCleanEmptyFields() {
  return useCallback((obj: any): any => {
    return cleanEmptyFieldsRecursive(obj, KEEP_EMPTY_ARRAYS);
  }, []);
}

