import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './app';
import { AuthProvider } from './auth/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import AxiosInterceptor from './components/axios/axios-interceptor';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <SnackbarProvider>
          <QueryClientProvider client={queryClient}>
            <WorkspaceProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              <BrowserRouter>
                <Suspense>
                  <AxiosInterceptor />
                  <App />
                </Suspense>
              </BrowserRouter>
            </WorkspaceProvider>
          </QueryClientProvider>
        </SnackbarProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
