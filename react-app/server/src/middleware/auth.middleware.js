import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Brak autoryzacji, zaloguj się ponownie" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error("Błąd weryfikacji tokena:", err.message);
    return res.status(401).json({ message: "Token jest nieważny lub wygasł" });
  }
};

export default authMiddleware;