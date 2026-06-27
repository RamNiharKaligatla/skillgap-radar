const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema(
    {
        role: String,
        skills: [String],
        requiredSkills: [String],
        missingSkills: [String],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);