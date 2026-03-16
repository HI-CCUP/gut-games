import express from "express";
import Game from "../models/Game.js";
import Comment from "../models/Comment.js";
import { incrementView, getGames } from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// --- FUNKCJA POMOCNICZA DO OBLICZEŃ ---
const updateGameRating = async (game, userId, ratingVal) => {
    if (!game.ratings) game.ratings = [];

    const existingIndex = game.ratings.findIndex(r => r.userId?.toString() === userId.toString());

    if (existingIndex >= 0) {
        game.ratings[existingIndex].rating = Number(ratingVal);
    } else {
        game.ratings.push({ userId, rating: Number(ratingVal) });
    }

    game.ratingCount = game.ratings.length;
    const sum = game.ratings.reduce((acc, curr) => acc + Number(curr.rating), 0);
    game.ratingAvg = sum / game.ratingCount;

    return await game.save();
};

// --- TRASY PUBLICZNE ---

// Pobierz wszystkie gry
router.get("/", async (req, res) => {
    try {
        const games = await getGames();
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Szczegóły konkretnej gry
router.get("/:id", async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate("author", "username");
        if (!game) return res.status(404).json({ message: "Nie znaleziono gry" });
        res.json(game);
    } catch (err) {
        res.status(500).json({ error: "Błąd bazy danych" });
    }
});

// Pobierz komentarze do gry
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

// --- TRASY WYMAGAJĄCE LOGOWANIA ---

// Dodaj komentarz i ocenę
router.post("/:id/comments", authMiddleware, async (req, res) => {
    try {
        const { content, rating } = req.body;
        const ratingVal = Number(rating) || 5;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: "Treść komentarza nie może być pusta" });
        }

        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: "Gra nie istnieje" });

        // 1. Zapisz komentarz
        const newComment = await Comment.create({
            game: req.params.id,
            user: req.userId,
            content: content,
            rating: ratingVal
        });

        // 2. Aktualizuj oceny w obiekcie gry (używamy pomocnika)
        const updatedGame = await updateGameRating(game, req.userId, ratingVal);

        const populatedComment = await newComment.populate("user", "username");
        
        res.status(201).json({ 
            message: "Dodano komentarz", 
            comment: populatedComment,
            ratingAvg: updatedGame.ratingAvg 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas dodawania komentarza" });
    }
});

// Sama ocena (bez komentarza)
router.post("/:id/rate", authMiddleware, async (req, res) => {
    try {
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Ocena musi mieścić się w przedziale 1-5" });
        }

        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: "Gra nie znaleziona" });

        const updatedGame = await updateGameRating(game, req.userId, rating);

        res.json({ 
            message: "Ocena zapisana", 
            ratingAvg: updatedGame.ratingAvg, 
            ratingCount: updatedGame.ratingCount 
        });
    } catch (err) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

// Licznik wyświetleń
router.post("/:id/view", async (req, res) => {
    try {
        const game = await incrementView(req.params.id);
        if (!game) return res.status(404).json({ message: "Gra nie istnieje" });
        res.json({ views: game.views });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;