"use client";
import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { UserContext } from "@/context/userContextProvider";
import MovieList from "@/components/MovieList";
import LoadingPage from "@/components/LoadingPage";

export default function WatchlistPage() {
  const { user } = useContext(UserContext);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const fetchWatchlist = async (userId) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}watchlist/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setWatchlistMovies(data.movies);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (user) {
      fetchWatchlist(user.id);
    }
  }, []);

  return !isLoading ? (
    <section className="users-list-page">
      <h1>Watchlist</h1>
      {watchlistMovies.length !== 0 && (
        <p>You have {watchlistMovies.length} movies in your watchlist</p>
      )}
      {watchlistMovies && (
        <MovieList movies={watchlistMovies} isPersonal={true} />
      )}
    </section>
  ) : (
    <LoadingPage />
  );
}
