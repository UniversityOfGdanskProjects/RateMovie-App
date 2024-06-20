"use client";
import React, { useContext, useState, useMemo, useEffect } from "react";
// import { RankingContext } from "@/context/rankingsProvider";
import LoadingPage from "@/components/LoadingPage";
import DetailedMovieCard from "@/components/DetailedMovieCard";

export default function MoviesRankingPage() {
  //   const { rankedMovies } = useContext(RankingContext);
  const [rankedMovies, setRankedMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState(10);

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    const fetchMovies = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}ranking/movies`
      );
      const data = await response.json();
      if (response.ok) setRankedMovies(data);
    };
    fetchMovies();
  }, []);

  const visibleMoviesSlice = useMemo(
    () => rankedMovies.slice(0, visibleMovies),
    [rankedMovies, visibleMovies]
  );

  const handleLoadMore = () => {
    setVisibleMovies((prevVisibleMovies) => prevVisibleMovies + 10);
  };

  return (
    <section>
      {rankedMovies.length > 0 ? (
        <>
          <h1 className="msg text-3xl">Most Popular Movies</h1>
          <ul className="detailed-movie-list">
            {visibleMoviesSlice.map((movie, index) => (
              <DetailedMovieCard key={index} movie={movie} place={index + 1} />
            ))}
          </ul>
          {visibleMovies < rankedMovies.length && (
            <button className="big-btn m-auto my-3" onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </>
      ) : (
        <LoadingPage />
      )}
    </section>
  );
}
