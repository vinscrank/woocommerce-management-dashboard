import { TableRow, TableCell, Paper, Typography } from '@mui/material';

interface TableNoDataProps {
    searchQuery?: string;
}

export function TableNoData({ searchQuery }: TableNoDataProps) {
    return (
        <TableRow>
            <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
                <Paper
                    sx={{
                        textAlign: 'center',
                        py: 3,
                    }}
                >
                    <Typography variant="h6" paragraph>
                        Non trovato
                    </Typography>

                    <Typography variant="body2">
                        Nessun risultato trovato per &nbsp;
                        <strong>&quot;{searchQuery}&quot;</strong>.
                        <br /> Prova a controllare eventuali errori di battitura o usa parole complete.
                    </Typography>
                </Paper>
            </TableCell>
        </TableRow>
    );
} 