import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
async function getCountries() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/v1/api/quoc-gia`);
        return response.data;
    } catch (error) {
        console.error('getCountries error:', error);
        throw error;
    }
}

export function useCountries(options = {}) {
    return useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
        staleTime: 1000 * 60 * 60,
        ...options,
    });
}