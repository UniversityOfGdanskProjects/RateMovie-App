import express from "express";
import driver from "../db/neo4jDriver.js";
import { getMovies, getPopularMovies, getMovieById, searchMovies, searchMoviesByDirectorOrActor } from "./controllers/moviesController.js";

const moviesRoutes = express.Router();

moviesRoutes.route('/api/movies').get(getMovies);
moviesRoutes.route('/api/movies/popular').get(getPopularMovies);
moviesRoutes.route('/api/movie/:id').get(getMovieById);
moviesRoutes.route('/api/movies/search').get(searchMovies);
moviesRoutes.route('/api/movies/searchByActorOrDirector').get(searchMoviesByDirectorOrActor);


export default moviesRoutes;