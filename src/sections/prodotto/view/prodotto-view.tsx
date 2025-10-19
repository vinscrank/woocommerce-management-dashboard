import { useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress, Alert, Button } from '@mui/material';
import { ProdottoForm } from 'src/sections/prodotto/prodotto-form';
import { Iconify } from 'src/components/iconify';
import { Prodotto } from 'src/types/Prodotto';
import { useGetProdotto } from 'src/hooks/useGetProdotto';

export function ProdottoView({ id }: { id: string }) {
    const navigate = useNavigate();
    const { data: prodotto, isLoading, refetch } = useGetProdotto(id);

    const handleSync = () => {
        refetch();
    };

    const handleSubmit = (data: any) => {
        refetch();
    };

    if (isLoading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!prodotto && !isLoading) {
        return (
            <Container>
                <Box mt={5}>
                    <Alert severity="error">
                        Prodotto non trovato o errore durante il caricamento
                    </Alert>
                    <Box mt={3} display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:arrow-back-fill" />}
                            onClick={() => navigate('/prodotti')}
                        >
                            Torna alla lista prodotti
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <>

            <Container maxWidth="xl">

                <ProdottoForm
                    prodottoId={prodotto?.id?.toString() || ''}
                    prodotto={prodotto as Prodotto}
                    onSubmit={handleSubmit}
                    onSync={handleSync}

                />
            </Container>
        </>
    );
} 