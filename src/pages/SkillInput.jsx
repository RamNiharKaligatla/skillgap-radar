import { useState } from "react";
import { roleSkills } from "../data/roles";

export default function SkillInput({ role }) {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const skills = roleSkills[role] || [];

    function toggleSkill(skill) {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    }

    async function analyzeSkills() {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    role,
                    skills: selectedSkills,
                    requiredSkills: skills
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Server error");
            }

            const data = await response.json();
            setAnalysis(data);

            localStorage.setItem("token", data.token);
            setAnalysis(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Skills for {role}</h1>

            {skills.map(skill => (
                <div key={skill}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                        />
                        {skill}
                    </label>
                </div>
            ))}

            <p>
                <strong>Selected skills:</strong> {selectedSkills.join(", ")}
            </p>

            <p>
                <strong>Skill Match:</strong> {analysis.percentage}%
            </p>

            <button
                onClick={analyzeSkills}
                disabled={loading || selectedSkills.length === 0}
            >
                {loading ? "Analyzing..." : "Analyze Skill Gap"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {analysis && (
                <>
                    <h2>Server Analysis</h2>

                    <p>
                        <strong>Role:</strong> {analysis.role}
                    </p>
                    <p>
                        <strong>Matched Skills:</strong> {analysis.matched}
                    </p>
                    <p>
                        <strong>Skill Match:</strong> {analysis.percentage}%
                    </p>

                    <h3>Matched Skills</h3>

                    <ul>
                        {selectedSkills.map(skill => (
                            <li key={skill}>✅ {skill}</li>
                        ))}
                    </ul>

                    <h3>Missing Skills</h3>

                    <ul>
                        {analysis.missingSkills.map(skill => (
                            <li key={skill}>❌ {skill}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}