import Game from "../models/Game.js";

// Eksportujemy pomocnika, jeśli chciałbyś go użyć w innych kontrolerach (np. przy komentarzach)
export const updateGameRating = async (game, userId, newRating) => {
    if (!game.ratings) game.ratings = [];

    const existingIndex = game.ratings.findIndex(r => r.userId?.toString() === userId.toString());

    if (existingIndex >= 0) {
        game.ratings[existingIndex].rating = Number(newRating);
    } else {
        game.ratings.push({ userId, rating: Number(newRating) });
    }

    game.ratingCount = game.ratings.length;
    const sum = game.ratings.reduce((acc, curr) => acc + Number(curr.rating), 0);
    
    // Używamy Number(), aby upewnić się, że w DB ląduje cyfra, a nie tekst
    game.ratingAvg = game.ratingCount > 0 ? Number((sum / game.ratingCount).toFixed(1)) : 0;

    return await game.save();
};

export const rateGame = async (req, res) => {
    try {
        const { rating } = req.body;
        const gameId = req.params.id;
        const userId = req.userId;

        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ message: "Gra nie istnieje" });

        const updatedGame = await updateGameRating(game, userId, rating);

        res.json({ 
            message: "Ocena zapisana", 
            ratingAvg: updatedGame.ratingAvg, 
            ratingCount: updatedGame.ratingCount 
        });
    } catch (err) {
        res.status(500).json({ error: "Błąd podczas oceniania" });
    }
};

export const incrementView = async (gameId) => {
    return await Game.findByIdAndUpdate(
        gameId,
        { $inc: { views: 1 } },
        { new: true }
    );
};

export const getGames = async () => {
    // Dodaj "ratingCount", jeśli chcesz go pokazywać na liście gier
    return await Game.find().select("title thumbnail views ratingAvg ratingCount");
};