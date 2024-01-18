'use client';
import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditMovieForm from '@/components/EditMovieForm';
import { UserContext } from '@/context/userContextProvider';


export default function EditDeleteMovie() {
    const {user} = useContext(UserContext)
    // const user = {
    // id: "0bb25f62-8e4d-4e39-977e-bfccbb6929bd",
    // isAdmin: true,
    // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYmIyNWY2Mi04ZTRkLTRlMzktOTc3ZS1iZmNjYmI2OTI5YmQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MDU1MzM1MDcsImV4cCI6MTcwNTUzNzEwN30.SPZTXxSJVLrTv2RxtMQB3ZqBMY7Rv-fJCnClA_gShw4",
    // username: "AgataAdmin"}
    const movieId = 955916
    return (
        <section>
          <h1 className='msg'>Edit Movie</h1>
            <EditMovieForm movieId={movieId} user={user}/>
        </section>
      );
}