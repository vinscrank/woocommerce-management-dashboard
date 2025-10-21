import { useCallback } from 'react';

/**
 * Hook per pulire i campi vuoti da un oggetto in modo ricorsivo
 * Utile per preparare i dati prima di inviarli alle API che non accettano stringhe vuote
 * 
 * @returns Funzione per pulire i campi vuoti
 */
export function useCleanEmptyFields() {
  return useCallback((obj: any): any => {
    const cleaned: any = {};

    Object.keys(obj).forEach((key) => {
      let value = obj[key];

      // Se è una stringa, fai trim
      if (typeof value === 'string') {
        value = value.trim();
      }

      // Salta i valori null, undefined o stringhe vuote (anche dopo trim)
      // WooCommerce non accetta stringhe vuote, preferisce l'assenza del campo
      if (value === null || value === undefined || value === '') {
        return;
      }

      // Se è un array vuoto, salta
      if (Array.isArray(value) && value.length === 0) {
        return;
      }

      // Se è un oggetto (come dimensions), puliscilo ricorsivamente
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const cleanedNested = cleanEmptyFields(value);
        // Aggiungi solo se l'oggetto pulito non è vuoto
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
        return;
      }

      // Mantieni il valore se non è vuoto
      cleaned[key] = value;
    });

    return cleaned;
  }, []);

  // Funzione interna ricorsiva
  function cleanEmptyFields(obj: any): any {
    const cleaned: any = {};

    Object.keys(obj).forEach((key) => {
      let value = obj[key];

      if (typeof value === 'string') {
        value = value.trim();
      }

      if (value === null || value === undefined || value === '') {
        return;
      }

      if (Array.isArray(value) && value.length === 0) {
        return;
      }

      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const cleanedNested = cleanEmptyFields(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
        return;
      }

      cleaned[key] = value;
    });

    return cleaned;
  }
}

