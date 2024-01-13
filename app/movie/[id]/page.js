'use client';
import React, { useState, useEffect } from 'react';

export default function MovieDetailsPage({ params }) {
  const { id } = params;
  const [movie, setMovie] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/movie/${id}`);

        if (response.status === 404) {
          setErrorMsg('Movie not found');
          return;
        }

        const data = await response.json();

        setMovie(data);
        setErrorMsg('');
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  return (
    <>
      {!errorMsg ? (
        <section className="">
          <div className="backdrop-container">
            <div className='backdrop-info'>
              <h1 className='title'>{movie.title} 
                {movie.release_date && (
                  <span className="text-slate-400 text-3xl font-normal"> ({movie.release_date.slice(0, 4)})</span>
                )}
              </h1>
              <p>{movie.release_date}</p>
              <p>DIRECTED BY {movie.directors && movie.directors.map((el, index) => (
                    <span key={index}>
                        {el.name}
                        {index < movie.directors.length - 1 && ', '}
                    </span>
                ))}</p>
            </div>
            <div className="backdrop-gradient"></div>
            <img src={movie.backdrop_path} alt="Backdrop" className="backdrop" />
          </div>
          <div className='movie-info-container'>
            <img src={movie.poster_path} alt="Poster" width={200} />
            <h2>{movie.tagline}</h2>
            <p>{movie.overview}</p>
          </div>
        </section>
      ) : <section>{errorMsg}</section>}
    </>
  );
}