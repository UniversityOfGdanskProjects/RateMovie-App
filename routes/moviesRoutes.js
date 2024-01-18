import express from "express";
import driver from "../db/neo4jDriver.js";

import { 
    getMovies, 
    getPopularMovies, 
    getMovieById, 
    searchMovies, 
    rateMovie,
    commentMovie,
    addMovieToFavourites,
    addMovieToIgnored,
    addMovieToWatchlist,
    addMovieToFollowed,
    removeMovieFromIgnored,
    removeMovieFromWatchlist,
    removeMovieFromFollowed,
    removeMovieFromFavourites,
    removeMovieFromCommented,
    removeMovieFromReviewed,
    getGenres
 } from "./controllers/moviesController.js";

const moviesRoutes = express.Router();

moviesRoutes.route('/api/movies').get(getMovies);
moviesRoutes.route('/api/movies/popular').get(getPopularMovies);
moviesRoutes.route('/api/movie/:movieId').get(getMovieById);
moviesRoutes.route('/api/movies/search').get(searchMovies);
moviesRoutes.route('/api/movies/:movieId/rate').post(rateMovie);

moviesRoutes.route('/api/movies/:movieId/comment').post(commentMovie);

moviesRoutes.route('/api/movies/:movieId/addToFavourites').post(addMovieToFavourites);
moviesRoutes.route('/api/movies/:movieId/addToIgnored').post(addMovieToIgnored);
moviesRoutes.route('/api/movies/:movieId/addToWatchlist').post(addMovieToWatchlist);
moviesRoutes.route('/api/movies/:movieId/addToFollowed').post(addMovieToFollowed);

moviesRoutes.delete('/api/removeFromIgnored/:userId/:movieId', removeMovieFromIgnored);
moviesRoutes.delete('/api/removeFromWatchlist/:userId/:movieId', removeMovieFromWatchlist);
moviesRoutes.delete('/api/removeFromFollowed/:userId/:movieId', removeMovieFromFollowed);
moviesRoutes.delete('/api/removeFromFavourites/:userId/:movieId', removeMovieFromFavourites);
moviesRoutes.delete('/api/removeFromReviewed/:userId/:movieId', removeMovieFromReviewed);
moviesRoutes.delete('/api/removeFromCommented/:userId/:movieId', removeMovieFromCommented);

moviesRoutes.get('/api/genres', getGenres)



export default moviesRoutes;