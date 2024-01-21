import React from "react";
import MovieCard from "./MovieCard";

export default function MovieList({ movies, isPersonal }) {
  return (
    <div className="movie-list">
      {movies &&
        movies.map((movie) => (
          <MovieCard isPersonal={isPersonal} movie={movie} key={movie.id} />
        ))}
    </div>
  );
}
