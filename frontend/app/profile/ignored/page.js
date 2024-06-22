"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import MovieList from "@/components/MovieList";
import LoadingPage from "@/components/LoadingPage";

export default function IgnoredPage() {
  const { user } = useContext(UserContext);
  const [ignoredMovies, setIgnoredMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIgnoredList = async (userId) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}ignored/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIgnoredMovies(data.movies);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (user) {
      fetchIgnoredList(user.id);
    }
  }, []);

  return !isLoading ? (
    <section className="users-list-page">
      <h1>Ignored Movies</h1>
      {ignoredMovies.length !== 0 && (
        <p>You ignore {ignoredMovies.length} movies</p>
      )}
      {ignoredMovies && <MovieList movies={ignoredMovies} isPersonal={true} />}
    </section>
  ) : (
    <LoadingPage />
  );
}
