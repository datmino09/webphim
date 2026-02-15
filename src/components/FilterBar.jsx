"use client";
import React from 'react';
import { useCountries } from '@/lib/api/apiCountry';
import { useYears } from '@/lib/api/apiYears';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function FilterBar() {
  const { data: countriesData } = useCountries();
  const rawCountries = countriesData?.data?.items ?? [];
  const countries = Array.isArray(rawCountries)
    ? rawCountries
    : Array.isArray(rawCountries?.data)
    ? rawCountries.data
    : Array.isArray(rawCountries?.items)
    ? rawCountries.items
    : [];
    
  const { data: yearsData } = useYears();
  const rawYears = yearsData ?? [];
  const apiYears = Array.isArray(rawYears)
    ? rawYears
    : Array.isArray(rawYears?.data)
    ? rawYears.data
    : Array.isArray(rawYears?.items)
    ? rawYears.items
    : [];

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCountry = searchParams?.get('country') || '';
  const currentYear = searchParams?.get('year') || '';

  const years = apiYears.length ? apiYears : (() => {
    const arr = [];
    const now = new Date().getFullYear();
    for (let y = now; y >= 1950; y--) arr.push(y);
    return arr;
  })();

  function applyFilters({ country, year }) {
    const params = new URLSearchParams();
    if (country) params.set('country', country);
    if (year) params.set('year', year);
    const url = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  }

  const hasActiveFilters = currentCountry || currentYear;

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-2xl border border-gray-700/50">
      <div className="flex flex-wrap items-end gap-4">
        {/* Country Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quốc gia
          </label>
          <select
            value={currentCountry}
            onChange={(e) => applyFilters({ country: e.target.value || undefined, year: currentYear || undefined })}
            className="w-full bg-gray-950/50 text-white px-4 py-3 rounded-lg border border-gray-600 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                     transition-all duration-200 cursor-pointer hover:border-gray-500
                     backdrop-blur-sm"
          >
            <option value="">Tất cả quốc gia</option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Năm phát hành
          </label>
          <select
            value={currentYear}
            onChange={(e) => applyFilters({ country: currentCountry || undefined, year: e.target.value || undefined })}
            className="w-full bg-gray-950/50 text-white px-4 py-3 rounded-lg border border-gray-600 
                     focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none
                     transition-all duration-200 cursor-pointer hover:border-gray-500
                     backdrop-blur-sm"
          >
            <option value="">Tất cả năm</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Clear Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => applyFilters({})}
            disabled={!hasActiveFilters}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                     ${hasActiveFilters 
                       ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95' 
                       : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                     }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700/50 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Đang lọc:</span>
          {currentCountry && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
              {countries.find(c => c.slug === currentCountry)?.name || currentCountry}
              <button
                onClick={() => applyFilters({ year: currentYear || undefined })}
                className="hover:bg-blue-500/30 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {currentYear && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
              {currentYear}
              <button
                onClick={() => applyFilters({ country: currentCountry || undefined })}
                className="hover:bg-purple-500/30 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}