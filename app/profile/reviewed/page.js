'use client'
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContextProvider';
import MovieList from '@/components/MovieList';

export default function ReviewedPage() {
  const { user } = useContext(UserContext);
  const [reviewedMovies, setReviewedMovies] = useState([]);

  useEffect(() => {
    const fetchReviewedList = async (userId) => {
      try {
        const response = await fetch(`http://localhost:7000/api/reviewed/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setReviewedMovies(data.movies);
        } else {
          console.error('Failed to fetch data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    if (user) fetchReviewedList(user.id);
  }, []);

  return (
    <section className='users-list-page'>
      <h1>Reviewed Movies</h1>
      {reviewedMovies.length !== 0 && <p>You have reviewed {reviewedMovies.length} movies</p>}
      {reviewedMovies && <MovieList movies={reviewedMovies} isPersonal={true} />}
    </section>
  );
}