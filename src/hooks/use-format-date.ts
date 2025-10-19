import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

/**
 * Formatta una data ISO in formato leggibile (solo data)
 * @param dateString - Data in formato ISO (es: "2025-10-17T09:02:49")
 * @returns Data formattata (es: "17/10/2025")
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';

  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: it });
  } catch (error) {
    console.error('Errore formattazione data:', error);
    return '-';
  }
};

/**
 * Formatta una data ISO in formato leggibile (data e ora)
 * @param dateString - Data in formato ISO (es: "2025-10-17T09:02:49")
 * @returns Data e ora formattate (es: "17/10/2025 alle 09:02")
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';

  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: it });
  } catch (error) {
    console.error('Errore formattazione data/ora:', error);
    return '-';
  }
};
