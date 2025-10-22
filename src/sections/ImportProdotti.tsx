import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    Alert,
    CircularProgress,
    TextField,
    TablePagination,
    Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'src/context/SnackbarContext';
import { InfoLabel } from 'src/components/InfoLabel';



interface ProdottoTest {
    sku: string;
    prezzo: string;
    prezzo_scontato: string;
    data_inizio_sconti: string;
    data_fine_sconti: string;
    nome_prodotto: string;
    descrizione_breve: string;
    descrizione_lunga: string;
    categorie: string;
    immagini: string;
    stato: string;
    stato_magazzino: string;
    classe_spedizione: string;
}

interface Import {
    id: number;
    created_at: string;
    righe: number;
    righe_importate: number;
    righe_fallite: number;
    prodotti_falliti: string;
}

interface ImportData {
    [key: string]: string | number;
}

export const ImportProdotti: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [importData, setImportData] = useState<ImportData>({});
    const [errors, setErrors] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchQuery, setSearchQuery] = useState('');
    const { showMessage } = useSnackbar();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const { data: imports = [], refetch: refetchImports } = useQuery({
        queryKey: ['imports'],
        queryFn: async () => {
            // const response = await axiosInstance.get('/imports');
            // return response.data.data;
        }
    });

    const prodottiTest: ProdottoTest[] = [{
        sku: '302-1345-24',
        prezzo: '90',
        prezzo_scontato: '60',
        data_inizio_sconti: '02/03/2024',
        data_fine_sconti: '12/03/2024',
        nome_prodotto: 'Piastra sospensione con cuscinetto',
        descrizione_breve: 'piatto, zincato, con cuscinetto 1',
        descrizione_lunga: 'Descrizione lunga..',
        categorie: '1,3,7',
        immagini: 'example.jpg,example-2,jpg',
        stato: 'pubblicato',
        stato_magazzino: '1',
        classe_spedizione: 'classe-1'
    }];

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true);
            setErrors([]);

            const file = event.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('prodotti_file', file);

            const headers = { 'Content-Type': 'multipart/form-data' };

            const response = await axiosInstance.post('/excel-prodotti-import', formData, { headers });
            setImportData(response.data);

            showMessage({ text: 'Importazione completata', type: 'success' });

            // Aggiorniamo la lista degli imports
            await refetchImports();

            // Reset del file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Mostra il dialog di completamento
            setDialogOpen(true);

        } catch (error) {
            showMessage({ text: 'Errore durante l\'importazione', type: 'error' });
            setErrors(['Errore durante l\'importazione']);
        } finally {
            setLoading(false);
        }
    };

    const filteredImports = imports
        .filter((item: Import) => {
            const searchStr = searchQuery.toLowerCase();
            return (
                item.id.toString().includes(searchStr) ||
                item.created_at.toLowerCase().includes(searchStr)
            );
        })
        .sort((a: Import, b: Import) => b.id - a.id);

    return (
        <Box id="prodotti-import-excel" p={2}>
            {loading && (
                <Box position="fixed" top={0} left={0} right={0} bottom={0}
                    display="flex" alignItems="center" justifyContent="center"
                    bgcolor="rgba(255,255,255,0.8)" zIndex={9999}>
                    <Card sx={{ p: 5 }}>
                        <Typography variant="h5">Importazione prodotti in corso</Typography>
                        <Typography>Potrebbe volerci un po di tempo .. Non chiudere o ricaricare la pagina</Typography>
                        <CircularProgress sx={{ mt: 2 }} />
                    </Card>
                </Box>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Importazione completata</DialogTitle>
                <DialogContent>
                    <Icon icon="mdi:check-circle" color="success" width="40" height="40" />
                    {Object.entries(importData).map(([key, value]) => (
                        <Typography key={key}>{key}: <strong>{value}</strong></Typography>
                    ))}
                    <Button component={Link} to="/prodotti"
                        variant="contained" sx={{ mt: 3 }}
                        startIcon={<Icon icon="mdi:package" />}>
                        Vai alla lista prodotti
                    </Button>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader title="Importatore XLSX prodotti" />
                <CardContent>
                    <Alert severity="success">
                        Struttura excel e nomi delle colonne <strong>(aggiornato al 3 marzo)</strong>
                    </Alert>

                    <Button startIcon={<Icon icon="mdi:download" />}
                        onClick={() => window.location.href = `${import.meta.env.VITE_GEST_URL}/import/example-excel/example.xlsx`}
                        variant="contained" color="info" sx={{ my: 3 }}>
                        Scarica Excel di esempio
                    </Button>

                    <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Lista delle colonne (clicca per copiare):
                        </Typography>
                        <ol style={{ paddingLeft: '20px' }}>
                            {[
                                'CODICE ARTICOLO',
                                'PREZZO',
                                'PREZZO SCONTATO',
                                'DATA INIZIO SCONTI',
                                'DATA FINE SCONTI',
                                'NOME PRODOTTO (H1)',
                                'DESCRIZIONE BREVE (laterale)',
                                'DESCRIZIONE LUNGA',
                                'ID-CAT (separatore: virgola)',
                                'IMMAGINI',
                                'Stato (pubblicato / bozza)',
                                'STATUS MAGAZZINO',
                                'CLASSE SPED'
                            ].map((header, index) => (
                                <li key={index} style={{ marginBottom: '8px' }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => navigator.clipboard.writeText(header)}
                                        endIcon={<Icon icon="mdi:content-copy" />}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {header}
                                    </Button>
                                </li>
                            ))}
                        </ol>
                    </Box>

                    <TableContainer component={Paper} sx={{ border: '3px solid red' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell size="small"><Typography variant="caption">CODICE ARTICOLO</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">PREZZO</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">PREZZO SCONTATO</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">DATA INIZIO SCONTI</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">DATA FINE SCONTI</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">NOME PRODOTTO (H1)</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">DESCRIZIONE BREVE (laterale)</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">DESCRIZIONE LUNGA</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">ID-CAT (separatore: virgola)</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">IMMAGINI</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">Stato (pubblicato / bozza)</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">STATUS MAGAZZINO</Typography></TableCell>
                                    <TableCell size="small"><Typography variant="caption">CLASSE SPED</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prodottiTest.map((row) => (
                                    <TableRow key={row.sku}>
                                        <TableCell>{row.sku}</TableCell>
                                        <TableCell>{row.prezzo}</TableCell>
                                        <TableCell>{row.prezzo_scontato}</TableCell>
                                        <TableCell>{row.data_inizio_sconti}</TableCell>
                                        <TableCell>{row.data_fine_sconti}</TableCell>
                                        <TableCell>{row.nome_prodotto}</TableCell>
                                        <TableCell>{row.descrizione_breve}</TableCell>
                                        <TableCell>{row.descrizione_lunga}</TableCell>
                                        <TableCell>{row.categorie}</TableCell>
                                        <TableCell>{row.immagini}</TableCell>
                                        <TableCell>{row.stato}</TableCell>
                                        <TableCell>{row.stato_magazzino}</TableCell>
                                        <TableCell>{row.classe_spedizione}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography><strong>Legenda Status Magazzino</strong></Typography>
                        1 = disponbile | 2 = ordini arretrati | 0 = esaurito
                    </Alert>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography><strong>Gestione Magazzino</strong></Typography>
                        Tutti i prodotti importati avranno la gestione magazzino impostata su OFF
                    </Alert>

                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography><strong>Informazioni Prodotti in Bozza</strong></Typography>
                        Per i prodotti in stato "bozza", lo slug del prodotto non verrà generato automaticamente
                    </Alert>

                    <Box component="form" onSubmit={(e: FormEvent) => e.preventDefault()}>
                        {errors.length > 0 && (
                            <Alert severity="error">
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </Alert>
                        )}

                        <Box sx={{ mt: 4 }}>
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<Icon icon="mdi:cloud-upload" />}
                            >
                                Carica file XLSX
                                <input
                                    type="file"
                                    hidden
                                    accept=".xlsx"
                                    onChange={handleFileUpload}
                                    ref={fileInputRef}
                                />
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
                <CardHeader title="Storico importazioni" />
                <CardContent>
                    <TextField
                        label="Cerca in tutti i campi"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <Icon icon="mdi:magnify" />
                        }}
                        sx={{ mb: 2 }}
                    />

                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Import ID</TableCell>
                                    <TableCell>Data import</TableCell>
                                    <TableCell>Righe totali</TableCell>
                                    <TableCell>Righe importate</TableCell>
                                    <TableCell>Righe Fallite</TableCell>
                                    <TableCell>Prodotti Falliti</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredImports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Nessun import trovato
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredImports
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row: Import) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.created_at}</TableCell>
                                                <TableCell>
                                                    <InfoLabel
                                                        title={row.righe.toString()}
                                                        color="info"
                                                        sx={{ textAlign: 'center', p: 0.5, width: '40px' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <InfoLabel
                                                        title={row.righe_importate.toString()}
                                                        color="success"
                                                        sx={{ textAlign: 'center', p: 0.5, width: '40px' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {row.righe_fallite > 0 ? (
                                                        <InfoLabel
                                                            title={row.righe_fallite.toString()}
                                                            color="error"
                                                            sx={{ textAlign: 'center', p: 0.5, width: '40px' }}
                                                        />
                                                    ) : (
                                                        <InfoLabel
                                                            title={row.righe_fallite.toString()}
                                                            color="info"
                                                            sx={{ textAlign: 'center', p: 0.5, width: '40px' }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>{row.prodotti_falliti}</TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filteredImports.length}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[10, 25, 50]}
                        labelDisplayedRows={({ from, to, count }) =>
                            `Mostra da ${from} a ${to} delle ${count} righe`
                        }
                        labelRowsPerPage="Righe per pagina:"
                    />
                </CardContent>
            </Card>
        </Box>
    );
}

