"use client";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { UserContext } from "@/context/userContextProvider";
import LoadingPage from "@/components/LoadingPage";
import SearchForm from "@/components/SearchForm";
import DetailedMovieCard from "@/components/DetailedMovieCard";

export default function SearchPage() {
  const { user } = useContext(UserContext);

  const [searchQuery, setSearchQuery] = useState({
    title: "",
    name: "",
    genre: "",
    rating: "",
    year: "",
    sortBy: "",
    sortOrder: "",
  });
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedMovies, setDisplayedMovies] = useState(30);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}genres`
        );
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...searchQuery,
      });
      if (user) queryParams.set("userId", user.id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}movies/search?${queryParams}`
      );
      const data = await response.json();

      setMovies(data);
      setDisplayedMovies(10);
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const handleLoadMore = () => {
    setDisplayedMovies((prevDisplayedMovies) => prevDisplayedMovies + 10);
  };

  const displayedMoviesList = useMemo(
    () => movies.slice(0, displayedMovies),
    [movies, displayedMovies]
  );

  return (
    <section className="px-1 py-4">
      {genres && (
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          genres={genres}
          handleSearch={handleSearch}
        />
      )}
      {!isLoading && movies ? (
        <>
          <br></br>
          <ul className="detailed-movie-list">
            {displayedMoviesList.map((movie, index) => (
              <DetailedMovieCard key={index} movie={movie} place={null} />
            ))}
          </ul>
          {displayedMovies < movies.length && (
            <button className="big-btn m-auto mt-3" onClick={handleLoadMore}>
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
