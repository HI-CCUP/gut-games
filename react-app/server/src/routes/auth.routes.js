import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import fs from "fs"; // Dodajemy fs do sprawdzenia pliku

import User from "../models/User.js";
import Game from "../models/Game.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } 
});

// --- KONFIGURACJA GOOGLE CLOUD STORAGE ---
let gcsConfig = {};

if (fs.existsSync("gcs-key.json")) {
    // 1. Jeśli plik istnieje (LOKALNIE), używamy go
    gcsConfig = { keyFilename: "gcs-key.json" };
    console.log("GCS: Używam pliku klucza lokalnego.");
} else if (process.env.GCS_KEY_JSON) {
    // 2. Jeśli pliku nie ma (VERCEL/RENDER), używamy zmiennej
    gcsConfig = {
        credentials: JSON.parse(process.env.GCS_KEY_JSON),
    };
    console.log("GCS: Używam klucza ze zmiennych środowiskowych.");
}

const gcs = new Storage(gcsConfig);
const bucket = gcs.bucket(process.env.GCS_BUCKET_NAME || "gut-games-game-files-bucket");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Wypełnij wszystkie pola" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik o takim loginie lub e-mailu już istnieje" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
      message: "Konto zostało utworzone"
    });
  } catch (err) {
    console.error("Błąd rejestracji:", err);
    res.status(500).json({ message: "Wystąpił błąd podczas rejestracji" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Podaj e-mail oraz hasło" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowy e-mail lub hasło" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Nieprawidłowy e-mail lub hasło" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
      message: "Zalogowano pomyślnie"
    });
  } catch (err) {
    console.error("Błąd logowania:", err);
    res.status(500).json({ message: "Błąd serwera podczas logowania" });
  }
});

router.post("/add", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({ message: "Tytuł i plik gry są wymagane" });
    }

    const safeFileName = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const filename = `${Date.now()}-${safeFileName}`;
    const blob = bucket.file(filename);

    const stream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
        metadata: {
            cacheControl: "public, max-age=31536000",
        }
    });

    stream.on('error', (err) => {
        throw err;
    });

    stream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        const newGame = await Game.create({
          title,
          description: description || "",
          gameUrl: publicUrl,
          author: req.userId,
        });

        res.status(201).json({ 
          message: "Gra została pomyślnie dodana do biblioteki!", 
          game: newGame 
        });
    });

    stream.end(file.buffer);

  } catch (err) {
    console.error("Błąd GCS / MongoDB:", err);
    res.status(500).json({ message: "Nie udało się zapisać gry. Spróbuj ponownie później." });
  }
});

export default router;