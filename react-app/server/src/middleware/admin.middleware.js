import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: "Brak uprawnień administratora" });
        }
    } catch (err) {
        res.status(500).json({ message: "Błąd serwera" });
    }
};

export default adminMiddleware;






