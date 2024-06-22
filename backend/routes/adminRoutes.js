import express from "express";
import {
  deleteUser,
  editUser,
  addComment,
  removeComment,
  editComment,
  addMovie,
  removeMovie,
  editMovie,
  addMovieFromTMDB,
  getUsersByUsername,
  getUserById,
} from "./controllers/adminController.js";

import keycloak from "../middleware/keycloak.js";
import extractToken from "../middleware/extractToken.js";
import checkIfAdmin from "../middleware/checkIfAdmin.js";

const adminProtect = [keycloak.protect(), extractToken, checkIfAdmin];

const adminRoutes = express.Router();

adminRoutes.delete("/api/admin/deleteUser", adminProtect, deleteUser);
adminRoutes.patch("/api/admin/editUser", adminProtect, editUser);
adminRoutes.get("/api/admin/getUsers", adminProtect, getUsersByUsername);
adminRoutes.get("/api/admin/getUser", adminProtect, getUserById);
adminRoutes.post("/api/admin/:movieId/addComment", adminProtect, addComment);
adminRoutes.delete("/api/admin/removeComment", adminProtect, removeComment);
adminRoutes.patch("/api/admin/editComment", adminProtect, editComment);
adminRoutes.post("/api/admin/addMovieFromTMDB", adminProtect, addMovieFromTMDB);
adminRoutes.post("/api/admin/addMovie", adminProtect, addMovie);
adminRoutes.delete("/api/admin/deleteMovie", adminProtect, removeMovie);
adminRoutes.patch("/api/admin/editMovie", adminProtect, editMovie);

export default adminRoutes;
