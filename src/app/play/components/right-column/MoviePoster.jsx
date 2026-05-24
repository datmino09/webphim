import React from 'react'
import { getImageUrl } from '@/lib/imageBase'

export default function MoviePoster({ movie }) {
  return (
     <div className="bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={getImageUrl(movie.thumb_url)}
                alt={movie.name}
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getImageUrl(movie.thumb_url);
                }}
              />
            </div>
  )
}
