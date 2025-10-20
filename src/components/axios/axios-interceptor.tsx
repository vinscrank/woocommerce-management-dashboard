import { useEffect, useState } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { Iconify } from '../iconify';
import { useSnackbar } from 'src/context/SnackbarContext';
import axiosInstance from 'src/utils/axios';

const AxiosInterceptor = () => {
  const { showMessage, message, clearMessage } = useSnackbar();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => {
        if (
          (response.status === 200 || response.status === 204) &&
          (response.config.method === 'post' ||
            response.config.method === 'put' ||
            response.config.method === 'patch' ||
            response.config.method === 'delete')
        ) {
          

          const message =
            response.data?.message  ||
            'Operazione completata con successo';

          showMessage({
            text: message,
            type: 'success',
          });
        }
        return response;
      },
      (error) => {
        // Gestione JWT scaduto
        if (
          error.response?.status === 401 ||
          error.response?.data?.exception === 'ExpiredJwtException' ||
          error.response?.data?.errors?.exception === 'ExpiredJwtException'
        ) {
          showMessage({
            text: 'Sessione scaduta. Effettua nuovamente il login.',
            type: 'error',
          });

          // Rimuovi token e user
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');

          // Redirect al login
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);

          return Promise.reject(error);
        }

        if ([400, 404, 500, 422].includes(error.response?.status)) {
          const errorData = error.response?.data;
          let errorMessage = 'Errore sconosciuto';

          if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (errorData?.errors?.message) {
            errorMessage = errorData.errors.message;
          }
          // Gestione degli errori con struttura { general: [...] }
          else if (errorData?.general && Array.isArray(errorData.general)) {
            errorMessage = errorData.general[0]; // Prende il primo messaggio dell'array
          }
          // Gestione degli errori con struttura { errors: { campo1: [...], campo2: [...] } }
          else if (errorData?.errors && typeof errorData.errors === 'object') {
            const errorMessages: string[] = [];

            // Itera su tutti i campi di errore e raccoglie i messaggi
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg) => errorMessages.push(msg));
              }
            });

            errorMessage =
              errorMessages.length > 0 ? errorMessages.join('.<br/> ') : 'Errore generico';
          } else {
            errorMessage = errorData?.error || error.response.statusText;
          }

          showMessage({
            text: errorMessage,
            type: 'error',
          });
        } else {
          // Prova a estrarre il messaggio anche dagli errori non gestiti sopra
          let errorMessage = error.message;
          
          // Se error.message contiene un JSON, prova a parsarlo per estrarre il campo message
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (typeof error.message === 'string' && error.message.includes('{')) {
            try {
              // Estrai il JSON dalla stringa (se presente dopo "HTTP XXX - ")
              const jsonMatch = error.message.match(/HTTP \d+ - (.+)$/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[1]);
                if (parsed.message) {
                  errorMessage = parsed.message;
                }
              }
            } catch (e) {
              // Se il parsing fallisce, usa il messaggio originale
            }
          }
          
          showMessage({
            text: errorMessage,
            type: 'error',
          });
        }
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [showMessage]);

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={4000}
      onClose={clearMessage}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={message?.type}
        variant="filled"
        sx={{ width: '100%', color: '#fff' }}
        onClose={clearMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={clearMessage}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: message?.text || '' }} />
      </Alert>
    </Snackbar>
  );
};

export default AxiosInterceptor;
