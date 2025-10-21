import { Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Iconify } from './iconify';

export function BackToDashboardButton() {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/') {
        return null;
    }

    return (
        <Button
            variant="text"
            color="primary"
            onClick={() => navigate('/')}
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            sx={{ml: {xs: 0}}}
        >
            Torna alla Dashboard
        </Button>
    );
} 