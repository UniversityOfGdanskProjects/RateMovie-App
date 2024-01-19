'use client';
import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditMovieForm from '@/components/EditMovieForm';
import { UserContext } from '@/context/userContextProvider';

export default function EditDeleteMovie() {
    const { user } = useContext(UserContext);
    const [searchMovieId, setSearchMovieId] = useState('');
    const [movieId, setMovieId] = useState(null);

    const searchFormik = useFormik({
        initialValues: {
            searchMovieId: '',
        },
        validationSchema: Yup.object({
            searchMovieId: Yup.string().required('Required'),
        }),
        onSubmit: (values) => {
            setMovieId(values.searchMovieId);
        },
    });

    return (
        <section className='pb-3'>
            <h1 className='msg'>Edit Movie</h1>

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
                <div className='buttons'>
                  <button className="small-btn" type="submit">Search</button>
                </div>
                {searchFormik.touched.searchMovieId && searchFormik.errors.searchMovieId && (
                    <div>{searchFormik.errors.searchMovieId}</div>
                )}
            </form>
            {movieId && (
                <EditMovieForm movieId={movieId} user={user} />
            )}
        </section>
    );
}