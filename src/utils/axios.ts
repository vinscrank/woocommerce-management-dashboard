import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;




const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Verifichiamo che il token sia un JWT valido prima di aggiungerlo
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                config.headers['Authorization'] = `Bearer ${token}`;
            } else {
                console.warn('Token JWT non valido trovato nel localStorage, rimozione...');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance; 