import React from 'react'
import MovieCard from './MovieCard'


export default function MovieList({movies}) {
  return (
    <div>
      {movies.map(movie => <MovieCard movie={movie} key={movie.id}/>)}
    </div>
    // <div>MovieList</div>
  )
}
