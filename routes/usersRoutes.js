import express from "express";
import { registerUser, loginUser } from "./controllers/usersController.js";

const usersRoutes = express.Router();

usersRoutes.post('/api/users/register', registerUser);
usersRoutes.post('/api/users/login', loginUser);

export default usersRoutes;
