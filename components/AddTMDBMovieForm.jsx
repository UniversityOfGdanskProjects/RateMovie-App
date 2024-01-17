import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '@/context/userContextProvider';

export default function AddTMDBMovieForm() {
    const {user} = useContext(UserContext)
  const [msg, setMsg] = useState('');

  const formik = useFormik({
    initialValues: {
      movieId: '',
    },
    validationSchema: Yup.object({
      movieId: Yup.string().required('movie is is required'),
    }),
    onSubmit: async (values) => {
        setMsg("adding...")
      try {
        const response = await fetch('http://localhost:7000/api/admin/addMovieFromTMDB', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ movieId: values.movieId }),
        });
        formik.resetForm();
        
        const data = await response.json();

        if (!response.ok) {
            setMsg(data.error)
            return
        } else {
            setMsg("succesfuly added movie: " + data.movie.title)
            return
        }
      } catch (error) {
        setMsg(error.message || 'Internal Server Error');
      }
    },
  });

  return (
    <>
      <h2 className='msg'>Add Movie from TMDB</h2>
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
        <div className='buttons'>
            <button type="submit" className='big-btn'>Add Movie</button>
        </div>
      </form>
    </>
  );
};

