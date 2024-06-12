"use client";
import React, { useState, useContext } from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserContext } from "@/context/userContextProvider";
import {
  useRenderDoubleFieldArray,
  useRenderFieldArray,
} from "@/hooks/useRenderFieldArray";

const AddMovieForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext);

  return (
    <div>
      {errorMessage && <p className="msg">{errorMessage}</p>}
      <Formik
        initialValues={{
          runtime: 0,
          budget: 0,
          tagline: "",
          poster_path: "",
          release_date: "",
          overview: "",
          original_language: "",
          original_title: "",
          title: "",
          backdrop_path: "",
          images: [],
          trailers: [],
          genres: [],
          actors: [],
          directors: [],
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
            .matches(/^\S(?:.*\S)?$/, "Tcannot start or end with whitespaces"),
          original_language: Yup.string()
            .required("required")
            .matches(/^\S(?:.*\S)?$/, "cannot start or end with whitespaces"),
          original_title: Yup.string()
            .required("required")
            .matches(/^\S(?:.*\S)?$/, "cannot start or end with whitespaces"),
          title: Yup.string()
            .required("required")
            .matches(/^\S(?:.*\S)?$/, "cannot start or end with whitespaces"),
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
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}admin/addMovie`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(values),
              }
            );

            console.log(response);

            if (!response.ok) {
              const data = await response.json();
              setErrorMessage(data.error || "Failed to add movie");
              return;
            }

            setErrorMessage("Movie added successfully");
          } catch (error) {
            console.error("Error adding movie:", error);
            setErrorMessage(error.message || "Internal Server Error");
          }
        }}
      >
        {({ values }) => (
          <Form className="form">
            <label htmlFor="title">Title:</label>
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
                          <label htmlFor={`trailers.${index}`}>Trailer:</label>
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

            <button
              type="submit"
              //   onClick={() => console.log("ciekawe")}
              className="big-btn"
            >
              Add Movie
            </button>
          </Form>
        )}
      </Formik>
      {errorMessage && <p className="msg">{errorMessage}</p>}
    </div>
  );
};

export default AddMovieForm;
