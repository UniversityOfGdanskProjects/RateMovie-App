"use client";
import React, { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditMovieForm from "@/components/EditMovieForm";
import { UserContext } from "@/context/userContextProvider";

export default function EditDeleteMovie() {
  const { user } = useContext(UserContext);
  const [movieId, setMovieId] = useState(null);
  const [movie, setMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const searchFormik = useFormik({
    initialValues: {
      searchMovieId: "",
    },
    validationSchema: Yup.object({
      searchMovieId: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setMovieId(values.searchMovieId);
    },
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}movie/${movieId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(data.error || "Failed to fetch movie details");
          setMovie(null);
        } else {
          setErrorMessage("");
          setMovie(data);
        }
      } catch (error) {
        setErrorMessage(error.message || "Internal Server Error");
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  return (
    <section className="pb-3">
      <h1 className="msg">Edit Movie</h1>
      {errorMessage && <p className="msg">{errorMessage}</p>}

      <form className="form" onSubmit={searchFormik.handleSubmit}>
        <label htmlFor="searchMovieId">Search Movie by ID:</label>
        <input
          type="text"
          id="searchMovieId"
          name="searchMovieId"
          onChange={searchFormik.handleChange}
          onBlur={searchFormik.handleBlur}
          value={searchFormik.values.searchMovieId}
        />
        <div className="buttons">
          <button className="small-btn" type="submit">
            Search
          </button>
        </div>
        {searchFormik.touched.searchMovieId &&
          searchFormik.errors.searchMovieId && (
            <div>{searchFormik.errors.searchMovieId}</div>
          )}
      </form>
      {movie !== null && <EditMovieForm movie={movie} setMovie={setMovie} />}
    </section>
  );
}
