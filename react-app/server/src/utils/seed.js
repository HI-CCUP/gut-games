import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import bcrypt from "bcrypt";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    await Comment.deleteMany({});

    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await User.create({
      username: "PixelMaster",
      email: "pixel@example.com",
      passwordHash,
      bio: "Kreatywny twórca gier retro",
      role: "ADMIN"
    });

    await Comment.create({ game: 1, user: user._id, content: "Zajebista gierka", rating: 5 });
    process.exit();
  } catch {
    process.exit(1);
  }
};

seed();

