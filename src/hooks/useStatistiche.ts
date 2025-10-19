import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from 'src/utils/axios';

interface Statistica {
   p_n: number;
   a_n: number;
   c_n: number;
   t_n: number;
   
}

export function useStatistiche() {
    const fetchStatistiche = async (): Promise<Statistica> => {
        const response = await axiosInstance.get('/statistiche');
        return response.data;
    };

    return useQuery({
        queryKey: ['statistiche'],
        queryFn: fetchStatistiche,
        staleTime: 5 * 60 * 1000, // 5 minuti prima che i dati siano considerati obsoleti
        refetchOnWindowFocus: false, // Non aggiornare quando la finestra torna in focus
    });
} 