import express from "express";
import Game from "../models/Game.js";
import { incrementView, getGames } from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/games
 * @desc    Pobiera listę wszystkich gier
 */
router.get("/", async (req, res) => {
    try {
        const games = await getGames();
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: "Błąd podczas pobierania listy gier: " + err.message });
    }
});

/**
 * @route   GET /api/games/:id
 * @desc    Pobiera szczegóły konkretnej gry
 */
router.get("/:id", async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate("author", "username");
        if (!game) {
            return res.status(404).json({ message: "Nie znaleziono takiej gry w bazie MongoDB" });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ error: "Błąd bazy danych przy pobieraniu gry" });
    }
});

/**
 * @route   POST /api/games/:id/view
 * @desc    Zwiększa licznik wyświetleń o 1
 */
router.post("/:id/view", async (req, res) => {
    try {
        const game = await incrementView(req.params.id);
        if (!game) {
            return res.status(404).json({ message: "Gra nie istnieje" });
        }
        res.json({ views: game.views });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   POST /api/games/:id/rate
 * @desc    Dodaje lub aktualizuje ocenę gry
 */
router.post("/:id/rate", authMiddleware, async (req, res) => {
    try {
        const { rating } = req.body;
        const userId = req.userId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Ocena musi być w przedziale 1-5" });
        }

        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: "Gra nie znaleziona" });

        // Inicjalizacja tablicy ratings, jeśli nie istnieje
        if (!game.ratings) game.ratings = [];

        const existingIndex = game.ratings.findIndex(r => r.userId?.toString() === userId);

        if (existingIndex >= 0) {
            game.ratings[existingIndex].rating = rating;
        } else {
            game.ratings.push({ userId, rating });
        }

        // Aktualizacja
        game.ratingCount = game.ratings.length;
        const sum = game.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        game.ratingAvg = sum / game.ratingCount;

        await game.save();
        res.json({ 
            message: "Ocena zapisana pomyślnie", 
            ratingAvg: game.ratingAvg, 
            ratingCount: game.ratingCount 
        });
    } catch (err) {
        console.error("Błąd oceniania:", err);
        res.status(500).json({ message: "Błąd serwera podczas zapisywania oceny" });
    }
});

/**
 * @route   POST /api/games/
 * @desc    Proste dodawanie dokumentu gry do bazy (bez uploadu pliku)
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Dodajemy autora z tokena, aby gra była przypisana do kogoś
        const gameData = { ...req.body, author: req.userId };
        const game = await Game.create(gameData);
        res.status(201).json(game);
    } catch (err) {
        res.status(400).json({ error: "Nie udało się utworzyć wpisu gry: " + err.message });
    }
});

export default router;