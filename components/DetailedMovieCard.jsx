import React from 'react'
import MovieCard from './MovieCard'
import { TbStar } from "react-icons/tb";


export default function DetailedMovieCard({movie, place}) {
  return (
    <li>
        <MovieCard movie={movie} isPersonal={false}/>
        <div>
            <div>
                <h1>{place && `${place}.`} {movie.title}</h1>
                <div className='rating-count'>
                    <TbStar className='star'/>
                    <div className='rating'>ratings: {movie.rating_count}</div>
                </div>
            </div>
            <p>{movie.genres.map((el, index) => (
                    <span key={index}>
                        {el.name}
                        {index < movie.genres.length - 1 && ', '}
                    </span>
                ))}</p>
            <p className='faded'>{movie.tagline}</p>
            <p>{movie.overview}</p>
            
        </div>
    </li>
  )
}
