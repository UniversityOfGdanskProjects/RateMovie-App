import express from "express";
import { registerUser } from "./controllers/usersController.js";
import extractToken from "../middleware/extractToken.js";

const usersRoutes = express.Router();

usersRoutes.post("/api/users/register", extractToken, registerUser);
// usersRoutes.post("/api/users/login", loginUser);

// usersRoutes.post(
//   "/api/users/login",
//   // [keycloak.protect()],
//   loginUser
// );

export default usersRoutes;
