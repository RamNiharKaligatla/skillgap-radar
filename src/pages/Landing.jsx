import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div>
            <h1>SkillGap Radar</h1>

            <Link to="/signup">
                <button>Register</button>
            </Link>

            <br /><br />

            <Link to="/login">
                <button>Login</button>
            </Link>
        </div>
    );
}