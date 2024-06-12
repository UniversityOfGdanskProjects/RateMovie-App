"use client";
import React, { useState, useEffect } from "react";
import RateCard from "@/components/RateCard";
import { TbStar } from "react-icons/tb";
import MovieDetails from "@/components/MovieDetails";
import MovieGallery from "@/components/MovieGallery";
import MovieTrailer from "@/components/MovieTrailer";
import LoadingPage from "@/components/LoadingPage";
import MovieComments from "@/components/MovieComments";

export default function MovieDetailsPage({ params }) {
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}movie/${id}`
        );

        if (response.status === 404) {
          setErrorMsg("Movie not found");
          return;
        }

        const data = await response.json();

        setMovie(data);
        setIsLoading(false);
        setErrorMsg("");
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, []);

  return (
    <>
      {!isLoading ? (
        <section className="">
          <div className="backdrop-container">
            <div className="backdrop-info">
              <h1 className="title">
                {movie.title}
                <span className="text-slate-400 text-3xl font-normal">
                  {" "}
                  ({movie.release_date.slice(0, 4)})
                </span>
              </h1>
              <p className="">
                DIRECTED BY{" "}
                {movie.directors.map((el, index) => (
                  <span className="font-bold" key={index}>
                    {el.name}
                    {index < movie.directors.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
            <div className="backdrop-rating">
              <TbStar className="star" />
              <p className="rating-avg">{movie.rating_avg?.toFixed(2)}</p>
              <p className="rating-count text-slate-400">
                {movie.rating_count} ratings
              </p>
            </div>
            <div className="backdrop-gradient"></div>
            <img
              src={movie.backdrop_path}
              alt="Backdrop"
              className="backdrop"
            />
          </div>

          <div className="movie-container">
            <div className="poster-container">
              <img src={movie.poster_path} alt="Poster" className="" />
            </div>
            <div className="info-container">
              <p>
                <span>{movie.runtime} mins</span>
              </p>
              <p>
                {movie.genres.map((el, index) => (
                  <span key={index}>
                    {el.name}
                    {index < movie.genres.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <h2 className="text-slate-400 font-bold">{movie.tagline}</h2>
              <p className="">{movie.overview}</p>
            </div>
            <RateCard movieId={id} movie={movie} />
          </div>
          <MovieDetails movie={movie} />
          <div className="movie-gallery-trailer">
            <MovieTrailer movie={movie} />
            <MovieGallery movie={movie} />
          </div>
          <MovieComments movieId={id} />
        </section>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}
