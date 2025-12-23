import { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginuser } from "../Redux/loginslice";

function Login() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
   const handleLogin = async (e) => {
    e.preventDefault();

    if (!Email || !Password) {
        setError("Email and Password are required!");
        return;
    }

    setError("");

    const result = await dispatch(loginuser({ Email, Password }));

    if (loginuser.rejected.match(result)) {
        setError(result.payload.message || "Invalid email or password");
        return;
    }

    alert("Login successful");
    navigate("/home");
};

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>Bank Login</h2>

                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className={styles.inputBox}>
                        <input
                            type="email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Email</label>
                    </div>

                    <div className={styles.inputBox}>
                        <input
                            type="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label>Password</label>
                    </div>

                    <button className={styles.btn} type="submit">
                        Login
                    </button>
                </form>
                <div>
                    <p style={{ textAlign: "center", color: "black" }}>
                        Don't have an account?{" "}
                        <Link to="/" style={{ color: "blue" }}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
