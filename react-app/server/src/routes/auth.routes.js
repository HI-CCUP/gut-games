import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import fs from "fs";

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
    gcsConfig = { keyFilename: "gcs-key.json" };
    console.log("GCS: Używam pliku klucza lokalnego.");
} else if (process.env.GCS_KEY_JSON) {
    try {
        const credentials = JSON.parse(process.env.GCS_KEY_JSON);
        if (credentials.private_key) {
            credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
        gcsConfig = { credentials };
        console.log("GCS: Używam klucza ze zmiennych środowiskowych.");
    } catch (err) {
        console.error("BŁĄD PARSOWANIA GCS_KEY_JSON:", err);
    }
}

const gcs = new Storage(gcsConfig);
const bucket = gcs.bucket(process.env.GCS_BUCKET_NAME || "gut-games-game-files-bucket");

// --- REJESTRACJA ---
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
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        isAdmin: user.isAdmin 
      },
      message: "Konto zostało utworzone"
    });
  } catch (err) {
    console.error("Błąd rejestracji:", err);
    res.status(500).json({ message: "Wystąpił błąd podczas rejestracji" });
  }
});

// --- LOGOWANIE ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        isAdmin: user.isAdmin
      },
      message: "Zalogowano pomyślnie"
    });
  } catch (err) {
    console.error("Błąd logowania:", err);
    res.status(500).json({ message: "Błąd serwera podczas logowania" });
  }
});

// --- DODAWANIE GRY  ---
router.post("/add", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body; 
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
        console.error("GCS Stream Error:", err);
        if (!res.headersSent) {
            res.status(500).json({ message: "Błąd podczas przesyłania pliku do chmury." });
        }
    });

    stream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        try {
            const newGame = await Game.create({
              title,
              description: description || "",
              gameUrl: publicUrl,
              thumbnail: thumbnail || "/bg.png",
              author: req.userId,
            });

            res.status(201).json({ 
              message: "Gra została pomyślnie dodana!", 
              game: newGame 
            });
        } catch (dbErr) {
            console.error("DB Error:", dbErr);
            res.status(500).json({ message: "Plik wgrany, ale wystąpił błąd bazy danych." });
        }
    });

    stream.end(file.buffer);

  } catch (err) {
    console.error("General Add Game Error:", err);
    res.status(500).json({ message: "Nie udało się przetworzyć żądania." });
  }
});

export default router;