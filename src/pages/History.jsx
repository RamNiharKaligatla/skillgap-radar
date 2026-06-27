import { useEffect, useState } from "react";

export default function History() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) {
                    const err = await res.json();
                    console.log(err);
                    throw new Error(err.error || "Failed to load history");
                }

                const data = await res.json();

                setRecords(data);
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
    if (records.length === 0) {
        return (
            <div>
                <h1>Analysis History</h1>
                <p>No analyses yet.</p>
                <p>Analyze your first role</p>
            </div>
        )
    }

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
                        <tr key={row._id}>
                            <td>{new Date(row.createdAt).toLocaleString()}</td>
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