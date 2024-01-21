"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import MovieList from "@/components/MovieList";

export default function IgnoredPage() {
  const { user } = useContext(UserContext);
  const [ignoredMovies, setIgnoredMovies] = useState([]);

  useEffect(() => {
    const fetchIgnoredList = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:7000/api/ignored/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setIgnoredMovies(data.movies);
        } else {
          console.error("Failed to fetch data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (user) fetchIgnoredList(user.id);
  }, []);

  return (
    <section className="users-list-page">
      <h1>Ignored Movies</h1>
      {ignoredMovies.length !== 0 && (
        <p>You ignore {ignoredMovies.length} movies</p>
      )}
      {ignoredMovies && <MovieList movies={ignoredMovies} isPersonal={true} />}
    </section>
  );
}
