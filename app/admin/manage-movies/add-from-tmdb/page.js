"use client";
import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserContext } from "@/context/userContextProvider";
import AddTMDBMovieForm from "@/components/AddTMDBMovieForm";

export default function AddTMDBMovie() {
  const { user } = useContext(UserContext);
  return (
    <section>
      <h1 className="msg">Add Movie From TMDB</h1>
      <AddTMDBMovieForm />
      <br />
    </section>
  );
}
