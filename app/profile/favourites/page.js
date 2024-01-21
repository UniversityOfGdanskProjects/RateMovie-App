"use client";
import React, { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import MovieList from "@/components/MovieList";

export default function favPage() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);

  useLayoutEffect(() => {
    if (user) {
      const fetchList = async (list, userId) => {
        try {
          const response = await fetch(
            `http://localhost:7000/api/${list}/${userId}`
          );
          if (response.ok) {
            const data = await response.json();
            setMovies(data.movies);
          } else {
            return;
          }
        } catch (error) {
          return;
        }
      };

      fetchList("favourites", user.id);
    }
  }, []);
  return (
    <section className="users-list-page">
      <h1 className="">Favourites</h1>
      {movies && <p>You have {movies.length} favourtie movies</p>}
      {movies && <MovieList movies={movies} isPersonal={true} />}
    </section>
  );
}
