import Game from "../models/Game.js";

export const incrementView = async (gameId) => {
    return await Game.findByIdAndUpdate(
        gameId,
        { $inc: { views: 1 } },
        { new: true }
    );
};

export const getGames = async () => {
    return await Game.find().select("title thumbnail views ratingAvg");
};

export const addGame = async (req, res) => {
    try {
        const { title, description, thumbnail } = req.body;
        const fileUrl = req.file.path; 

        const newGame = new Game({
            title: title,
            description: description,
            gameUrl: fileUrl,
            thumbnail: thumbnail || "https:/gut-games.vercel.app/bg.png",
            author: req.user._id,
        });

        await newGame.save();
        res.status(201).json({ message: "Gra dodana pomyślnie!", game: newGame });
    } catch (error) {
        console.error("Błąd dodawania gry:", error);
        res.status(500).json({ message: "Błąd serwera podczas dodawania gry" });
    }
};

