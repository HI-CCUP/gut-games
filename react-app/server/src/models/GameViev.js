import mongoose from "mongoose";

const gameViewSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    ip: String,
    viewedAt: { type: Date, default: Date.now }
});

export default mongoose.model("GameView", gameViewSchema);
