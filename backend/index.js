require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const connectDB = require("./db/mongo");
connectDB();

const Analysis = require("./models/Analysis");

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("SkillGap API running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

app.post("/analyze", async (req, res) => {
    const { role, skills, requiredSkills } = req.body;

    if (!role || !Array.isArray(skills) || !Array.isArray(requiredSkills)) {
        return res.status(400).json({
            error: "Invalid request payload"
        });
    }

    const missing = requiredSkills.filter(
        skill => !skills.includes(skill)
    );

    await Analysis.create({
        role,
        skills,
        requiredSkills,
        missingSkills: missing,
    });

    res.json({
        role,
        missingSkills: missing,
        matched: skills.length,
    });
});

app.get("/history", async (req, res) => {
    const records = await Analysis.find()
        .sort({ createdAt: -1 })
        .limit(20);

    res.json(records);
});