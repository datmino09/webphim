 'use client';
import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMoviesByCategory } from '@/lib/api/apiMovies';
import MovieCard from '@/components/MovieCard';
import { Clock } from 'lucide-react';
import Pagination from '@/components/Pagination';
import FilterBar from '@/components/FilterBar';

export default function CategoryPage({ params }) {
    const { slug } = use(params);
  const searchParams = useSearchParams();
  const pageFromUrl = searchParams?.get('page');
  const page = pageFromUrl ? Number(pageFromUrl) : undefined;
  const country = searchParams?.get('country') || undefined;
  const year = searchParams?.get('year') || undefined;

  const { data, isLoading, isError, error } = useMoviesByCategory(slug, page, country, year);
  const movies = data?.data?.items || [];
  console.log("Movies in category:", movies);
  const title = data?.data?.seoOnPage?.titleHead || '';
  const pagination = data?.data?.params?.pagination;
  const urlParams = new URLSearchParams();
  if (country) urlParams.set('country', country);
  if (year) urlParams.set('year', year);
  const basePath = `/category/${slug}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 mb-12">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="px-6 py-2 bg-gray-800 rounded-full animate-pulse w-24 h-8" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto px-4 mb-12">
        <div className="text-red-400">Lỗi tải thể loại: {error?.message}</div>
      </section>
    );
  }


  return (
    <div>
      <main className="min-h-screen pt-36 pb-16">
        <section className="container mx-auto px-4">
          <FilterBar />
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-7 h-7 text-red-600" />
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
          <Pagination pagination={pagination} basePath={basePath} />
        </section>
      </main>
    </div>
  )
}
