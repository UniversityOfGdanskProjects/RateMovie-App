import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserContext } from "@/context/userContextProvider";

export default function AddTMDBMovieForm() {
  const { user } = useContext(UserContext);
  const [msg, setMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      movieId: "",
    },
    validationSchema: Yup.object({
      movieId: Yup.string().required("Movie ID is required"),
    }),
    onSubmit: async (values) => {
      setMsg("Adding...");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}admin/addMovieFromTMDB`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ movieId: values.movieId }),
          }
        );

        const data = await response.text(); // Użycie response.text() do debugowania odpowiedzi
        console.log("Response data:", data); // Logowanie odpowiedzi z serwera

        if (!response.ok) {
          setMsg(data);
          return;
        } else {
          const jsonData = JSON.parse(data); // Parsowanie JSON w przypadku powodzenia
          setMsg("Successfully added movie: " + jsonData.movie.title);
          formik.resetForm();
          return;
        }
      } catch (error) {
        setMsg(error.message || "Internal Server Error");
      }
    },
  });

  return (
    <>
      <form className="form" onSubmit={formik.handleSubmit}>
        <label>
          Movie ID from TMDB:
          <input
            type="text"
            name="movieId"
            value={formik.values.movieId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </label>
        {formik.touched.movieId && formik.errors.movieId && (
          <div>{formik.errors.movieId}</div>
        )}
        {msg && <div>{msg}</div>}
        <div className="buttons">
          <button type="submit" className="big-btn">
            Add Movie
          </button>
        </div>
      </form>
    </>
  );
}
