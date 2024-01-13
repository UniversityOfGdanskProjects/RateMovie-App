import React from 'react'
import Image from 'next/image'
import Link from "next/link";

export default function MovieCard({movie}) {
  const url = movie.poster_path
  return (
    <Link href={`/movie/${movie.id}`}>
      <div>
        <img src={url} width={200}></img>
        <p>{movie.title}</p>
        <p>rating: {movie.rating_avg.toFixed(2)}</p>
      </div>
    </Link>
  )
}
