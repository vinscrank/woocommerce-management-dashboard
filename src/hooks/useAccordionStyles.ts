import { useCallback } from 'react';

/**
 * Hook per generare stili personalizzati per gli Accordion
 * Restituisce una funzione che accetta il titolo dell'accordion e ritorna gli stili appropriati
 */
export function useAccordionStyles() {
  return useCallback((title: string) => {
    // Colori diversi per ogni tipo di accordion
    const colorMap: Record<string, string> = {
      'Azioni prodotto': '#fff',
      'Categorie, Tag': '#fff',
      Prezzi: '#fff',
      Immagini: '#fff',
      Magazzino: '#fff',
      SEO: '#fff',
    };

    // Colori per i bordi
    const borderMap: Record<string, string> = {
      'Azioni prodotto': 'primary.dark',
      'Categorie, Tag': 'success.main',
      Prezzi: 'warning.main',
      Immagini: 'secondary.main',
      Magazzino: 'info.main',
      SEO: 'error.main',
    };

    return {
      borderRadius: 2,
      mb: 2,
      border: '1px solid',
      borderColor: 'divider',
      marginTop: '10px !important',
      padding: '10px !important',
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
      '&:before': {
        display: 'none', // Rimuovi il bordo default di MUI
      },
      '& .MuiAccordionSummary-root': {
        // backgroundColor: colorMap[title],
        borderRadius: '8px 8px 0 0',
        transition: 'all 0.2s ease-in-out',
        // padding: '12px 24px',
        margin: '0px !important',
        paddingY: '0px !important',
        paddingX: '10px !important',

        '& .MuiTypography-root': {
          fontWeight: 600,
          color: (theme: any) => theme.palette[borderMap[title]],
        },
      },
      '& .MuiAccordionDetails-root': {
        paddingY: '0px !important',
        paddingX: '10px !important',
        //  backgroundColor: (theme: any) => varAlpha(theme.palette[borderMap[title]], 0.08),
      },
    };
  }, []);
}

