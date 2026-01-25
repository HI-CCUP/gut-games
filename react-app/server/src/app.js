import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testRoutes from "./routes/test.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5000", "https://gut-games.vercel.app"], 
}));

app.use(express.json());

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);

export default app;
