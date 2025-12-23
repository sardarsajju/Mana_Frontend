import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import styles from "./Login.module.css";   // ⭐ Import CSS Module

function Login() {
  const dispatch = useDispatch();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5005/api/auth/login", {
        mobile,
        password
      });

      dispatch(
        setUser({
          login_id: res.data.login_id,
          name: res.data.name,
          role: res.data.role
        })
      );

      if (res.data.role === "doctor") navigate("/doctor");
      else navigate("/patient");

    } catch (err) {
      alert("Invalid mobile or password");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button onClick={handleLogin} className={styles.button}>Login</button>

        <p
          className={styles.link}
          onClick={() => navigate("/register")}
        >
          Create an account
        </p>
      </div>
    </div>
  );
}

export default Login;
