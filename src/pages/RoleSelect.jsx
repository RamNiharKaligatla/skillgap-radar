import { Link } from "react-router-dom";

export default function RoleSelect({ role, setRole }) {
    return (
        <div>
            <h1>Select your target role</h1>

            <button onClick={() => setRole("Frontend Developer")}>
                Frontend Developer
            </button>

            <button onClick={() => setRole("Backend Developer")}>
                Backend Developer
            </button>

            <button onClick={() => setRole("Data Analyst")}>
                Data Analyst
            </button>

            <p>
                <strong>Selected Role:</strong> {role}
            </p>

            {role && (
                <Link to="/skills">
                    Continue
                </Link>
            )}
        </div>
    );
}