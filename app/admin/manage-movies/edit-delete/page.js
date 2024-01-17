'use client';
import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditMovieForm from '@/components/EditMovieForm';
import { UserContext } from '@/context/userContextProvider';


export default function EditDeleteMovie() {
    // const {user} = useContext(UserContext)
    const user = {
    id: "0bb25f62-8e4d-4e39-977e-bfccbb6929bd",
    isAdmin: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYmIyNWY2Mi04ZTRkLTRlMzktOTc3ZS1iZmNjYmI2OTI5YmQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MDU1MTg3OTgsImV4cCI6MTcwNTUyMjM5OH0.scNLA8Qr4wYJSJmnwtabkVlmu4Pbw7DOk2pw7oWydZM",
    username: "AgataAdmin"}
    const movieId = 550
    return (
        <section>
          <h1>Edit Movie</h1>
            <div>fasdbhj</div>
            <EditMovieForm movieId={movieId} user={user}/>
        </section>
      );
}