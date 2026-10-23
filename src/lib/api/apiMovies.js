import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { VSMOV_API_BASE } from './apiBase';

async function getMoviesByYear(year, page = 1) {
    const params = new URLSearchParams({
        limit: '20',
        page: String(page),
        type: 'series',
        status: 'completed',
    });

    try {
        const response = await axios.get(`${VSMOV_API_BASE}/nam/${year}?${params}`);
        return response.data;
    } catch (error) {
        console.error('getMoviesByYear error:', error);
        throw error;
    }
}

async function getMovies() {
	try {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/danh-sach/phim-moi-cap-nhat?page=1`);
		return response.data;
	} catch (error) {
		console.error('getMovies error:', error);
		throw error;
	}
}
export function useMovies(options = {}) {
    return useQuery({
        queryKey: ['movies'],
        queryFn: getMovies,
        staleTime: 1000 * 60 * 5,
        ...options,
    });
}

async function getMoviesRelease() {
    try {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/danh-sach/subteam`);
		return response.data;
	} catch (error) {
		console.error('getMovies error:', error);
		throw error;
	}
}
export function useMoviesRelease(options = {}) {
    return useQuery({
        queryKey: ['movies_release'],
        queryFn: getMoviesRelease,
        staleTime: 1000 * 60 * 5,
        ...options,
    });
}

async function getMoviesDetail(slug) {
    try {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/phim/${slug}`);
		return response.data;
	} catch (error) {
		console.error('getMovies error:', error);
		throw error;
	}
}
export function useMoviesDetail(slug, options = {}) {
    return useQuery({
        queryKey: ['movies_detail', slug],
        queryFn: () => getMoviesDetail(slug),
        staleTime: 1000 * 60 * 5,
        ...options,
    });
}

async function getMoviesByCategory(slug, page, country, year) {
    try {
        if (year && !country) {
            return getMoviesByYear(year, page);
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/the-loai/${slug}${page ? `?page=${page}` : '?page=1'}${country ? `&country=${country}` : ''}${year ? `&year=${year}` : ''}`);
        return response.data;
    } catch (error) {
        console.error('getMoviesByCategory error:', error);
        throw error;
    }
}

export function useMoviesByCategory(slug, page = undefined, country = undefined, year = undefined, options = {}) {
    return useQuery({
        queryKey: ['movies_by_category', slug, page, country, year],
        queryFn: () => getMoviesByCategory(slug, page, country, year),
        staleTime: 1000 * 60 * 5,
        ...options,
    });
}

async function getMoviesBySearch(keyword) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=20&page=1`);
        return response.data;
    } catch (error) {
        console.error('getMoviesBySearch error:', error);
        throw error;
    }
}
export function useMoviesBySearch(keyword, options = {}) {
    return useQuery({
        queryKey: ['movies_by_search', keyword],
        queryFn: () => getMoviesBySearch(keyword),
        ...options,
    });
}

async function getMoviesByList(slug, page, country, year) {
    try {
        if (year && !country) {
            return getMoviesByYear(year, page);
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/danh-sach/${slug}${page ? `?page=${page}` : '?page=1'}${country ? `&country=${country}` : ''}${year ? `&year=${year}` : ''}`);
        return response.data;
    } catch (error) {
        console.error('getMoviesByList error:', error);
        throw error;
    }
}

export function useMoviesByList(slug, page = undefined, country = undefined, year = undefined, options = {}) {
    return useQuery({
        queryKey: ['movies_by_list', slug, page, country, year],
        queryFn: () => getMoviesByList(slug, page, country, year),
        staleTime: 1000 * 60 * 5,
        ...options,
    });
}
