import express from "express";

import { getMovieRanking } from "./controllers/rankingController.js";

const rankingRoutes = express.Router();

rankingRoutes.route("/api/ranking/movies").get(getMovieRanking);

export default rankingRoutes;
