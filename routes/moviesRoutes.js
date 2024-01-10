import express from "express";
import driver from "../db/neo4jDriver.js";

import { 
    getMovies, 
    getPopularMovies, 
    getMovieById, 
    searchMovies, 
    searchMoviesByDirectorOrActor,
    rateMovie,
    commentMovie,
    addMovieToFavourites,
    addMovieToIgnored,
    addMovieToWatchlist,
    addMovieToFollowed
    // addMovieFromTmdbById
 } from "./controllers/moviesController.js";

const moviesRoutes = express.Router();

moviesRoutes.route('/api/movies').get(getMovies);
moviesRoutes.route('/api/movies/popular').get(getPopularMovies);
moviesRoutes.route('/api/movie/:movieId').get(getMovieById);
moviesRoutes.route('/api/movies/search').get(searchMovies);
moviesRoutes.route('/api/movies/searchByActorOrDirector').get(searchMoviesByDirectorOrActor);
moviesRoutes.route('/api/movies/:movieId/rate').post(rateMovie);
moviesRoutes.route('/api/movies/:movieId/comment').post(commentMovie);
moviesRoutes.route('/api/movies/:movieId/addToFavourites').post(addMovieToFavourites);
moviesRoutes.route('/api/movies/:movieId/addToIgnored').post(addMovieToIgnored);
moviesRoutes.route('/api/movies/:movieId/addToWatchlist').post(addMovieToWatchlist);
moviesRoutes.route('/api/movies/:movieId/addToFollowed').post(addMovieToFollowed);

// moviesRoutes.route('/api/movies/addTmdbMovie').get(addMovieFromTmdbById)


export default moviesRoutes;