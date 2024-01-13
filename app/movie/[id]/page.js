'use client';
import React, { useState, useEffect } from 'react';
import RateCard from '@/components/RateCard';
import { TbStar } from "react-icons/tb";

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
              <p className=''>DIRECTED BY {movie.directors && movie.directors.map((el, index) => (
                    <span className='font-bold' key={index}>
                        {el.name}
                        {index < movie.directors.length - 1 && ', '}
                    </span>
                ))}</p>
                <div className='backdrop-rating'>
                    <TbStar className='star'/>
                    { movie.rating_avg && <p className='rating-avg'>{movie.rating_avg.toFixed(2)}</p>}
                    { movie.rating_count && <p className='rating-count text-slate-400'>{movie.rating_count.low} ratings</p>}
                </div>
            </div>
            <div className="backdrop-gradient"></div>
            <img src={movie.backdrop_path} alt="Backdrop" className="backdrop" />
          </div>

          <div className='movie-container'>
            <div className='poster-container'>
                <img src={movie.poster_path} alt="Poster" className=''/>
            </div>
            <div className='info-container'>
                <p>{movie.runtime && <span>{movie.runtime.low} mins</span>}</p>
                <p>{movie.genres && movie.genres.map((el, index) => (
                    <span key={index}>
                        {el.name}
                        {index < movie.genres.length - 1 && ', '}
                    </span>
                ))}</p>
                <h2 className='text-slate-400 font-bold'>{movie.tagline}</h2>
                <p className=''>{movie.overview}</p>
                <p>{movie.release_date} | ({movie.original_language})</p> 
            </div>
            <RateCard movieId={ id }/>
          </div>
        </section>
      ) : <section>{errorMsg}</section>}
    </>
  );
}