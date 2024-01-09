import express from 'express';
import cors from "cors";
// import passport from 'passport';
import moviesRoutes from "./routes/moviesRoutes.js"
import usersRoutes from './routes/usersRoutes.js';
import userDataRoutes from './routes/userDataRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())

app.use(moviesRoutes)
app.use(usersRoutes)
app.use(userDataRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
