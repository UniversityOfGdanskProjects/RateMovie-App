import express from "express";
import driver from "../db/neo4jDriver.js";

import {
  getMovies,
  getPopularMovies,
  getMovieById,
  searchMovies,
  getComments,
  getGenres,
  getActors,
  getDirectors,
} from "./controllers/moviesController.js";

const moviesRoutes = express.Router();

moviesRoutes.route("/api/movies").get(getMovies);
moviesRoutes.route("/api/movies/popular").get(getPopularMovies);
moviesRoutes.route("/api/movie/:movieId").get(getMovieById);
moviesRoutes.route("/api/movies/search").get(searchMovies);
moviesRoutes.route("/api/:movieId/comments").get(getComments);
moviesRoutes.get("/api/genres", getGenres);
moviesRoutes.get("/api/directors/:n", getDirectors);
moviesRoutes.get("/api/actors/:n", getActors);

export default moviesRoutes;
