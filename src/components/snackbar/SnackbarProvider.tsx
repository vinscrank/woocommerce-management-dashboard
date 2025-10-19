import { createContext, useContext, useState, useMemo } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface SnackbarContextType {
    enqueueSnackbar: (message: string, options?: { variant?: AlertColor }) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

interface SnackbarMessage {
    message: string;
    variant?: AlertColor;
    key: number;
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [currentSnackbar, setCurrentSnackbar] = useState<SnackbarMessage | null>(null);
    const [snackPack, setSnackPack] = useState<SnackbarMessage[]>([]);

    const processQueue = () => {
        if (snackPack.length && !currentSnackbar) {
            const snackbar = snackPack[0];
            setSnackPack((prev) => prev.slice(1));
            setCurrentSnackbar(snackbar);
            setOpen(true);
        }
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setCurrentSnackbar(null);
    };

    const enqueueSnackbar = (message: string, options: { variant?: AlertColor } = {}) => {
        const key = new Date().getTime() + Math.random();
        setSnackPack((prev) => [...prev, { message, variant: options.variant, key }]);
    };

    useMemo(() => {
        processQueue();
    }, [snackPack, currentSnackbar, open]);

    const value = useMemo(
        () => ({
            enqueueSnackbar,
        }),
        []
    );

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <Snackbar
                key={currentSnackbar ? currentSnackbar.key : undefined}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                TransitionProps={{ onExited: handleExited }}
            >
                <Alert
                    onClose={handleClose}
                    severity={currentSnackbar?.variant || 'info'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {currentSnackbar?.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar deve essere usato all\'interno di SnackbarProvider');
    }
    return context;
};

export const showMessage = (message: string, variant: AlertColor = 'info') => {
    const context = useContext(SnackbarContext);
    if (!context) {
        console.error('showMessage deve essere chiamato all\'interno di SnackbarProvider');
        return;
    }
    context.enqueueSnackbar(message, { variant });
}; 