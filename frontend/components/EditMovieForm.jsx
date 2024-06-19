import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserContext } from "@/context/userContextProvider";
import {
  useRenderDoubleFieldArray,
  useRenderFieldArray,
} from "@/hooks/useRenderFieldArray";

const EditMovieForm = ({ movie, setMovie }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(movie.title);
  });

  const handleDeleteMovie = async () => {
    try {
      setErrorMessage("Deleting movie...");
      const deleteResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}admin/deleteMovie`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ movieId: String(movie.id) }),
        }
      );

      if (!deleteResponse.ok) {
        const data = await deleteResponse.json();
        setErrorMessage(data.error || "Failed to delete movie");
        return;
      }

      setErrorMessage("Movie deleted successfully");
      setMovie(null);
    } catch (error) {
      console.error("Error deleting movie:", error);
      setErrorMessage(error.message || "Internal Server Error");
    }
  };

  return (
    <div>
      {errorMessage && <p className="msg">{errorMessage}</p>}
      {movie ? (
        <>
          <h2 className="msg">Movie ID: {movie.id}</h2>
          <Formik
            initialValues={{
              runtime: movie.runtime || 0,
              budget: movie.budget || 0,
              tagline: movie.tagline || "",
              poster_path: movie.poster_path || "",
              release_date: movie.release_date || "",
              overview: movie.overview || "",
              original_language: movie.original_language || "",
              original_title: movie.original_title || "",
              title: movie.title || "",
              backdrop_path: movie.backdrop_path || "",
              images: movie.images || [],
              trailers: movie.trailers || [],
              genres: movie.genres.map((el) => el.name) || [],
              actors:
                movie.actors.map((el) => ({
                  id: el.id,
                  character: el.character,
                })) || [],
              directors: movie.directors.map((el) => el.id) || [],
            }}
            validationSchema={Yup.object({
              runtime: Yup.number()
                .typeError("Runtime must be a number")
                .positive("Runtime must be a positive number")
                .required("required"),
              budget: Yup.number()
                .typeError("Budget must be a number")
                .positive("Budget must be a positive number")
                .required("required"),
              tagline: Yup.string()
                .required("required")
                .matches(
                  /^\S(?:.*\S)?$/,
                  "Tagline cannot start or end with whitespaces"
                ),
              poster_path: Yup.string()
                .url("Invalid URL format for Poster Path")
                .required("required"),
              release_date: Yup.string()
                .matches(
                  /^\d{4}-\d{2}-\d{2}$/,
                  "Invalid date format. Use yyyy-mm-dd"
                )
                .required("Date is required"),
              overview: Yup.string()
                .required("required")
                .matches(
                  /^\S(?:.*\S)?$/,
                  "Tcannot start or end with whitespaces"
                ),
              original_language: Yup.string()
                .required("required")
                .matches(
                  /^\S(?:.*\S)?$/,
                  "cannot start or end with whitespaces"
                ),
              original_title: Yup.string()
                .required("required")
                .matches(
                  /^\S(?:.*\S)?$/,
                  "cannot start or end with whitespaces"
                ),
              title: Yup.string()
                .required("required")
                .matches(
                  /^\S(?:.*\S)?$/,
                  "cannot start or end with whitespaces"
                ),
              backdrop_path: Yup.string()
                .url("Invalid URL format for Backdrop Path")
                .required("required"),
              images: Yup.array()
                .of(
                  Yup.string()
                    .required("required")
                    .url("Invalid URL format for Images")
                )
                .min(1, "At least one image is required"),
              trailers: Yup.array()
                .of(
                  Yup.string()
                    .required("required")
                    .matches(
                      /^\S(?:.*\S)?$/,
                      "cannot start or end with whitespaces"
                    )
                )
                .min(1, "At least one director is required"),
              genres: Yup.array()
                .of(
                  Yup.string()
                    .required("required")
                    .matches(
                      /^\S(?:.*\S)?$/,
                      "cannot start or end with whitespaces"
                    )
                )
                .min(1, "At least one genre is required"),
              actors: Yup.array()
                .of(
                  Yup.object().shape({
                    id: Yup.string()
                      .required("required")
                      .matches(
                        /^\S(?:.*\S)?$/,
                        "cannot start or end with whitespaces"
                      ),
                    character: Yup.string()
                      .required("required")
                      .matches(
                        /^\S(?:.*\S)?$/,
                        "cannot start or end with whitespaces"
                      ),
                  })
                )
                .min(1, "At least one actor is required"),
              directors: Yup.array()
                .of(
                  Yup.string()
                    .required("required")
                    .matches(
                      /^\S(?:.*\S)?$/,
                      "cannot start or end with whitespaces"
                    )
                )
                .min(1, "At least one director is required"),
            })}
            onSubmit={async (values) => {
              console.log("please please please let me");
              try {
                setErrorMessage("submiting...");
                console.log("z edita");
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}admin/editMovie?id=${movie.id}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify(values),
                  }
                );

                console.log("edytujemy?", response);

                if (!response.ok) {
                  const data = await response.json();
                  setErrorMessage(data.error || "Failed to edit movie");
                  return;
                }

                setErrorMessage("updated");
              } catch (error) {
                setErrorMessage(error.message || "Internal Server Error");
              }
            }}
          >
            {({ values }) => (
              <Form className="form">
                <label>Title:</label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage name="title" component="div" />

                <label htmlFor="overview">Overview:</label>
                <Field as="textarea" id="overview" name="overview" rows={6} />
                <ErrorMessage name="overview" component="div" />

                <label htmlFor="runtime">Runtime:</label>
                <Field type="number" id="runtime" name="runtime" />
                <ErrorMessage name="runtime" component="div" />

                <label htmlFor="budget">Budget:</label>
                <Field type="number" id="budget" name="budget" />
                <ErrorMessage name="budget" component="div" />

                <label htmlFor="tagline">Tagline:</label>
                <Field type="text" id="tagline" name="tagline" />
                <ErrorMessage name="tagline" component="div" />

                <label htmlFor="poster_path">Poster Path:</label>
                <Field type="text" id="poster_path" name="poster_path" />
                <ErrorMessage name="poster_path" component="div" />

                <label htmlFor="release_date">Release Date:</label>
                <Field type="text" id="release_date" name="release_date" />
                <ErrorMessage name="release_date" component="div" />

                <label htmlFor="original_language">Original Language:</label>
                <Field
                  type="text"
                  id="original_language"
                  name="original_language"
                />
                <ErrorMessage name="original_language" component="div" />

                <label htmlFor="original_title">Original Title:</label>
                <Field type="text" id="original_title" name="original_title" />
                <ErrorMessage name="original_title" component="div" />

                <label htmlFor="backdrop_path">Backdrop Path:</label>
                <Field type="text" id="backdrop_path" name="backdrop_path" />
                <ErrorMessage name="backdrop_path" component="div" />

                <label>Images:</label>
                <FieldArray
                  name="images"
                  render={(arrayHelpers) => (
                    <div>
                      {values.images && values.images.length > 0
                        ? values.images.map((image, index) => (
                            <div className="form w-full" key={index}>
                              <label htmlFor={`images.${index}`}>Image:</label>
                              <Field
                                type="text"
                                id={`images.${index}`}
                                name={`images.${index}`}
                              />
                              <ErrorMessage
                                name={`images.${index}`}
                                component="div"
                              />
                              <button
                                type="button"
                                className="small-btn"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove Image
                              </button>
                            </div>
                          ))
                        : null}
                      <button
                        type="button"
                        className="small-btn"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add Image
                      </button>
                    </div>
                  )}
                />
                <label>Trailers (youtube keys):</label>
                <FieldArray
                  name="trailers"
                  render={(arrayHelpers) => (
                    <div>
                      {values.trailers && values.trailers.length > 0
                        ? values.trailers.map((trailer, index) => (
                            <div className="form w-full" key={index}>
                              <Field
                                type="text"
                                id={`trailers.${index}`}
                                name={`trailers.${index}`}
                              />
                              <ErrorMessage
                                name={`trailers.${index}`}
                                component="div"
                              />
                              <button
                                type="button"
                                className="small-btn"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove Trailer
                              </button>
                            </div>
                          ))
                        : null}
                      <button
                        type="button"
                        className="small-btn"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add Trailer
                      </button>
                    </div>
                  )}
                />
                <label>Genres names:</label>
                {useRenderFieldArray("genres", values)}
                <label>Directors ids:</label>
                {useRenderFieldArray("directors", values)}
                <label>Actors:</label>
                {useRenderDoubleFieldArray("actors", values)}
                <button type="submit" className="big-btn">
                  Save Changes
                </button>
                {movie && (
                  <>
                    <button
                      type="button"
                      className="big-btn"
                      onClick={() => handleDeleteMovie()}
                    >
                      Delete
                    </button>
                    {errorMessage && <p className="msg">{errorMessage}</p>}
                  </>
                )}
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
};

export default EditMovieForm;
