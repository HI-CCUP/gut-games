import express from "express";

const router = express.Router();


router.get("/", (req, res) => {
    res.json({
        message: "Backend działa",
        time: new Date()
    });
});

export default router;
