import express from 'express';
import cors from "cors";
import moviesRoutes from "./routes/movies.js"
import usersRoutes from './routes/users.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())
app.use(moviesRoutes)
app.use(usersRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
