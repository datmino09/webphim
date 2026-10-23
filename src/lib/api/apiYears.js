import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { VSMOV_API_BASE } from './apiBase';

async function getYears() {
	try {
		const response = await axios.get(`${VSMOV_API_BASE}/nam`);
		return response.data;
	} catch (error) {
		console.error('getYears error:', error);
		throw error;
	}
}

export function useYears(options = {}) {
	return useQuery({
		queryKey: ['years'],
		queryFn: getYears,
		staleTime: 1000 * 60 * 60,
		...options,
	});
}

export default getYears;
