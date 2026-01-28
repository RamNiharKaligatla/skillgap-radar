const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./db");

require("dotenv").config()

app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("SkillGap API running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Backend running on http://localhost:4000")
});

app.post("/analyze", (req, res) => {
    const { role, skills, requiredSkills } = req.body;

    if (!role || !Array.isArray(skills) || !Array.isArray(requiredSkills)) {
        return res.status(400).json({
            error: "Invalid request payload"
        });
    }

    const missing = requiredSkills.filter(
        skill => !skills.includes(skill)
    );

    db.prepare(`
        INSERT INTO analyses (role, skills, requiredSkills, missingSkills)
        VALUES (?, ?, ?, ?)
    `).run(
        role,
        JSON.stringify(skills),
        JSON.stringify(requiredSkills),
        JSON.stringify(missing)
    )

    res.json({
        role,
        missingSkills: missing,
        matched: skills.length,
    });
});

app.get("/history", (req, res) => {
    const rows = db.prepare(
        "SELECT * FROM analyses ORDER BY createdAt DESC LIMIT 20"
    ).all();

    res.json(rows);
});