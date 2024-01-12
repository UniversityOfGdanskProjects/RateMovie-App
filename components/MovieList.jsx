import React from 'react'
import MovieCard from './MovieCard'


export default function MovieList({movies}) {
  return (
    <div>
      {movies.map(movie => <MovieCard movie={movie}/>)}
    </div>
    // <div>MovieList</div>
  )
}
