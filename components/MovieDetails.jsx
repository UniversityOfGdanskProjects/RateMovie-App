import React from 'react';
import Image from 'next/image';

export default function MovieDetails({ movie }) {
  return (
    <div className='movie-details'>
      <div>
        <h2>Details</h2>
        <div className='details'>
          <p>
            RELEASE DATE <span>{movie.release_date}</span>
          </p>
          <p>
            ORIGINAL TITLE <span>{movie.original_title}</span>
          </p>
          <p>
            ORIGINAL LANGUAGE <span>{movie.original_language}</span>
          </p>
          {movie.budget.low !== 0 && (
            <p>
              BUDGET <span>{movie.budget.low} $</span>
            </p>
          )}
        </div>
      </div>
      <div>
        <h2>Directors & Actors</h2>
        <div className='crew'>
          {movie.directors.map((director, index) => {
              return (
                <div key={index} className='person-card'>
                  <img src={`${director.profile_path}`} />
                  <div className='role-overlay'>
                    <p>Director</p>
                  </div>
                  <p>{director.name}</p>
                </div>
              );
            })}
          {movie.actors.map((actor, index) => {
              return (
                <div key={index} className='person-card'>
                  { 
                  actor.profile_path ? (
                    <img src={`${actor.profile_path}`} /> 
                  ) : (
                    <img src='/assets/images/actor.png'/>
                  )
                  }
                  <p>{actor.name}</p>
                  <div className='role-overlay'>
                    <p>{actor.character}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
