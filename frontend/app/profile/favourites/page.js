"use client";
import React, { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import MovieList from "@/components/MovieList";
import LoadingPage from "@/components/LoadingPage";

export default function FavPage() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const fetchList = async (list, userId) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${list}/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setMovies(data.movies);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (user) {
      fetchList("favourites", user.id);
    }
  }, []);

  return !isLoading ? (
    <section className="users-list-page">
      <h1 className="">Favourites</h1>
      {movies && <p>You have {movies.length} favourite movies</p>}
      {movies && <MovieList movies={movies} isPersonal={true} />}
    </section>
  ) : (
    <LoadingPage />
  );
}
