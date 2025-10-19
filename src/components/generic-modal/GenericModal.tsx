import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    IconButton,
    Box,
    SxProps
} from '@mui/material';


import { useForm } from 'react-hook-form';
import { Iconify } from '../iconify';
import { Theme } from '@mui/material/styles';

interface GenericModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    onConfirm?: (data: any) => Promise<void>;
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    isLoading?: boolean;
    sx?: React.CSSProperties | SxProps<Theme>;
}

export const GenericModal = ({
    open,
    maxWidth = 'md',
    onClose,
    title,
    description,
    confirmButtonText = 'Conferma',
    cancelButtonText = 'Annulla',
    onConfirm,
    children,
    disabled = false,
    isLoading = false,
    sx
}: GenericModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { handleSubmit, control, reset } = useForm();

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth sx={sx} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
                
                <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</DialogTitle>
                <IconButton aria-label="chiudi" onClick={handleClose} >
                    <Iconify icon="mdi:close" />
                </IconButton>
            </Box>
            <DialogContent >
                {description && <p>{description}</p>}
                {children}
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={handleClose} disabled={isSubmitting || disabled}>
                    {cancelButtonText}
                </Button> */}
                {/* <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : confirmButtonText}
                    </Button> */}
            </DialogActions>
        </Dialog>
    );
}; 