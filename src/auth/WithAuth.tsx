import { useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useAuth } from './AuthContext';
import { Box, CircularProgress, LinearProgress } from '@mui/material';

const WithAuth = ({ children }: { children: React.ReactNode }) => {

    const router = useRouter();
    const { user, isInitialized } = useAuth();

    useEffect(() => {
        if (isInitialized && !user) {
            router.push('/login');
        }
    }, [user, isInitialized]);

    if (!isInitialized) {
        return <CircularProgress />;
    }

    return user ? children : null;
};
export default WithAuth;