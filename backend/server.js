import express from "express";
import cors from "cors";
import moviesRoutes from "./routes/moviesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import userDataRoutes from "./routes/userDataRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import sseRoutes from "./routes/sseRoutes.js";
import { config } from "dotenv";
import keycloak from "./middleware/keycloak.js";

config();
const app = express();
const port = process.env.BACKEND_PORT;
const host = process.env.BACKEND_NAME;
// console.log(process.env.KEYCLOAK_URL);
app.use(express.json());
app.use(cors());
app.use(keycloak.middleware());

app.use(moviesRoutes);
app.use(usersRoutes);
app.use(userDataRoutes);
app.use(adminRoutes);
app.use(rankingRoutes);
app.use(sseRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
