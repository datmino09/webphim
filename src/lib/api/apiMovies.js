import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { VSMOV_API_BASE } from './apiBase';

function normalizeCollectionResponse(payload) {
    if (!payload || typeof payload !== 'object') {
        return payload;
    }

    // Support both the current API shape ({ items, pagination }) and
    // the legacy shape ({ data: { items, params } }).
    if (payload.data?.items) {
        return payload;
    }

    const imageBase = typeof payload.pathImage === 'string' ? payload.pathImage : '';
    const items = Array.isArray(payload.items)
        ? payload.items.map((item) => {
            if (
                !imageBase ||
                typeof item?.thumb_url !== 'string' ||
                /^https?:\/\//i.test(item.thumb_url)
            ) {
                return item;
            }

            return {
                ...item,
                thumb_url: `${imageBase.replace(/\/?$/, '/')}${item.thumb_url.replace(/^\/+/, '')}`,
            };
        })
        : payload.items;

    return {
        ...payload,
        data: {
            ...payload,
            items,
            params: {
                ...payload.params,
                pagination: payload.params?.pagination || payload.pagination,
            },
        },
    };
}

async function getMoviesByYear(year, page = 1) {
    const params = new URLSearchParams({
        limit: '20',
        page: String(page),
        type: 'series',
        status: 'completed',
    });

    try {
        const response = await axios.get(`${VSMOV_API_BASE}/nam/${year}?${params}`);
        return normalizeCollectionResponse(response.data);
    } catch (error) {
        console.error('getMoviesByYear error:', error);
        throw error;
    }
}

async function getMovies() {
	try {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/danh-sach/phim-moi-cap-nhat?page=1`);
		return normalizeCollectionResponse(response.data);
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
        const params = new URLSearchParams({
            slug: 'subteam',
            page: '1',
            limit: '24',
        });
		const response = await axios.get(`${VSMOV_API_BASE}/danh-sach/subteam?${params}`);
		return normalizeCollectionResponse(response.data);
	} catch (error) {
		console.error('getMoviesRelease error:', error);
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
        const payload = response.data;

        // The detail API returns movie and episodes at the top level,
        // while the page consumes the shared { data: { item } } shape.
        if (payload?.movie) {
            return {
                ...payload,
                data: {
                    ...payload.movie,
                    item: {
                        ...payload.movie,
                        episodes: payload.episodes || [],
                    },
                },
            };
        }

		return payload;
	} catch (error) {
		console.error('getMoviesDetail error:', error);
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
        const params = new URLSearchParams({
            page: String(page || 1),
            limit: '24',
        });
        if (country) params.set('country', String(country));
        if (year) params.set('year', String(year));

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_OPHIM_API_BASE}/the-loai/${encodeURIComponent(slug)}?${params}`,
        );
        return normalizeCollectionResponse(response.data);
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
        return normalizeCollectionResponse(response.data);
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

async function getMoviesByList(slug, page, country, year, category) {
    try {
        const params = new URLSearchParams({
            slug: String(slug),
            page: String(page || 1),
            limit: '24',
        });
        if (country) params.set('country', String(country));
        if (year) params.set('year', String(year));
        if (category) params.set('category', String(category));

        const response = await axios.get(`${VSMOV_API_BASE}/danh-sach/subteam?${params}`);
        return normalizeCollectionResponse(response.data);
    } catch (error) {
        console.error('getMoviesByList error:', error);
        throw error;
    }
}

export function useMoviesByList(slug, page = undefined, country = undefined, year = undefined, category = undefined, options = {}) {
    return useQuery({
        queryKey: ['movies_by_list', slug, page, country, year, category],
        queryFn: () => getMoviesByList(slug, page, country, year, category),
        staleTime: 1000 * 60 * 5,
        ...options,
    });
}
