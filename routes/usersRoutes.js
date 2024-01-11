import express from "express";
import { registerUser, loginUser, usersRanking } from "./controllers/usersController.js";

const usersRoutes = express.Router();

usersRoutes.post('/api/users/register', registerUser);
usersRoutes.post('/api/users/login', loginUser);
usersRoutes.get('/api/users/ranking', usersRanking);

export default usersRoutes;
