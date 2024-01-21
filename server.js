import express from 'express';
import cors from 'cors';
import mqtt from 'mqtt';
import moviesRoutes from './routes/moviesRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import userDataRoutes from './routes/userDataRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';
import { config } from 'dotenv';
config()

const app = express();
const port = 7000;

app.use(express.json());
app.use(cors());

app.use(moviesRoutes);
app.use(usersRoutes);
app.use(userDataRoutes);
app.use(adminRoutes);
app.use(rankingRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
