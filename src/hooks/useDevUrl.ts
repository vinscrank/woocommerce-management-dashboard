/**
 * Hook per convertire URL HTTPS in HTTP in development
 * Utile per ambienti locali senza certificati SSL
 */
export const useDevUrl = () => {
  const convertUrl = (url: string | undefined): string => {
    if (!url) return '';

    // In development, sostituisce https con http
    if (import.meta.env.DEV) {
      return url.replace(/^https:/, 'http:');
    }

    // In produzione, lascia l'URL originale
    return url;
  };

  return { convertUrl };
};

