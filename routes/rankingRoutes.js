import express from "express";

import {
  getMovieRanking,
  getUsersRanking,
} from "./controllers/rankingController.js";

const rankingRoutes = express.Router();

rankingRoutes.route("/api/ranking/movies").get(getMovieRanking);
rankingRoutes.route("/api/ranking/users").get(getUsersRanking);

export default rankingRoutes;
