import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

async function getYears() {
	try {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/v1/api/nam-phat-hanh`);
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

