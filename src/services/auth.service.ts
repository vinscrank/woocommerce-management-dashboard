import axiosInstance from '../utils/axios';

interface LoginCredentials {
    email: string;
    password: string;
}

export const authService = {
    async login(credentials: LoginCredentials) {
        // Prima dobbiamo ottenere il CSRF token
        //await axiosInstance.get('/sanctum/csrf-cookie');

        // Poi facciamo la chiamata di login
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    },

    async logout() {
        const response = await axiosInstance.post('/logout');
        return response.data;
    }
}; 