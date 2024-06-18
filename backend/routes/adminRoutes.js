import express from "express";
import {
  registerAdmin,
  loginAdmin,
  deleteUser,
  editUser,
  addUser,
  // addMovieToFavourites,
  // addMovieToIgnored,
  // addMovieToWatchlist,
  // addMovieToFollowed,
  // removeMovieFromFavourites,
  // removeMovieFromIgnored,
  // removeMovieFromWatchlist,
  // removeMovieFromFollowed,
  addComment,
  removeComment,
  editComment,
  // addReview,
  // removeReview,
  // editReview,
  addMovie,
  removeMovie,
  editMovie,
  addMovieFromTMDB,
  getUserById,
} from "./controllers/adminController.js";

import keycloak from "../middleware/keycloak.js";
import extractToken from "../middleware/extractToken.js";
import checkIfAdmin from "../middleware/checkIfAdmin.js";

const adminRoutes = express.Router();

adminRoutes.post(
  "/api/admin/register",
  // [keycloak.protect(), extractToken, checkIfAdmin],
  registerAdmin
);

adminRoutes.delete(
  "/api/admin/deleteUser",
  [keycloak.protect(), extractToken, checkIfAdmin],
  deleteUser
);
adminRoutes.patch(
  "/api/admin/editUser",
  [keycloak.protect(), extractToken, checkIfAdmin],
  editUser
);
adminRoutes.post(
  "/api/admin/addUser",
  [keycloak.protect(), extractToken, checkIfAdmin],
  addUser
);
adminRoutes.get(
  "/api/admin/getUser",
  [keycloak.protect(), extractToken, checkIfAdmin],
  getUserById
);

adminRoutes.post(
  "/api/admin/:movieId/addComment",
  [keycloak.protect(), extractToken, checkIfAdmin],
  addComment
);
adminRoutes.delete(
  "/api/admin/removeComment",
  [keycloak.protect(), extractToken, checkIfAdmin],
  removeComment
);
adminRoutes.patch(
  "/api/admin/editComment",
  [keycloak.protect(), extractToken, checkIfAdmin],
  editComment
);

adminRoutes.post(
  "/api/admin/addMovieFromTMDB",
  [keycloak.protect(), extractToken, checkIfAdmin],
  addMovieFromTMDB
);
adminRoutes.post(
  "/api/admin/addMovie",
  [keycloak.protect(), extractToken, checkIfAdmin],
  addMovie
);
adminRoutes.delete(
  "/api/admin/deleteMovie",
  [keycloak.protect(), extractToken, checkIfAdmin],
  removeMovie
);
adminRoutes.patch(
  "/api/admin/editMovie",
  [keycloak.protect(), extractToken, checkIfAdmin],
  editMovie
);

adminRoutes.route("/api/admin/login").post(loginAdmin);

export default adminRoutes;

// adminRoutes.route("/api/admin/register").post(registerAdmin);

// adminRoutes.route("/api/admin/deleteUser").delete(deleteUser);
// adminRoutes.route("/api/admin/editUser").patch(editUser);
// adminRoutes.route("/api/admin/addUser").post(addUser);
// adminRoutes.route("/api/admin/getUser").get(getUserById);

// adminRoutes.route("/api/admin/:movieId/addComment").post(addComment);
// adminRoutes.route("/api/admin/removeComment").delete(removeComment);
// adminRoutes.route("/api/admin/editComment").patch(editComment);

// adminRoutes.route("/api/admin/addMovieFromTMDB").post(addMovieFromTMDB);
// adminRoutes.route("/api/admin/addMovie").post(addMovie);
// adminRoutes.route("/api/admin/deleteMovie").delete(removeMovie);
// adminRoutes.route("/api/admin/editMovie").patch(editMovie);

// adminRoutes.route("/api/admin/addMovieToFavourites").post(addMovieToFavourites);
// adminRoutes.route("/api/admin/addMovieToIgnored").post(addMovieToIgnored);
// adminRoutes.route("/api/admin/addMovieToWatchlist").post(addMovieToWatchlist);
// adminRoutes.route("/api/admin/addMovieToFollowed").post(addMovieToFollowed);

// adminRoutes
//   .route("/api/admin/removeMovieFromFavourites")
//   .delete(removeMovieFromFavourites);
// adminRoutes
//   .route("/api/admin/removeMovieFromIgnored")
//   .delete(removeMovieFromIgnored);
// adminRoutes
//   .route("/api/admin/removeMovieFromWatchlist")
//   .delete(removeMovieFromWatchlist);
// adminRoutes
//   .route("/api/admin/removeMovieFromFollowed")
//   .delete(removeMovieFromFollowed);
// adminRoutes.route("/api/admin/addReview").post(addReview);
// adminRoutes.route("/api/admin/removeReview").delete(removeReview);
// adminRoutes.route("/api/admin/editReview").patch(editReview);
