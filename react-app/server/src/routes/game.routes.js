import express from "express";
import Game from "../models/Game.js";
import Comment from "../models/Comment.js";
import { incrementView, getGames } from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/games/:id
 * @desc    Pobiera szczegóły gry (w tym ratingAvg i ratingCount)
 */
router.get("/:id", async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate("author", "username");
        if (!game) {
            return res.status(404).json({ message: "Nie znaleziono gry" });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ error: "Błąd bazy danych" });
    }
});

/**
 * @route   GET /api/games/:id/comments
 * @desc    Pobiera komentarze wraz z ocenami wystawionymi przez użytkowników
 */
router.get("/:id/comments", async (req, res) => {
    try {
        const comments = await Comment.find({ game: req.params.id })
            .populate("user", "username") 
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: "Błąd podczas pobierania komentarzy" });
    }
});

/**
 * @route   POST /api/games/:id/comments
 * @desc    Dodaje komentarz i aktualizuje średnią ocenę gry
 */
router.post("/:id/comments", authMiddleware, async (req, res) => {
    try {
        const { content, rating } = req.body;
        const userId = req.userId;
        const ratingVal = Number(rating) || 5; // Wymuszamy typ liczbowy

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: "Treść nie może być pusta" });
        }

        const newComment = await Comment.create({
            game: req.params.id,
            user: userId,
            content: content,
            rating: ratingVal
        });

        const game = await Game.findById(req.params.id);
        if (game) {
            if (!game.ratings) game.ratings = [];

            const existingIndex = game.ratings.findIndex(r => r.userId?.toString() === userId);

            if (existingIndex >= 0) {
                game.ratings[existingIndex].rating = ratingVal;
            } else {
                game.ratings.push({ userId, rating: ratingVal });
            }

            // KLUCZOWE: Upewniamy się, że sumujemy LICZBY
            game.ratingCount = game.ratings.length;
            const sum = game.ratings.reduce((acc, curr) => acc + Number(curr.rating), 0);
            game.ratingAvg = sum / game.ratingCount;

            await game.save();
        }

        const populatedComment = await newComment.populate("user", "username");
        res.status(201).json({ 
            message: "Dodano", 
            comment: populatedComment,
            ratingAvg: game.ratingAvg // Wysyłamy nową średnią
        });
    } catch (err) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

/**
 * @route   POST /api/games/:id/rate
 * @desc    Szybka ocena
 */
router.post("/:id/rate", authMiddleware, async (req, res) => {
    try {
        const { rating } = req.body;
        const userId = req.userId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Ocena musi być 1-5" });
        }

        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: "Gra nie znaleziona" });

        if (!game.ratings) game.ratings = [];

        const existingIndex = game.ratings.findIndex(r => r.userId?.toString() === userId);

        if (existingIndex >= 0) {
            game.ratings[existingIndex].rating = rating;
        } else {
            game.ratings.push({ userId, rating });
        }

        game.ratingCount = game.ratings.length;
        const sum = game.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        game.ratingAvg = sum / game.ratingCount;

        await game.save();
        res.json({ 
            message: "Ocena zapisana", 
            ratingAvg: game.ratingAvg, 
            ratingCount: game.ratingCount 
        });
    } catch (err) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

router.get("/", async (req, res) => {
    try {
        const games = await getGames();
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/:id/view", async (req, res) => {
    try {
        const game = await incrementView(req.params.id);
        if (!game) return res.status(404).json({ message: "Gra nie istnieje" });
        res.json({ views: game.views });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const gameData = { ...req.body, author: req.userId };
        const game = await Game.create(gameData);
        res.status(201).json(game);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;