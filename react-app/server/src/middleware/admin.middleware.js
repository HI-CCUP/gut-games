import User from "../models/User.js";

export default async function adminMiddleware(req, res, next) {
    try {
        // req.userId musi być wcześniej ustawione przez authMiddleware
        const user = await User.findById(req.userId);
        
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Odmowa dostępu: Wymagane uprawnienia administratora." });
        }
        
        next(); // Wszystko ok, przepuszczamy dalej
    } catch (err) {
        console.error("Błąd weryfikacji admina:", err);
        res.status(500).json({ message: "Błąd serwera podczas sprawdzania uprawnień." });
    }
}