"use client";
import React, { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import MovieList from "@/components/MovieList";
import LoadingPage from "@/components/LoadingPage";

export default function ReviewedPage() {
  const { user } = useContext(UserContext);
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const fetchReviewedList = async (userId) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}reviewed/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setReviewedMovies(data.movies);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (user) {
      fetchReviewedList(user.id);
    }
  }, []);

  return !isLoading ? (
    <section className="users-list-page">
      <h1>Reviewed Movies</h1>
      {reviewedMovies.length !== 0 && (
        <p>You have reviewed {reviewedMovies.length} movies</p>
      )}
      {reviewedMovies && (
        <MovieList movies={reviewedMovies} isPersonal={true} />
      )}
    </section>
  ) : (
    <LoadingPage />
  );
}
