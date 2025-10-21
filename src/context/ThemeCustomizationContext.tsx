import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Colori predefiniti disponibili
export const PRESET_COLORS = {
  blue: { name: 'Blu', main: '#1877F2', light: '#73BAFB', dark: '#0C44AE' },
  purple: { name: 'Viola', main: '#8E33FF', light: '#C684FF', dark: '#5119B7' },
  cyan: { name: 'Ciano', main: '#00B8D9', light: '#61F3F3', dark: '#006C9C' },
  green: { name: 'Verde', main: '#22C55E', light: '#77ED8B', dark: '#118D57' },
  orange: { name: 'Arancione', main: '#FF9800', light: '#FFB74D', dark: '#F57C00' },
  red: { name: 'Rosso', main: '#FF5630', light: '#FFAC82', dark: '#B71D18' },
  pink: { name: 'Rosa', main: '#E91E63', light: '#F06292', dark: '#C2185B' },
  indigo: { name: 'Indaco', main: '#3F51B5', light: '#7986CB', dark: '#303F9F' },
};

export interface ThemeCustomization {
  mode: 'light' | 'dark';
  primaryColor: keyof typeof PRESET_COLORS;
  secondaryColor: keyof typeof PRESET_COLORS;
  borderRadius: number;
  compactMode: boolean;
}

const DEFAULT_CUSTOMIZATION: ThemeCustomization = {
  mode: 'light',
  primaryColor: 'blue',
  secondaryColor: 'purple',
  borderRadius: 8,
  compactMode: false,
};

interface ThemeCustomizationContextType {
  customization: ThemeCustomization;
  updateCustomization: (updates: Partial<ThemeCustomization>) => void;
  resetCustomization: () => void;
}

const ThemeCustomizationContext = createContext<ThemeCustomizationContextType | undefined>(
  undefined
);

export function ThemeCustomizationProvider({ children }: { children: ReactNode }) {
  const [customization, setCustomization] = useState<ThemeCustomization>(() => {
    // Carica le impostazioni salvate da localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeCustomization');
      if (saved) {
        try {
          return { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(saved) };
        } catch (error) {
          console.error('Errore nel caricamento delle impostazioni del tema:', error);
        }
      }
    }
    return DEFAULT_CUSTOMIZATION;
  });

  // Salva le modifiche in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeCustomization', JSON.stringify(customization));

      // Applica le CSS custom properties per le personalizzazioni
      const root = document.documentElement;

      // Applica il colore primario
      const primaryColorData = PRESET_COLORS[customization.primaryColor];
      root.style.setProperty('--custom-primary-main', primaryColorData.main);
      root.style.setProperty('--custom-primary-light', primaryColorData.light);
      root.style.setProperty('--custom-primary-dark', primaryColorData.dark);

      // Applica il colore secondario
      const secondaryColorData = PRESET_COLORS[customization.secondaryColor];
      root.style.setProperty('--custom-secondary-main', secondaryColorData.main);
      root.style.setProperty('--custom-secondary-light', secondaryColorData.light);
      root.style.setProperty('--custom-secondary-dark', secondaryColorData.dark);

      // Applica border radius
      root.style.setProperty('--custom-border-radius', `${customization.borderRadius}px`);

      // Applica modalità compatta
      if (customization.compactMode) {
        document.body.classList.add('compact-mode');
      } else {
        document.body.classList.remove('compact-mode');
      }
    }
  }, [customization]);

  const updateCustomization = (updates: Partial<ThemeCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...updates }));
  };

  const resetCustomization = () => {
    setCustomization(DEFAULT_CUSTOMIZATION);
  };

  return (
    <ThemeCustomizationContext.Provider
      value={{ customization, updateCustomization, resetCustomization }}
    >
      {children}
    </ThemeCustomizationContext.Provider>
  );
}

export function useThemeCustomization() {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error(
      "useThemeCustomization deve essere usato all'interno di ThemeCustomizationProvider"
    );
  }
  return context;
}
