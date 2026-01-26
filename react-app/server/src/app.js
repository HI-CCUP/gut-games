import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testRoutes from "./routes/test.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",        // React lokalnie
    "https://gut-games.vercel.app", // React na Vercel
  ],
  credentials: true,
}));


app.use(express.json());

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);

export default app;
