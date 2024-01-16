import React, { useState } from 'react';
import YouTube from 'react-youtube';

export default function MovieTrailer({ movie }) {
  const [trailerKey, setTrailerKey] = useState('');

  const playTrailer = (key) => {
    setTrailerKey(key);
  };

  const closeTrailer = () => {
    setTrailerKey('');
  };

  return (
    <div className='movie-trailer'>
      <h2 className='pb-4'>Trailers</h2>
      {trailerKey && (
        <div className="overlay">
          <div className="video-container">
            <button className="big-btn absolute right-2 top-2" onClick={closeTrailer}>
                Close
            </button>
            <YouTube videoId={trailerKey} opts={{ width: '800', height: '500' }} />
          </div>
        </div>
      )}

      <div className="trailer-list">
        { Object.keys(movie.trailers).map((key) => (
            <button key={key} className="big-btn" onClick={() => playTrailer(movie.trailers[key])}>
              Play Trailer {parseInt(key) + 1}
            </button>
          ))}
      </div>
    </div>
  );
}
