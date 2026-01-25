import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js"

dotenv.config();

const seed = async () => {
    try {
        await connectDB();

        await User.deleteMany({});
        await Comment.deleteMany({});

        await User.create({
            username: "PixelMaster",
            email: "pixel@example.com",
            passwordHash: "hashedpassword123",
            bio: "Kreatywny twórca gier retro",
            role: "ADMIN"
        });

        console.log("✅ Przykładowy użytkownik dodany");

        await Comment.create({
            game: 1,
            user: 1,
            content: "Zajebista gierka",
            rating: 5,
        });
        console.log("✅ Przykładowy komentarz dodany");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
