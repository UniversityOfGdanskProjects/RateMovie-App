import express from "express";
import driver from "../db/neo4jDriver.js";

import { 
    getMovies, 
    getPopularMovies, 
    getMovieById, 
    searchMovies, 
    searchMoviesByDirectorOrActor,
    rateMovie
    // addMovieFromTmdbById
 } from "./controllers/moviesController.js";

const moviesRoutes = express.Router();

moviesRoutes.route('/api/movies').get(getMovies);
moviesRoutes.route('/api/movies/popular').get(getPopularMovies);
moviesRoutes.route('/api/movies/:movieId').get(getMovieById);
moviesRoutes.route('/api/movies/search').get(searchMovies);
moviesRoutes.route('/api/movies/searchByActorOrDirector').get(searchMoviesByDirectorOrActor);
moviesRoutes.route('/api/movies/:movieId/rate').post(rateMovie);

// moviesRoutes.route('/api/movies/addTmdbMovie').get(addMovieFromTmdbById)


export default moviesRoutes;