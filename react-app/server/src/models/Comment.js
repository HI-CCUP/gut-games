import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 1000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", commentSchema);
