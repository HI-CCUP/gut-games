import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    thumbnail: String,
    gameUrl: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Game", gameSchema);
