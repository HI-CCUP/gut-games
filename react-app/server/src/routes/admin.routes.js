import express from "express";
import Game from "../models/Game.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// Pobierz statystyki i listę gier dla admina
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
    const games = await Game.find().populate("author", "username");
    const userCount = await User.countDocuments();
    res.json({ games, userCount });
});

// Usuń grę
router.delete("/game/:id", authMiddleware, adminMiddleware, async (req, res) => {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: "Gra została usunięta" });
});

// Pobierz wszystkich użytkowników
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Nie wysyłamy hasha hasła!
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Błąd podczas pobierania użytkowników" });
    }
});

// Usuń użytkownika
router.delete("/user/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        
        if (!userToDelete) return res.status(404).json({ message: "Nie znaleziono użytkownika" });
        if (userToDelete.isAdmin) return res.status(403).json({ message: "Nie można usunąć innego admina!" });

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Użytkownik został usunięty" });
    } catch (err) {
        res.status(500).json({ message: "Błąd podczas usuwania" });
    }
});

router.delete("/comment/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const commentId = req.params.id;
        
        // Sprawdź czy model nazywa się Comment (z dużej litery)
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ message: "Nie znaleziono takiego komentarza w bazie." });
        }

        res.json({ message: "Komentarz został usunięty." });
    } catch (err) {
        console.error("BŁĄD BACKENDU:", err); // ZOBACZ TO W TERMINALU NODE.JS
        res.status(500).json({ message: "Błąd serwera podczas usuwania." });
    }
});

export default router;