'use client'
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/context/userContextProvider';
import MovieList from '@/components/MovieList';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LoadingPage from '@/components/LoadingPage';
import SearchForm from '@/components/SearchForm';

export default function SearchPage() {
  const { user } = useContext(UserContext);

  const [searchQuery, setSearchQuery] = useState({
    title: '',
    name: '',
    genre: '',
    rating: '',
    year: '',
    sortBy: '',
    sortOrder: '',
  });
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedMovies, setDisplayedMovies] = useState(30); // Liczba już wyświetlonych filmów

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/genres');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...searchQuery
      });
      if (user) queryParams.set("userId", user.id)

      const response = await fetch(`http://localhost:7000/api/movies/search?${queryParams}`);
      const data = await response.json();

      setMovies(data);
      setDisplayedMovies(30);
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const handleLoadMore = () => {
    setDisplayedMovies((prevDisplayedMovies) => prevDisplayedMovies + 30);
  };

  const displayedMoviesList = movies.slice(0, displayedMovies);

  return (
    <section className='px-3 pb-3'>
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
          <MovieList movies={displayedMoviesList} />
          {displayedMovies < movies.length && (
            <button className="big-btn m-auto mt-3" onClick={handleLoadMore}>Load More</button>
          )}
        </>
      ) : (
        <LoadingPage />
      )}
    </section>
  );
}
