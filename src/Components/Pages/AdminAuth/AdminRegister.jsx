// src/pages/AdminAuth/AdminRegister.jsx
import React, { useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AdminRegister.module.css";
import { Shield, User, Mail, Lock, ArrowLeft, UserPlus, AlertCircle, CheckCircle } from "lucide-react";

function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await API.post("/auth/register", form);
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error(err);
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
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className={styles.registerCard}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <UserPlus size={32} />
            </div>
            <h2>Create Admin Account</h2>
            <p>Register as an administrator to manage organizations</p>
         
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.successAlert}>
              <CheckCircle size={18} />
              <span>Account created successfully! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <User size={20} />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  value={form.name}
                  required
                  className={styles.input}
                />
              </div>
            </div>

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
                  type="password"
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  value={form.password}
                  required
                  minLength={6}
                  className={styles.input}
                />
              </div>
            </div>

          

            <button type="submit" disabled={isLoading || success} className={styles.submitBtn}>
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  Creating Account...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} />
                  Account Created!
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Admin Account
                </>
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.loginText}>
              Already have an admin account?{" "}
              <Link to="/admin/login" className={styles.link}>
                Sign in here
              </Link>
            </p>
            <div className={styles.divider}>
              <span>or</span>
            </div>
            <p className={styles.switchText}>
              Want to join as Tester or Developer?{" "}
              <Link to="/user/register" className={styles.switchLink}>
                Go to Team Registration
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;