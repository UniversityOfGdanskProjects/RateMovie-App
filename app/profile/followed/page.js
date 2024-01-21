"use client";
import React, { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import MovieList from "@/components/MovieList";

export default function FollowedPage() {
  const { user } = useContext(UserContext);
  const [followedMovies, setFollowedMovies] = useState([]);

  useLayoutEffect(() => {
    const fetchFollowedList = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:7000/api/followed/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setFollowedMovies(data.movies);
        } else {
          console.error("Failed to fetch data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    if (user) fetchFollowedList(user.id);
  }, []);

  return (
    <section className="users-list-page">
      <h1>Followed Movies</h1>
      {followedMovies.length !== 0 && (
        <p>You are following {followedMovies.length} movies</p>
      )}
      {followedMovies && (
        <MovieList movies={followedMovies} isPersonal={true} />
      )}
    </section>
  );
}
