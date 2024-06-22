import express from "express";
import keycloak from "../middleware/keycloak.js";
import {
  getFavouriteMovies,
  getWatchlistMovies,
  getIgnoredMovies,
  getCommentedMovies,
  getReviewedMovies,
  getReviewByMovieAndUser,
  getFavouriteByMovieAndUser,
  getIgnoredByMovieAndUser,
  getWathlistByMovieAndUser,
  rateMovie,
  commentMovie,
  addMovieToFavourites,
  addMovieToIgnored,
  addMovieToWatchlist,
  removeMovieFromCommented,
  removeMovieFromFavourites,
  removeMovieFromIgnored,
  removeMovieFromWatchlist,
  removeMovieFromReviewed,
  deleteComment,
  editComment,
} from "./controllers/userDataController.js";

const userDataRoutes = express.Router();

// userDataRoutes.use(keycloak.protect());

userDataRoutes.get(
  "/api/favourites/:userId",
  keycloak.protect(),
  getFavouriteMovies
);
userDataRoutes.get(
  "/api/watchlist/:userId",
  keycloak.protect(),
  getWatchlistMovies
);
userDataRoutes.get(
  "/api/ignored/:userId",
  keycloak.protect(),
  getIgnoredMovies
);
userDataRoutes.get(
  "/api/commented/:userId",
  keycloak.protect(),
  getCommentedMovies
);
userDataRoutes.get(
  "/api/reviewed/:userId",
  keycloak.protect(),
  getReviewedMovies
);

userDataRoutes.get(
  "/api/review/:userId/:movieId",
  keycloak.protect(),
  getReviewByMovieAndUser
);
userDataRoutes.get(
  "/api/favourite/:userId/:movieId",
  keycloak.protect(),
  getFavouriteByMovieAndUser
);
userDataRoutes.get(
  "/api/ignored/:userId/:movieId",
  keycloak.protect(),
  getIgnoredByMovieAndUser
);
userDataRoutes.get(
  "/api/watchlist/:userId/:movieId",
  keycloak.protect(),
  getWathlistByMovieAndUser
);

userDataRoutes.post("/api/movies/:movieId/rate", keycloak.protect(), rateMovie);
userDataRoutes.post(
  "/api/movies/:movieId/comment",
  keycloak.protect(),
  commentMovie
);
userDataRoutes.delete("/api/movies/comment", keycloak.protect(), deleteComment);
userDataRoutes.put("/api/movies/comment", keycloak.protect(), editComment);

userDataRoutes.post(
  "/api/movies/:movieId/addToFavourites",
  keycloak.protect(),
  addMovieToFavourites
);

userDataRoutes.post(
  "/api/movies/:movieId/addToIgnored",
  keycloak.protect(),
  addMovieToIgnored
);

userDataRoutes.post(
  "/api/movies/:movieId/addToWatchlist",
  keycloak.protect(),
  addMovieToWatchlist
);

userDataRoutes.delete(
  "/api/removeFromIgnored/:userId/:movieId",
  keycloak.protect(),
  removeMovieFromIgnored
);
userDataRoutes.delete(
  "/api/removeFromWatchlist/:userId/:movieId",
  keycloak.protect(),
  removeMovieFromWatchlist
);

userDataRoutes.delete(
  "/api/removeFromFavourites/:userId/:movieId",
  keycloak.protect(),
  removeMovieFromFavourites
);
userDataRoutes.delete(
  "/api/removeFromReviewed/:userId/:movieId",
  keycloak.protect(),
  removeMovieFromReviewed
);
userDataRoutes.delete(
  "/api/removeFromCommented/:userId/:movieId",
  keycloak.protect(),
  removeMovieFromCommented
);

export default userDataRoutes;
