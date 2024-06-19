import express from "express";
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

userDataRoutes.get("/api/favourites/:userId", getFavouriteMovies);
userDataRoutes.get("/api/watchlist/:userId", getWatchlistMovies);
userDataRoutes.get("/api/ignored/:userId", getIgnoredMovies);
userDataRoutes.get("/api/commented/:userId", getCommentedMovies);
userDataRoutes.get("/api/reviewed/:userId", getReviewedMovies);

userDataRoutes.get("/api/review/:userId/:movieId", getReviewByMovieAndUser);
userDataRoutes.get(
  "/api/favourite/:userId/:movieId",
  getFavouriteByMovieAndUser
);
userDataRoutes.get("/api/ignored/:userId/:movieId", getIgnoredByMovieAndUser);
userDataRoutes.get(
  "/api/watchlist/:userId/:movieId",
  getWathlistByMovieAndUser
);

userDataRoutes.route("/api/movies/:movieId/rate").post(rateMovie);
userDataRoutes.route("/api/movies/:movieId/comment").post(commentMovie);
userDataRoutes.route("/api/movies/comment").delete(deleteComment);
userDataRoutes.route("/api/movies/comment").put(editComment);

userDataRoutes
  .route("/api/movies/:movieId/addToFavourites")
  .post(addMovieToFavourites);
userDataRoutes
  .route("/api/movies/:movieId/addToIgnored")
  .post(addMovieToIgnored);
userDataRoutes
  .route("/api/movies/:movieId/addToWatchlist")
  .post(addMovieToWatchlist);

userDataRoutes.delete(
  "/api/removeFromIgnored/:userId/:movieId",
  removeMovieFromIgnored
);
userDataRoutes.delete(
  "/api/removeFromWatchlist/:userId/:movieId",
  removeMovieFromWatchlist
);

userDataRoutes.delete(
  "/api/removeFromFavourites/:userId/:movieId",
  removeMovieFromFavourites
);
userDataRoutes.delete(
  "/api/removeFromReviewed/:userId/:movieId",
  removeMovieFromReviewed
);
userDataRoutes.delete(
  "/api/removeFromCommented/:userId/:movieId",
  removeMovieFromCommented
);

export default userDataRoutes;
