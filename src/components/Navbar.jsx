import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav>
            <Link to="/">Home</Link>{" | "}
            <Link to="/history">History</Link>{" | "}
            <button onClick={logout}>
                Logout
            </button>
        </nav>
    );
}