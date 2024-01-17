// EditMovieForm.js
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function EditMovieForm({ movieId, user }) {
  const [movie, setMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log(movieId)
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/movie/${movieId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
            console.log("nie jest ok")
          const data = await response.json();
          errorMessage(data.error || 'Failed to fetch movie details');
        }

        const data = await response.json();
        console.log(data)
        setMovie(data);
        // setErrorMessage('');
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setErrorMessage(error.message || 'Internal Server Error');
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId, user.token]);

  const formik = useFormik({
    initialValues: {
      trailers: movie?.trailers || [],
      images: movie?.images || [],
      runtime: movie?.runtime || '',
      budget: movie?.budget || '',
      tagline: movie?.tagline || '',
      poster_path: movie?.poster_path || '',
      release_date: movie?.release_date || '',
      overview: movie?.overview || '',
      original_language: movie?.original_language || '',
      original_title: movie?.original_title || '',
      title: movie?.title || '',
      backdrop_path: movie?.backdrop_path || '',
      genres: movie?.genres || [],
      directors: movie?.directors || [],
      actors: movie?.actors || [],
    },
    validationSchema: Yup.object({
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`http://localhost:7000/api/admin/editMovie?id=${movieId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const data = await response.json();
          errorMessage(data.error || 'Failed to edit movie');
        }

        const data = await response.json();
      } catch (error) {
        console.error('Error editing movie:', error);
        setErrorMessage(error.message || 'Internal Server Error');
      }
    },
  });

  return (
    <div className='form'>
        {errorMessage && <p className='msg'>{errorMessage}</p>}
      {movie ? (
        <form onSubmit={formik.handleSubmit}>
          {errorMessage && <div>{errorMessage}</div>}
          <button type="submit" className='big-btn'>Save Changes</button>
        </form>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
};
