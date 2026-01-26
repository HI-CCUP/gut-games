import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*", // tymczasowo, żeby frontend Vercel mógł się połączyć
    credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;

