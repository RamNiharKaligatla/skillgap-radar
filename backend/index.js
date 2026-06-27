require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const connectDB = require("./db/mongo");
connectDB();

const Analysis = require("./models/Analysis");

const bcrypt = require("bcrypt");
const User = require("./models/User");

const jwt = require("jsonwebtoken");
const auth = require("./middleware/Auth");

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("SkillGap API running");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "All fields are required",
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password: hashedPassword,
        })

        res.status(201).json({
            message: "User registered successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        })
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                error: "Invalid email or password",
            })
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful", token
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

app.post("/analyze", auth, async (req, res) => {
    const { role, skills, requiredSkills } = req.body;

    if (!role || !Array.isArray(skills) || !Array.isArray(requiredSkills)) {
        return res.status(400).json({
            error: "Invalid request payload"
        });
    }

    const missing = requiredSkills.filter(
        skill => !skills.includes(skill)
    );

    const matched = skills.length;

    const percentage = Math.round(
        (matched / requiredSkills.length) * 100
    );

    await Analysis.create({
        role,
        skills,
        requiredSkills,
        missingSkills: missing,

        user: req.user.id
    });

    res.json({
        role,
        matched,
        missingSkills: missing,
        percentage
    });
});

app.get("/history", auth, async (req, res) => {
    const records = await Analysis.find({
        user: req.user.id
    })
        .sort({ createdAt: -1 })
        .limit(20);

    res.json(records);
});