import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    bio: { type: String, maxlength: 500, default: "" },
    avatarUrl: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
