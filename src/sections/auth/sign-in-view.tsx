import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { authService } from 'src/services/auth.service';
import { useAuth } from 'src/auth/AuthContext';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError('');

      try {
        const formData = new FormData(event.currentTarget);
        const credentials = {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        };

        await login(credentials);
        router.push('/');
      } catch (err: any) {
        console.log(err);
        console.error('Errore durante il login:', err);

        // Gestione errori più specifica
        if (err.message && err.message.includes('Token')) {
          setError('Errore dal server: token non valido ricevuto');
        } else if (err.response?.status === 401) {
          setError('Credenziali non valide');
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Errore durante il login. Riprova più tardi.');
        }
      } finally {
        setLoading(false);
      }
    },
    [router, login]
  );

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleSignIn}
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      <TextField
        fullWidth
        name="email"
        label="Email address"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        defaultValue="mario.rossi@live.it"
      />

      {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link> */}

      <TextField
        fullWidth
        name="password"
        label="Password"
        defaultValue="password"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2, alignSelf: 'flex-start' }}>
          {error}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        loading={loading}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Login</Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Don't have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography> */}
      </Box>

      {renderForm}

      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box> */}
    </>
  );
}
