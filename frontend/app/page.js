"use client";

import Link from "next/link";
import MovieList from "@/components/MovieList";
import { UserContext } from "@/context/userContextProvider";
import { useState, useEffect, useContext } from "react";
import { config } from "dotenv";
config();

export default function App() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const userIdQuery = user ? `?userId=${user.id}` : "";
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}movies/popular${userIdQuery}`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setError("");
          setMovies(data);
        } else {
          setError("error fetching popular movies");
        }
      } catch (error) {
        setError(`error fetching popular movies: ${error}`);
      }
    };

    fetchPopularMovies();
  }, [user]);
  return (
    <section className="">
      <div className="backdrop-container mb-12">
        <div className="backdrop-info flex flex-col items-center">
          <h1 className="text-center text-4xl mb-4">
            Your movies, your ratings, your community. Immerse yourself in the
            world of cinema with us!
          </h1>
          {!user && (
            <Link href="/register" className="my-2">
              <button className="big-btn">GET STARTED - IT'S FREE</button>
            </Link>
          )}
        </div>
        <div className="backdrop-gradient"></div>
        <img
          src="https://image.tmdb.org/t/p/original/8QXGNP0Vb4nsYKub59XpAhiUSQN.jpg"
          alt="Backdrop"
          className="backdrop opacity-75"
        />
      </div>

      <MovieList movies={movies} isPersonal={false} />
    </section>
  );
}
