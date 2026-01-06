// src/pages/SuperAdmin/SuperAdminLogin.jsx
import React, { useContext, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import styles from "./SuperAdminLogin.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

function SuperAdminLogin() {
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
      const res = await API.post("/auth/login", form);

      // Only allow admin users for super admin access
      if (res.data.role !== "admin") {
        setError("Access denied. Only administrators can access the Super Admin panel.");
        setIsLoading(false);
        return;
      }

      // Store admin data with super admin flag
      const adminData = {
        ...res.data,
        isSuperAdmin: true
      };

      login(adminData);
      
      // Navigate to super admin dashboard first, or admin select organization
      navigate("/super-admin/dashboard");

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
        <div className={styles.circle3}></div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Left side - Branding */}
        <div className={styles.brandingSide}>
          <div className={styles.brandingContent}>
            <div className={styles.logoContainer}>
              <Shield size={48} />
              <h1>BugTracker</h1>
            </div>
            <h2>Super Admin Portal</h2>
            <p>
              Manage all organizations, monitor projects, and oversee the entire 
              bug tracking ecosystem from a single dashboard.
            </p>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🏢</div>
                <span>Manage All Organizations</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📊</div>
                <span>Project Analytics</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🔒</div>
                <span>Secure Admin Access</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>👥</div>
                <span>Team Overview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className={styles.formSide}>
          <div className={styles.loginCard}>
            <Link to="/" className={styles.backLink}>
              <ArrowLeft size={20} />
              Back to Home
            </Link>

            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <Shield size={32} />
              </div>
              <h2>Admin Login</h2>
              <p>Sign in with your administrator account</p>
              <div className={styles.adminBadge}>
                <AlertCircle size={14} />
                <span>Admin Access Only</span>
              </div>
            </div>

            {error && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Admin Email</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <Mail size={20} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter admin email"
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
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Access Admin Portal
                  </>
                )}
              </button>
            </form>

            <div className={styles.footer}>
              <p className={styles.registerText}>
                Need admin access?{" "}
                <Link to="/super-admin/register" className={styles.link}>
                  Register as Admin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLogin;