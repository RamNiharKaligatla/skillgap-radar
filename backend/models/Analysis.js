const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema(
    {
        role: String,
        skills: [String],
        requiredSkills: [String],
        missingSkills: [String],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);