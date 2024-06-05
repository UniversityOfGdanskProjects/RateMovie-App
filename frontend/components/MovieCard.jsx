import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TbStar } from "react-icons/tb";

export default function MovieCard({ movie, isPersonal }) {
  const url = movie.poster_path;

  return (
    <div className="movie-card">
      <Link href={`/movie/${movie.id}`}>
        <div className="image-container">
          <img src={url} alt={movie.title} layout="fill" objectfit="cover" />
          <div className="overlay">
            <p className="title">{movie.title}</p>
            {!isPersonal && movie && movie.rating_avg && (
              <p className="rating">
                <TbStar className="star" />
                {movie.rating_avg.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
