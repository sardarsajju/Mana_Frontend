// src/pages/UserAuth/UserRegister.jsx
import React, { useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import styles from "./UserRegister.module.css";
import { 
  Users, User, Mail, Lock, ArrowLeft, UserPlus, 
  AlertCircle, CheckCircle, ChevronDown, TestTube, Code 
} from "lucide-react";

function UserRegister() {
 
const org_id = localStorage.getItem("org_id");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
   const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tester", // Default to tester
    org_id:org_id
  });
 

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
        navigate("/user/login");
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

        <div className={styles.registerCard}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <UserPlus size={32} />
            </div>
            <p>Create your tester or developer account</p>
            <div className={styles.roleBadges}>
              <div className={styles.badge}>
                <TestTube size={14} />
                <span>Tester</span>
              </div>
              <div className={styles.badge}>
                <Code size={14} />
                <span>Developer</span>
              </div>
            </div>
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

            <div className={styles.inputGroup}>
              <label htmlFor="role">Select Your Role</label>
              <div className={styles.selectWrapper}>
                <span className={styles.inputIcon}>
                  <Users size={20} />
                </span>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="tester">Tester - Report and track bugs</option>
                  <option value="developer">Developer - Fix and resolve bugs</option>
                </select>
                <span className={styles.selectArrow}>
                  <ChevronDown size={20} />
                </span>
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
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.loginText}>
              Already have an account?{" "}
              <Link to="/user/login" className={styles.link}>
                Sign in here
              </Link>
            </p>
            <div className={styles.divider}>
              <span>or</span>
            </div>
            <p className={styles.switchText}>
              Registering as an Administrator?{" "}
              <Link to="/admin/register" className={styles.switchLink}>
                Go to Admin Registration
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;