import React, { useState, useEffect, useContext } from 'react';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '@/context/userContextProvider';

const EditMovieForm = ({ movieId }) => {
    const [movie, setMovie] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const {user} = useContext(UserContext)

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://localhost:7000/api/movie/${movieId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const data = await response.json();
                    setErrorMessage(data.error || 'Failed to fetch movie details');
                }

                const data = await response.json();
                setMovie(data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setErrorMessage(error.message || 'Internal Server Error');
            }
        };

        if (movieId) {
            fetchMovieDetails();
        }
    }, [movieId]);

    const renderDoubleFieldArray = (name, values) => {
        return (
            <FieldArray
                name={name}
                render={arrayHelpers => (
                    <div>
                        {values[name] && values[name].length > 0 ? (
                            values[name].map((item, index) => (
                                <div key={index} className='form w-full border-slate-800 border-solid border-2 my-2'>
                                    <label htmlFor={`${name}.${index}.id`}>ID:</label>
                                    <Field
                                        type="text"
                                        id={`${name}.${index}.id`}
                                        name={`${name}.${index}.id`}
                                    />
                                    <ErrorMessage name={`${name}.${index}.id`} component="div" />

                                    <label htmlFor={`${name}.${index}.character`}>Character:</label>
                                    <Field
                                        type="text"
                                        id={`${name}.${index}.character`}
                                        name={`${name}.${index}.character`}
                                    />
                                    <ErrorMessage name={`${name}.${index}.character`} component="div" />

                                    <button
                                        type="button"
                                        className="small-btn"
                                        onClick={() => arrayHelpers.remove(index)}
                                    >
                                        Remove {name.slice(0,-1)}
                                    </button>
                                </div>
                            ))
                        ) : null}
                        <button
                            type="button"
                            className='small-btn'
                            onClick={() => arrayHelpers.push({ id: '', character: '' })}
                        >
                            Add {name.slice(0,-1)}
                        </button>
                    </div>
                )}
            />
        );
    };

    const renderFieldArray = (name, values) => {
        return (
            <FieldArray
                name={name}
                render={arrayHelpers => (
                    <div>
                        {values[name] && values[name].length > 0 ? (
                            values[name].map((idEl, index) => (
                                <div className="form w-full" key={index}>
                                    <Field
                                        type="text"
                                        id={`${name}.${index}`}
                                        name={`${name}.${index}`}
                                    />
                                    <ErrorMessage name={`${name}.${index}`} component="div" />
                                    <button
                                        type="button"
                                        className="small-btn"
                                        onClick={() => arrayHelpers.remove(index)}
                                    >
                                        Remove {name.slice(0,-1)}
                                    </button>
                                </div>
                            ))
                        ) : null}
                        <button
                            type="button"
                            className='small-btn'
                            onClick={() => arrayHelpers.push('')}
                        >
                            Add {name.slice(0, -1)}
                        </button>
                    </div>
                )}
            />
        );
    };

    const handleDeleteMovie = async () => {
        try {
            setErrorMessage("Deleting movie...");
            const deleteResponse = await fetch(`http://localhost:7000/api/admin/deleteMovie`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ movieId: String(movieId) }),
            });

            if (!deleteResponse.ok) {
                const data = await deleteResponse.json();
                setErrorMessage(data.error || 'Failed to delete movie');
                return;
            }

            setErrorMessage("Movie deleted successfully");
        } catch (error) {
            console.error('Error deleting movie:', error);
            setErrorMessage(error.message || 'Internal Server Error');
        }
    };

    return (
        <div>
            <h2 className='msg'>Movie ID: {movieId}</h2>
            {errorMessage && <p className='msg'>{errorMessage}</p>}
            {movie ? (
                <>
                <Formik
                    initialValues={{
                        runtime: movie?.runtime || 0,
                        budget: movie?.budget || 0,
                        tagline: movie?.tagline || '',
                        poster_path: movie?.poster_path || '',
                        release_date: movie?.release_date || '',
                        overview: movie?.overview || '',
                        original_language: movie?.original_language || '',
                        original_title: movie?.original_title || '',
                        title: movie?.title || '',
                        backdrop_path: movie?.backdrop_path || '',
                        images: movie?.images || [],
                        trailers: movie?.trailers || [],
                        genres: movie?.genres?.map(el => el.id) || [],
                        actors: movie?.actors?.map(el => ({ id: el.id, character: el.character})) || [],
                        directors: movie?.directors?.map(el => el.id) || [],

                    }}
                    validationSchema={Yup.object({
                        runtime: Yup.number().typeError('Runtime must be a number').positive('Runtime must be a positive number').required("required"),
                        budget: Yup.number().typeError('Budget must be a number').positive('Budget must be a positive number').required("required"),
                        tagline: Yup.string().required("required"),
                        poster_path: Yup.string().url('Invalid URL format for Poster Path').required("required"),
                        release_date: Yup.string().required("required"),
                        overview: Yup.string().required("required"),
                        original_language: Yup.string().required("required"),
                        original_title: Yup.string().required("required"),
                        title: Yup.string().required("required"),
                        backdrop_path: Yup.string().url('Invalid URL format for Backdrop Path').required("required"),
                        images: Yup.array().of(Yup.string().required("required").url("Invalid URL format for Images")),
                        trailers: Yup.array().of(Yup.string().required("required")),
                        genres: Yup.array().of(Yup.string().required("required")),
                        actors: Yup.array().of(
                            Yup.object().shape({
                                id: Yup.string().required("required"),
                                character: Yup.string().required("required"),
                            })
                            ),
                        directors: Yup.array().of(Yup.string().required("required")),
                    })}
                    onSubmit={async (values) => {
                        try {
                            setErrorMessage("submiting...")
                            console.log('z edita')
                            const response = await fetch(`http://localhost:7000/api/admin/editMovie?id=${movieId}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user.token}`,
                                },
                                body: JSON.stringify(values),
                            });

                            console.log(response)

                            if (!response.ok) {
                                const data = await response.json();
                                setErrorMessage(data.error || 'Failed to edit movie');
                                return
                            }

                            setErrorMessage("updated")

                        } catch (error) {
                            console.error('Error editing movie:', error);
                            setErrorMessage(error.message || 'Internal Server Error');
                        }
                    }}
                >{({ values }) => (
                    <Form className='form'>
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
                        <Field type="text" id="original_language" name="original_language" />
                        <ErrorMessage name="original_language" component="div" />

                        <label htmlFor="original_title">Original Title:</label>
                        <Field type="text" id="original_title" name="original_title" />
                        <ErrorMessage name="original_title" component="div" />

                        <label htmlFor="backdrop_path">Backdrop Path:</label>
                        <Field type="text" id="backdrop_path" name="backdrop_path" />
                        <ErrorMessage name="backdrop_path" component="div" />
                        
                        <label htmlFor="images">Images:</label>
                        <FieldArray
                            name="images"
                            render={arrayHelpers => (
                                <div>
                                    {values.images && values.images.length > 0 ? (
                                        
                                        values.images.map((image, index) => (
                                            <div className="form w-full" key={index}>
                                                <Field
                                                    type="text"
                                                    id={`images.${index}`}
                                                    name={`images.${index}`}
                                                />
                                                <ErrorMessage name={`images.${index}`} component="div" />
                                                <button
                                                    type="button"
                                                    className="small-btn"
                                                    onClick={() => arrayHelpers.remove(index)}
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        ))
                                    ) : null}
                                    <button
                                        type="button"
                                        className='small-btn'
                                        onClick={() => arrayHelpers.push('')}
                                    >
                                        Add Image
                                    </button>
                                </div>
                            )}
                        />
                        <label htmlFor="trailers">Trailers:</label>
                        <FieldArray
                            name="trailers"
                            render={arrayHelpers => (
                                <div>
                                    {values.trailers && values.trailers.length > 0 ? (
                                        values.trailers.map((trailer, index) => (
                                            <div className="form w-full" key={index}>
                                                <Field
                                                    type="text"
                                                    id={`trailers.${index}`}
                                                    name={`trailers.${index}`}
                                                />
                                                <ErrorMessage name={`trailers.${index}`} component="div" />
                                                <button
                                                    type="button"
                                                    className="small-btn"
                                                    onClick={() => arrayHelpers.remove(index)}
                                                >
                                                    Remove Trailer
                                                </button>
                                            </div>
                                        ))
                                    ) : null}
                                    <button
                                        type="button"
                                        className='small-btn'
                                        onClick={() => arrayHelpers.push('')}
                                    >
                                        Add Trailer
                                    </button>
                                </div>
                            )}
                        />
                            {renderFieldArray("genres", values)}
                            {renderFieldArray("directors",values)}
                            {renderDoubleFieldArray("actors", values)}
                        <button type="submit" onClick={() => console.log(values)}className='big-btn'>Save Changes</button>
                        {movie && (
                            <>
                                <button
                                    type="button"
                                    className='big-btn'
                                    onClick={() => handleDeleteMovie()}
                                >
                                    Delete
                                </button>
                                {errorMessage && <p className='msg'>{errorMessage}</p>}
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
}

export default EditMovieForm;
