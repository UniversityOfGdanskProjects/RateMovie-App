import React from 'react'
import Image from 'next/image'

export default function MovieCard({movie}) {
  const url = movie.poster_path
  return (
    <div>
      <img src={url} width={200}></img>
      <p>{movie.title}</p>
      <p>rating: {movie.rating_avg.toFixed(2)}</p>
    </div>
  )
}
