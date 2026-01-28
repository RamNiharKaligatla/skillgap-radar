import { useEffect, useState } from "react";

export default function History() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/history`);

                if (!res.ok) {
                    throw new Error("Failed to load history");
                }

                const data = await res.json();

                const parsed = data.map(row => ({
                    ...row,
                    skills: JSON.parse(row.skills),
                    requiredSkills: JSON.parse(row.requiredSkills),
                    missingSkills: JSON.parse(row.missingSkills)
                }));

                setRecords(parsed);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    if (loading) return <p>Loading History...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1>Analysis History</h1>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Role</th>
                        <th>Selected Skills</th>
                        <th>Missing Skills</th>
                    </tr>
                </thead>

                <tbody>
                    {records.map(row => (
                        <tr key={row.id}>
                            <td>{row.createdAt}</td>
                            <td>{row.role}</td>
                            <td>{row.skills.join(", ")}</td>
                            <td>{row.missingSkills.join(", ")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}