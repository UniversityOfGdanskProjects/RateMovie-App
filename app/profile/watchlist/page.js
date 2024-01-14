'use client'
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContextProvider';
import MovieList from '@/components/MovieList';

export default function WatchlistPage() {
  const { user } = useContext(UserContext);
  const [watchlistMovies, setWatchlistMovies] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async (userId) => {
      try {
        const response = await fetch(`http://localhost:7000/api/watchlist/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setWatchlistMovies(data.movies);
        } else {
          console.error('Failed to fetch data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    if (user) fetchWatchlist(user.id);
  }, [user.id]);

  return (
    <section className='users-list-page'>
      <h1>Watchlist</h1>
      {watchlistMovies.length !== 0 && <p>You have {watchlistMovies.length} movies in your watchlist</p>}
      {watchlistMovies && <MovieList movies={watchlistMovies} isPersonal={true} />}
    </section>
  );
}
