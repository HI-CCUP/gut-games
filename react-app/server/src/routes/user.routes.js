import express from "express";
import User from "../models/User.js";
import Game from "../models/Game.js"; // Import gier, jeśli chcesz wyświetlić gry usera
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Pobiera dane aktualnie zalogowanego użytkownika
 */
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie istnieje" });
        }

        const userGames = await Game.find({ author: req.userId });

        res.json({
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            games: userGames
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania profilu" });
    }
});

/**
 * @route   GET /api/users/rankings
 * @desc    Pobiera ranking najbardziej aktywnych użytkowników
 */
router.get("/rankings", async (req, res) => {
    try {
        const topUsers = await Game.aggregate([
            {
                $group: {
                    _id: "$author",
                    gamesAdded: { $sum: 1 }
                }
            },
            { $sort: { gamesAdded: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    gamesAdded: 1,
                    username: "$userDetails.username"
                }
            }
        ]);

        res.json(topUsers);
    } catch (err) {
        console.error("Błąd rankingu:", err);
        res.status(500).json({ message: "Błąd podczas generowania rankingu" });
    }
});

export default router;