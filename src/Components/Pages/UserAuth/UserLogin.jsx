// src/pages/UserAuth/UserLogin.jsx
import React, { useContext, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import styles from "./UserLogin.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { Users, Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from "lucide-react";

function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      // Login successful - backend returns user data with role
      login(res.data);

      // Navigate based on the role returned from backend
      if (res.data.role === "admin") {
        localStorage.removeItem("org_id");
        localStorage.removeItem("org_name");
        navigate("/admin/select-organization");
      } else if (res.data.role === "tester") {
        navigate("/tester/dashboard");
      } else if (res.data.role === "developer") {
        navigate("/bugs");
      } else {
        setError("Invalid user role. Please contact administrator.");
      }

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.backgroundDecor}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <Users size={32} />
            </div>
            <h2>Login to BugTracker</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <Mail size={20} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={form.email}
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <Lock size={20} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={form.password}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <div className={styles.divider}>
              <span>Need Help?</span>
            </div>
            <p className={styles.switchText}>
              Contact your administrator for account access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;