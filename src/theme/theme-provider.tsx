import type {} from '@mui/lab/themeAugmentation';
import type {} from '@mui/material/themeCssVarsAugmentation';

import { useMemo, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
} from '@mui/material/styles';

import { createTheme } from './create-theme';
import { useThemeCustomization } from 'src/context/ThemeCustomizationContext';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

function ThemeContent({ children }: Props) {
  const { customization } = useThemeCustomization();
  const { setMode } = useColorScheme();

  // Sincronizza il mode del tema con la personalizzazione
  useEffect(() => {
    if (setMode) {
      setMode(customization.mode);
    }
  }, [customization.mode, setMode]);

  return <>{children}</>;
}

export function ThemeProvider({ children }: Props) {
  const theme = useMemo(() => createTheme(), []);

  return (
    <CssVarsProvider theme={theme} defaultMode="light">
      <CssBaseline />
      <ThemeContent>{children}</ThemeContent>
    </CssVarsProvider>
  );
}
