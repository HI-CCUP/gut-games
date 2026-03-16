import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    Pobiera wszystkich użytkowników (tylko dla admina)
 */
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Pobieramy wszystkich, ale ukrywamy hasła
        const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Błąd podczas pobierania użytkowników" });
    }
});

export default router;