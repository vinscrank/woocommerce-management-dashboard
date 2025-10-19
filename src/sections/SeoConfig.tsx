import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    Alert,
    CircularProgress,
    Dialog,
    DialogContent
} from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'src/context/SnackbarContext';



const SeoConfig: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isButtonDisabled] = useState<boolean>(true); // Gestito dall'admin

    const { showMessage } = useSnackbar();
    const runConfigSEO = async (): Promise<void> => {
        if (window.confirm(
            'Lanciando di nuovo la configurazione, verranno ignorate possibili modifiche manuali ai title e description dei prodotti. ' +
            'Verranno impostate nuovamente le configurazione di default'
        )) {
            try {
                setLoading(true);
                await axiosInstance.get('/seo-config-run');

                showMessage({ text: 'Configurazione Terminata con successo', type: 'success' });

                alert('Configurazione Terminata con successo');
            } catch (error) {
                showMessage({ text: 'Errore Configurazione SEO. Riprova', type: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box className="seo" sx={{ position: 'relative', py: 3 }}>
                {/* Loading Dialog */}
                <Dialog open={loading} fullWidth>
                    <DialogContent>
                        <Box sx={{ p: 3, textAlign: 'left' }}>
                            <Typography variant="h5" gutterBottom>
                                Loading
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Potrebbe volerci un po' di tempo .. Non chiudere o ricaricare la pagina
                            </Typography>
                            <CircularProgress size={30} />
                        </Box>
                    </DialogContent>
                </Dialog>

                {/* Contenuto principale */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Configurazione SEO Prodotti
                    </Typography>



                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1">
                            - meta title prodotto = nome prodotto
                        </Typography>
                        <Typography variant="body1">
                            - meta description prodotto = nome prodotto + <strong>
                                Spedito in 24h. Consegna gratuita su confezioni multiple. Acquista ora!
                            </strong>
                        </Typography>
                    </Box>

                    <Alert severity="success" sx={{ mb: 3 }}>
                        <strong>
                            Lanciando di nuovo la configurazione, verranno ignorate possibili modifiche
                            manuali ai title e description dei prodotti.<br />
                            Verrà impostata nuovamente la configurazione di default.
                        </strong>
                    </Alert>

                    <Button
                        variant="contained"
                        onClick={runConfigSEO}
                        disabled={isButtonDisabled}
                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                        Lancia nuova configurazione ( contatta admin per procedere )
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default SeoConfig; 