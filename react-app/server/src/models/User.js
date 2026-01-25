import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    bio: { type: String, maxlength: 500, default: "" },
    avatarUrl: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
