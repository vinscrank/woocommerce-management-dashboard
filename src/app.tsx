import 'src/global.css';

import Fab from '@mui/material/Fab';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

import { SnackbarProvider } from './components/snackbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeCustomizationProvider } from 'src/context/ThemeCustomizationContext';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeCustomizationProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'it'}>
            <Router />
          </LocalizationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ThemeCustomizationProvider>
  );
}
