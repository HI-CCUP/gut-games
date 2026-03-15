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